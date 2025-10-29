## ABAC Usage Guide

This backend demonstrates Attribute-Based Access Control (ABAC) for both database resources (documents, users) and external web resources (e.g., GitHub).

### Concepts

- **Subject attributes**: `role`, `department`, optional `attributes` JSON.
- **Resource attributes**: for documents: `department`, `status`, `sensitivity`; for web resources: `service` (e.g., `github`).
- **Context attributes**: `hour` (UTC hour) used for time windows.

### Policy Model (Casbin)

- Model: `backend/casbin_model.conf`
- Policy store: `backend/casbin_policy.csv`

Policy format: `sub, dept, status, act, res, start, end`

Examples:

- `p, admin, *, *, *, documents, *, *` → Admin can do anything on documents.
- `p, admin, *, *, *, github, *, *` → Admin can do anything on GitHub.
- `p, manager, sales, draft, read, documents, 08:00, 20:00` → Sales managers can read draft documents 08–20 UTC.

Use the API to manage policies:

- GET `/policies`
- POST `/policies` with body `{ sub, dept, status, act, res, start, end }`
- DELETE `/policies` with same fields in body

### Column-Based Access (SQL)

Column visibility is governed by the `column_policies` table:

```
resource VARCHAR(50),  -- 'users' | 'documents'
role     VARCHAR(50),
columns  TEXT[]        -- allowed columns
```

Seed policies are created in `backend/init_db.sql`. The backend reads them at startup and applies filtering to `/users` and `/documents` responses.

Manage column policies:

- GET `/column-policies`
- POST `/column-policies` with `{ resource, role, columns }` (upsert)
- DELETE `/column-policies?resource=documents&role=viewer`

### Web Resource Authorization

Use `/auth/web` to check access to services like GitHub:

Request body:

```
{
  "user_role": "admin",
  "action": "read",
  "service": "github",
  "user_department": "*",       // optional
  "document_status": "*"        // optional
}
```

Response:

```
{ "allowed": true, "reason": "Access granted" }
```

Policies for `service` are in `casbin_policy.csv` with `res` = `github` (or other service name).

### Test Data

`backend/init_db.sql` seeds users and documents across departments with varying roles and statuses.

### Running

```
docker-compose up --build
```

Backend: `http://localhost:5000` → interactive docs at `/docs`.

### Extending

- Add new services: append `p, <role>, *, *, <action>, <service>, *, *` lines to `casbin_policy.csv` or use the `/policies` API.
- Add new roles/columns: upsert into `/column-policies`.
