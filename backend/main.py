from fastapi import FastAPI, HTTPException, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import casbin
import os

# Initialize FastAPI
app = FastAPI(title="ABAC Portal API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://abac:secret@postgres:5432/abac_db")

def get_db():
    conn = psycopg2.connect(DATABASE_URL)
    return conn

# Initialize Casbin
enforcer = casbin.Enforcer("./casbin_model.conf", "./casbin_policy.csv")

# Pydantic Models
class User(BaseModel):
    id: Optional[int] = None
    username: str
    role: str
    department: str
    attributes: Optional[dict] = None

class Document(BaseModel):
    id: Optional[int] = None
    title: str
    department: str
    status: str
    sensitivity: str

class Policy(BaseModel):
    sub: str
    obj: str
    act: str

class AccessRequest(BaseModel):
    user_role: str
    user_department: str
    action: str
    document_id: int

# ============= AUTH / ACCESS CONTROL =============

@app.post("/auth")
async def check_access(
    request: AccessRequest,
    X_User_Role: Optional[str] = Header(None),
    X_User_Department: Optional[str] = Header(None),
    X_Action: Optional[str] = Header(None),
    X_Document_Id: Optional[int] = Header(None)
):
    """Check access based on ABAC model"""
    # Get document info from DB
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    doc_id = X_Document_Id or request.document_id
    action = X_Action or request.action
    user_role = X_User_Role or request.user_role
    user_department = X_User_Department or request.user_department
    
    cur.execute("SELECT * FROM documents WHERE id = %s", (doc_id,))
    doc = cur.fetchone()
    
    if not doc:
        return {"allowed": False, "reason": "Document not found"}
    
    # Check with Casbin
    allowed = enforcer.enforce(user_role, doc["department"], doc["status"], action)
    
    # Log the decision
    cur.execute(
        "INSERT INTO access_logs (user_id, action, resource, decision) VALUES (%s, %s, %s, %s)",
        (None, f"{action} on doc {doc_id}", f"document_{doc_id}", allowed)
    )
    conn.commit()
    
    cur.close()
    conn.close()
    
    return {
        "allowed": allowed,
        "reason": "Access granted" if allowed else "Access denied by policy",
        "document": dict(doc)
    }

# ============= USERS =============

@app.get("/users")
async def get_users():
    """Get all users"""
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM users")
    users = cur.fetchall()
    cur.close()
    conn.close()
    return {"users": [dict(u) for u in users]}

@app.post("/users")
async def create_user(user: User):
    """Create a new user"""
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO users (username, role, department, attributes) VALUES (%s, %s, %s, %s) RETURNING id",
        (user.username, user.role, user.department, str(user.attributes) if user.attributes else "{}")
    )
    user_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return {"id": user_id, "message": "User created"}

@app.put("/users/{user_id}")
async def update_user(user_id: int, user: User):
    """Update user"""
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "UPDATE users SET username=%s, role=%s, department=%s, attributes=%s WHERE id=%s",
        (user.username, user.role, user.department, str(user.attributes) if user.attributes else "{}", user_id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "User updated"}

@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    """Delete user"""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE id=%s", (user_id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "User deleted"}

# ============= DOCUMENTS =============

@app.get("/docs")
async def get_documents():
    """Get all documents"""
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM documents")
    docs = cur.fetchall()
    cur.close()
    conn.close()
    return {"documents": [dict(d) for d in docs]}

@app.post("/docs")
async def create_document(doc: Document):
    """Create a new document"""
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO documents (title, department, status, sensitivity) VALUES (%s, %s, %s, %s) RETURNING id",
        (doc.title, doc.department, doc.status, doc.sensitivity)
    )
    doc_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return {"id": doc_id, "message": "Document created"}

@app.put("/docs/{doc_id}")
async def update_document(doc_id: int, doc: Document):
    """Update document"""
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "UPDATE documents SET title=%s, department=%s, status=%s, sensitivity=%s WHERE id=%s",
        (doc.title, doc.department, doc.status, doc.sensitivity, doc_id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Document updated"}

# ============= POLICIES =============

@app.get("/policies")
async def get_policies():
    """Get all Casbin policies"""
    policies = enforcer.get_policy()
    return {"policies": [{"sub": p[0], "obj": p[1], "act": p[2]} for p in policies]}

@app.post("/policies")
async def add_policy(policy: Policy):
    """Add a new policy"""
    enforcer.add_policy(policy.sub, policy.obj, policy.act)
    enforcer.save_policy()
    return {"message": "Policy added"}

@app.delete("/policies")
async def remove_policy(request: Request):
    """Remove a policy"""
    body = await request.json()
    sub = body.get('sub')
    obj = body.get('obj')
    act = body.get('act')
    
    if not all([sub, obj, act]):
        return {"message": "Policy data required"}
    
    result = enforcer.remove_policy(sub, obj, act)
    if result:
        enforcer.save_policy()
        return {"message": "Policy removed"}
    return {"message": "Policy not found"}

# ============= LOGS =============

@app.get("/logs")
async def get_logs():
    """Get access logs"""
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM access_logs ORDER BY timestamp DESC LIMIT 100")
    logs = cur.fetchall()
    cur.close()
    conn.close()
    return {"logs": [dict(log) for log in logs]}

@app.get("/")
async def root():
    return {"message": "ABAC Portal API", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)

