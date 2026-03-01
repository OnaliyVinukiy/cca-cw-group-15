CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Identity Schema
CREATE SCHEMA IF NOT EXISTS identity;
CREATE TABLE identity.users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Salary Schema
CREATE SCHEMA IF NOT EXISTS salary;
CREATE TABLE salary.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(100),
    company VARCHAR(100),
    country VARCHAR(100),
    amount DECIMAL,
    status VARCHAR(20) DEFAULT 'PENDING',
    anonymize_flag BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Schema
CREATE SCHEMA IF NOT EXISTS community;
CREATE TABLE community.votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES salary.submissions(id),
    user_id UUID,
    vote_type VARCHAR(10),
    UNIQUE(submission_id, user_id)
);