-- Migration: Create sessions table
-- Description: JWT session management and token tracking
-- Created: 2025-08-16

-- Create sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    refresh_expires_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_by UUID REFERENCES users(id) ON DELETE SET NULL,
    revoke_reason VARCHAR(255)
);

-- Create indexes
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_refresh_token_hash ON sessions(refresh_token_hash) WHERE refresh_token_hash IS NOT NULL;
CREATE INDEX idx_sessions_active ON sessions(is_active, expires_at);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_last_activity ON sessions(last_activity_at);
CREATE INDEX idx_sessions_ip_address ON sessions(ip_address);

-- Composite indexes for common queries
CREATE INDEX idx_sessions_user_active ON sessions(user_id, is_active, expires_at);
CREATE INDEX idx_sessions_cleanup ON sessions(expires_at, is_active) WHERE is_active = FALSE;

-- GIN index for device_info JSONB
CREATE INDEX idx_sessions_device_info ON sessions USING GIN(device_info);

-- Add constraints
ALTER TABLE sessions ADD CONSTRAINT chk_expires_at_future 
    CHECK (expires_at > created_at);

ALTER TABLE sessions ADD CONSTRAINT chk_refresh_expires_logical 
    CHECK (refresh_expires_at IS NULL OR refresh_expires_at > expires_at);

-- Function to auto-update last_activity_at
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update if more than 5 minutes have passed
    IF (EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - OLD.last_activity_at)) > 300) THEN
        NEW.last_activity_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for session activity tracking
CREATE TRIGGER trigger_sessions_activity
    BEFORE UPDATE ON sessions
    FOR EACH ROW
    WHEN (OLD.is_active = TRUE AND NEW.is_active = TRUE)
    EXECUTE FUNCTION update_session_activity();

-- Add comments
COMMENT ON TABLE sessions IS 'JWT session management and token tracking for security';
COMMENT ON COLUMN sessions.token_hash IS 'SHA-256 hash of the JWT token for revocation';
COMMENT ON COLUMN sessions.refresh_token_hash IS 'SHA-256 hash of the refresh token';
COMMENT ON COLUMN sessions.device_info IS 'Device fingerprinting and metadata (JSON)';
COMMENT ON COLUMN sessions.is_active IS 'Whether the session is currently active';
COMMENT ON COLUMN sessions.expires_at IS 'JWT token expiration timestamp';
COMMENT ON COLUMN sessions.refresh_expires_at IS 'Refresh token expiration timestamp';
COMMENT ON COLUMN sessions.revoked_by IS 'User who revoked the session (admin action)';
