-- Migration: Create audit logs table
-- Description: Comprehensive audit trail for all system actions
-- Created: 2025-08-16

-- Create audit action enum
CREATE TYPE audit_action AS ENUM (
    'create',
    'read',
    'update',
    'delete',
    'login',
    'logout',
    'login_failed',
    'password_change',
    'password_reset',
    'email_verify',
    'account_lock',
    'account_unlock',
    'role_change',
    'permission_grant',
    'permission_revoke',
    'data_export',
    'data_import',
    'file_upload',
    'file_download',
    'file_delete',
    'payment_process',
    'fee_collect',
    'grade_submit',
    'attendance_mark',
    'exam_create',
    'exam_submit',
    'announcement_post',
    'message_send'
);

-- Create audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action audit_action NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    entity_name VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    risk_score INTEGER DEFAULT 0,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for audit logs (read-heavy table)
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_ip_address ON audit_logs(ip_address);
CREATE INDEX idx_audit_logs_session_id ON audit_logs(session_id);
CREATE INDEX idx_audit_logs_success ON audit_logs(success);

-- Composite indexes for common queries
CREATE INDEX idx_audit_logs_actor_action ON audit_logs(actor_id, action, created_at);
CREATE INDEX idx_audit_logs_entity_action ON audit_logs(entity_type, action, created_at);
CREATE INDEX idx_audit_logs_risk_score ON audit_logs(risk_score DESC, created_at DESC);

-- GIN indexes for JSONB columns
CREATE INDEX idx_audit_logs_metadata ON audit_logs USING GIN(metadata);
CREATE INDEX idx_audit_logs_old_values ON audit_logs USING GIN(old_values);
CREATE INDEX idx_audit_logs_new_values ON audit_logs USING GIN(new_values);

-- Add constraints
ALTER TABLE audit_logs ADD CONSTRAINT chk_risk_score 
    CHECK (risk_score >= 0 AND risk_score <= 100);

ALTER TABLE audit_logs ADD CONSTRAINT chk_execution_time 
    CHECK (execution_time_ms >= 0);

-- Add comments
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for all system actions and security events';
COMMENT ON COLUMN audit_logs.actor_id IS 'User who performed the action (NULL for system actions)';
COMMENT ON COLUMN audit_logs.action IS 'Type of action performed';
COMMENT ON COLUMN audit_logs.entity_type IS 'Type of entity affected (table name, resource type)';
COMMENT ON COLUMN audit_logs.entity_id IS 'ID of the specific entity affected';
COMMENT ON COLUMN audit_logs.old_values IS 'Previous values before change (JSON)';
COMMENT ON COLUMN audit_logs.new_values IS 'New values after change (JSON)';
COMMENT ON COLUMN audit_logs.metadata IS 'Additional context and metadata (JSON)';
COMMENT ON COLUMN audit_logs.risk_score IS 'Security risk assessment score (0-100)';
COMMENT ON COLUMN audit_logs.execution_time_ms IS 'Time taken to execute the action in milliseconds';
