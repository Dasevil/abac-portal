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

-- Insert sample data
INSERT INTO users (username, role, department, attributes) VALUES
    ('john', 'manager', 'sales', '{"level": "senior"}'),
    ('jane', 'employee', 'sales', '{"level": "junior"}'),
    ('bob', 'viewer', 'sales', '{"level": "guest"}'),
    ('alice', 'manager', 'engineering', '{"level": "senior"}');

INSERT INTO documents (title, department, status, sensitivity) VALUES
    ('Sales Report Q1', 'sales', 'approved', 'confidential'),
    ('Draft Proposal', 'sales', 'draft', 'public'),
    ('Engineering Docs', 'engineering', 'approved', 'confidential'),
    ('Public Announcement', 'sales', 'approved', 'public');

