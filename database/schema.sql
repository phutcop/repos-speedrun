-- finance-ui PostgreSQL Schema

CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, name)
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, name)
);

CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    department VARCHAR(255),
    category VARCHAR(255),
    month VARCHAR(7) NOT NULL, -- YYYY-MM
    budgeted_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, department, category, month)
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT NOT NULL,
    vendor VARCHAR(255),
    department VARCHAR(255),
    category VARCHAR(255),
    confidence DECIMAL(3, 2), -- 0.00 to 1.00
    human_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE insights (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- YYYY-MM
    type VARCHAR(50) NOT NULL, -- 'runaway_vendor', 'budget_breach', etc.
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high'
    message TEXT NOT NULL,
    evidence JSONB,
    dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_expenses_company_id ON expenses(company_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_department ON expenses(department);
CREATE INDEX idx_budgets_company_month ON budgets(company_id, month);

-- Create a read-only role for the AI service
-- (In Supabase, you might use Row Level Security instead, but this follows the spec)
-- CREATE ROLE ai_readonly WITH LOGIN PASSWORD 'ai_readonly_password';
-- GRANT CONNECT ON DATABASE your_db_name TO ai_readonly;
-- GRANT USAGE ON SCHEMA public TO ai_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO ai_readonly;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ai_readonly;
