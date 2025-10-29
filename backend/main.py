from fastapi import FastAPI, HTTPException, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Any
import json
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
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
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

# custom function: timeInRange("HH:MM", "HH:MM", hour:int)
def time_in_range(start: str, end: str, hour: int) -> bool:
    try:
        if start == "*" or end == "*":
            return True
        s_h = int(start.split(":")[0])
        e_h = int(end.split(":")[0])
        h = int(hour)
        if s_h <= e_h:
            return s_h <= h <= e_h
        # overnight window (e.g., 22:00-06:00)
        return h >= s_h or h <= e_h
    except Exception:
        return True

enforcer.add_function("timeInRange", time_in_range)

# Pydantic Models
class User(BaseModel):
    id: Optional[int] = None
    username: str
    role: str
    department: str
    attributes: Optional[dict] = None
class CreateUser(BaseModel):
    username: str
    role: str
    department: str
    attributes: Optional[Any] = None


class Document(BaseModel):
    id: Optional[int] = None
    title: str
    department: str
    status: str
    sensitivity: str

class Policy(BaseModel):
    sub: str
    dept: str
    status: str
    act: str
    res: str
    start: str
    end: str

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
    
    # Check with Casbin (resource documents + current hour UTC)
    current_hour = datetime.utcnow().hour
    allowed = enforcer.enforce(user_role, doc["department"], doc["status"], action, "documents", current_hour)
    
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
async def get_users(X_User_Role: Optional[str] = Header(None)):
    """Get all users"""
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM users")
    users = cur.fetchall()
    cur.close()
    conn.close()
    role = (X_User_Role or "viewer").lower()
    allowed = VISIBILITY["users"].get(role, VISIBILITY["users"]["viewer"]) 
    # Remove attributes by default unless explicitly allowed
    filtered = filter_fields(users, allowed)
    return {"users": filtered}

@app.post("/users")
async def create_user(user: CreateUser):
    """Create a new user"""
    conn = get_db()
    cur = conn.cursor()
    # Normalize attributes: accept dict or JSON string
    attrs: dict = {}
    if user.attributes is not None:
        if isinstance(user.attributes, dict):
            attrs = user.attributes
        elif isinstance(user.attributes, str):
            try:
                parsed = json.loads(user.attributes)
                if isinstance(parsed, dict):
                    attrs = parsed
            except Exception:
                attrs = {}
    cur.execute(
        "INSERT INTO users (username, role, department, attributes) VALUES (%s, %s, %s, %s) RETURNING id",
        (user.username, user.role, user.department, json.dumps(attrs))
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

VISIBILITY = {
    "users": {
        "admin": ["id", "username", "role", "department", "attributes"],
        "accountant": ["id", "username", "department"],
        "analyst": ["id", "username", "department"],
        "manager": ["id", "username", "role", "department"],
        "employee": ["id", "username", "department"],
        "viewer": ["username", "department"],
    },
    "documents": {
        "admin": ["id", "title", "department", "status", "sensitivity"],
        "accountant": ["id", "title", "sensitivity"],
        "analyst": ["id", "title", "status"],
        "manager": ["id", "title", "department", "status"],
        "employee": ["id", "title", "department"],
        "viewer": ["title"],
    },
}


def filter_fields(items, allowed):
    filtered = []
    for it in items:
        filtered.append({k: v for k, v in dict(it).items() if k in allowed})
    return filtered


@app.get("/documents")
async def get_documents(X_User_Role: Optional[str] = Header(None)):
    """Get all documents"""
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM documents")
    docs = cur.fetchall()
    cur.close()
    conn.close()
    role = (X_User_Role or "viewer").lower()
    allowed = VISIBILITY["documents"].get(role, VISIBILITY["documents"]["viewer"])
    return {"documents": filter_fields(docs, allowed)}

@app.post("/documents")
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

@app.put("/documents/{doc_id}")
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
    # policy row: [sub, dept, status, act, res, start, end]
    return {"policies": [
        {"sub": p[0], "dept": p[1], "status": p[2], "act": p[3], "res": p[4], "start": p[5], "end": p[6]} for p in policies
    ]}

@app.post("/policies")
async def add_policy(policy: Policy):
    """Add a new policy"""
    enforcer.add_policy(policy.sub, policy.dept, policy.status, policy.act, policy.res, policy.start, policy.end)
    enforcer.save_policy()
    return {"message": "Policy added"}

@app.delete("/policies")
async def remove_policy(request: Request):
    """Remove a policy"""
    body = await request.json()
    sub = body.get('sub')
    dept = body.get('dept')
    status = body.get('status')
    act = body.get('act')
    res = body.get('res')
    start = body.get('start')
    end = body.get('end')
    
    if not all([sub, dept, status, act, res, start, end]):
        return {"message": "Policy data required"}
    
    result = enforcer.remove_policy(sub, dept, status, act, res, start, end)
    if result:
        enforcer.save_policy()
        return {"message": "Policy removed"}
    return {"message": "Policy not found"}

# ============= INTEGRATIONS =============

@app.post("/integrations/connect")
async def connect_integration(request: Request):
    body = await request.json()
    service = body.get("service")
    if not service:
        raise HTTPException(status_code=400, detail="service is required")
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS integrations (
            id SERIAL PRIMARY KEY,
            service VARCHAR(100) UNIQUE,
            connected_at TIMESTAMP
        )
    """)
    cur.execute(
        "INSERT INTO integrations (service, connected_at) VALUES (%s, now()) ON CONFLICT (service) DO UPDATE SET connected_at = EXCLUDED.connected_at",
        (service,)
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Integration connected", "service": service}

@app.get("/integrations")
async def list_integrations():
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS integrations (
            id SERIAL PRIMARY KEY,
            service VARCHAR(100) UNIQUE,
            connected_at TIMESTAMP
        )
    """)
    cur.execute("SELECT service, connected_at FROM integrations ORDER BY service")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return {"integrations": [dict(r) for r in rows]}

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

