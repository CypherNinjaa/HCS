-- Migration: Create migrations tracking table
-- Description: Track applied database migrations for version control
-- Created: 2025-08-16

-- Create migrations table
CREATE TABLE migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) UNIQUE NOT NULL,
    batch INTEGER NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms INTEGER,
    checksum VARCHAR(64),
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT
);

-- Create indexes
CREATE INDEX idx_migrations_batch ON migrations(batch);
CREATE INDEX idx_migrations_executed_at ON migrations(executed_at);
CREATE INDEX idx_migrations_success ON migrations(success);

-- Add constraints
ALTER TABLE migrations ADD CONSTRAINT chk_execution_time 
    CHECK (execution_time_ms IS NULL OR execution_time_ms >= 0);

-- Add comments
COMMENT ON TABLE migrations IS 'Track applied database migrations for version control';
COMMENT ON COLUMN migrations.filename IS 'Migration file name (e.g., 001_create_users_table.sql)';
COMMENT ON COLUMN migrations.batch IS 'Migration batch number for rollback grouping';
COMMENT ON COLUMN migrations.checksum IS 'SHA-256 checksum of migration file content';
COMMENT ON COLUMN migrations.execution_time_ms IS 'Time taken to execute migration in milliseconds';
