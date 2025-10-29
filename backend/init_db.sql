CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    role VARCHAR(50),
    department VARCHAR(50),
    attributes JSONB
);

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    department VARCHAR(50),
    status VARCHAR(20),
    sensitivity VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS access_logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    action VARCHAR(50),
    resource VARCHAR(50),
    decision BOOLEAN,
    timestamp TIMESTAMP DEFAULT now()
);

-- Column visibility policies (column-based access)
CREATE TABLE IF NOT EXISTS column_policies (
    id SERIAL PRIMARY KEY,
    resource VARCHAR(50) NOT NULL, -- e.g., 'users', 'documents'
    role VARCHAR(50) NOT NULL,
    columns TEXT[] NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_column_policies_resource_role ON column_policies(resource, role);

-- Insert sample data
INSERT INTO users (username, role, department, attributes) VALUES
    ('john', 'manager', 'sales', '{"level": "senior"}'),
    ('jane', 'employee', 'sales', '{"level": "junior"}'),
    ('bob', 'viewer', 'sales', '{"level": "guest"}'),
    ('alice', 'manager', 'engineering', '{"level": "senior"}'),
    ('eve', 'admin', 'security', '{"clearance": "top"}'),
    ('mike', 'analyst', 'finance', '{"level": "mid"}');

INSERT INTO documents (title, department, status, sensitivity) VALUES
    ('Sales Report Q1', 'sales', 'approved', 'confidential'),
    ('Draft Proposal', 'sales', 'draft', 'public'),
    ('Engineering Docs', 'engineering', 'approved', 'confidential'),
    ('Public Announcement', 'sales', 'approved', 'public'),
    ('Budget 2025', 'finance', 'draft', 'confidential'),
    ('Release Notes', 'engineering', 'approved', 'public');

-- Seed column policies if empty
INSERT INTO column_policies (resource, role, columns) VALUES
    ('users', 'admin', ARRAY['id','username','role','department','attributes']),
    ('users', 'accountant', ARRAY['id','username','department']),
    ('users', 'analyst', ARRAY['id','username','department']),
    ('users', 'manager', ARRAY['id','username','role','department']),
    ('users', 'employee', ARRAY['id','username','department']),
    ('users', 'viewer', ARRAY['username','department']),
    ('documents', 'admin', ARRAY['id','title','department','status','sensitivity']),
    ('documents', 'accountant', ARRAY['id','title','sensitivity']),
    ('documents', 'analyst', ARRAY['id','title','status']),
    ('documents', 'manager', ARRAY['id','title','department','status']),
    ('documents', 'employee', ARRAY['id','title','department']),
    ('documents', 'viewer', ARRAY['title'])
ON CONFLICT DO NOTHING;

