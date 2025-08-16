-- Migration: Create users table
-- Description: Core user authentication table with role-based access
-- Created: 2025-08-16

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user roles enum
CREATE TYPE user_role AS ENUM (
    'admin',
    'coordinator', 
    'teacher',
    'student',
    'parent',
    'librarian',
    'media_coordinator'
);

-- Create user status enum
CREATE TYPE user_status AS ENUM (
    'active',
    'inactive',
    'suspended',
    'pending_verification'
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    status user_status DEFAULT 'pending_verification',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_status ON users(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login ON users(last_login_at);

-- Create partial index for active users only
CREATE INDEX idx_users_active ON users(id) WHERE status = 'active' AND deleted_at IS NULL;

-- Add constraints
ALTER TABLE users ADD CONSTRAINT chk_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE users ADD CONSTRAINT chk_failed_attempts 
    CHECK (failed_login_attempts >= 0 AND failed_login_attempts <= 10);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE users IS 'Core user authentication and authorization table';
COMMENT ON COLUMN users.id IS 'Unique identifier for the user (UUID)';
COMMENT ON COLUMN users.email IS 'User email address (unique, used for login)';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password (minimum 12 rounds)';
COMMENT ON COLUMN users.role IS 'User role for authorization (RBAC)';
COMMENT ON COLUMN users.status IS 'Account status for access control';
COMMENT ON COLUMN users.failed_login_attempts IS 'Counter for account lockout security';
COMMENT ON COLUMN users.locked_until IS 'Account lockout expiration timestamp';
COMMENT ON COLUMN users.deleted_at IS 'Soft delete timestamp for audit trails';
