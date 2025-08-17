-- Migration: Create teachers table
-- Description: Teacher-specific information and academic details
-- Created: 2025-08-17

-- Create teacher qualification enum
CREATE TYPE teacher_qualification AS ENUM (
    'B.Ed',
    'M.Ed',
    'B.A',
    'M.A',
    'B.Sc',
    'M.Sc',
    'B.Com',
    'M.Com',
    'B.Tech',
    'M.Tech',
    'Ph.D',
    'Diploma',
    'Other'
);

-- Create performance rating enum
CREATE TYPE performance_rating AS ENUM (
    'excellent',
    'good',
    'average',
    'needs_improvement'
);

-- Create teachers table
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    teacher_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    subjects TEXT[], -- Array of subjects taught
    qualification teacher_qualification,
    experience INTEGER, -- Years of experience
    salary DECIMAL(10,2), -- Monthly salary
    joining_date DATE NOT NULL,
    performance_rating performance_rating DEFAULT 'average',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

-- Create indexes for performance
CREATE UNIQUE INDEX idx_teachers_user_id ON teachers(user_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_teachers_teacher_id ON teachers(teacher_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_teachers_department ON teachers(department) WHERE deleted_at IS NULL;
CREATE INDEX idx_teachers_subjects ON teachers USING GIN(subjects) WHERE deleted_at IS NULL;
CREATE INDEX idx_teachers_active ON teachers(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_teachers_joining_date ON teachers(joining_date);
CREATE INDEX idx_teachers_performance ON teachers(performance_rating) WHERE deleted_at IS NULL;
CREATE INDEX idx_teachers_created_at ON teachers(created_at);

-- Add constraints
ALTER TABLE teachers ADD CONSTRAINT chk_teacher_id_format 
    CHECK (teacher_id ~ '^[A-Z]{3}[0-9]{4,6}$'); -- Format: TEA001234

ALTER TABLE teachers ADD CONSTRAINT chk_experience_valid 
    CHECK (experience >= 0 AND experience <= 50);

ALTER TABLE teachers ADD CONSTRAINT chk_salary_valid 
    CHECK (salary > 0);

ALTER TABLE teachers ADD CONSTRAINT chk_joining_date_valid 
    CHECK (joining_date <= CURRENT_DATE);

-- Create trigger for teachers table
CREATE TRIGGER trigger_teachers_updated_at
    BEFORE UPDATE ON teachers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate teacher ID
CREATE OR REPLACE FUNCTION generate_teacher_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    counter INTEGER;
BEGIN
    -- Get the current year
    SELECT EXTRACT(YEAR FROM CURRENT_DATE) INTO counter;
    
    -- Generate teacher ID format: TEA + YYYY + sequential number
    SELECT 'TEA' || counter || LPAD((
        COALESCE(
            (SELECT MAX(CAST(SUBSTRING(teacher_id FROM 8) AS INTEGER)) + 1
             FROM teachers 
             WHERE teacher_id LIKE 'TEA' || counter || '%'
             AND deleted_at IS NULL), 
            1
        )
    )::TEXT, 4, '0') INTO new_id;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE teachers IS 'Teacher-specific information including academic and administrative details';
COMMENT ON COLUMN teachers.user_id IS 'Foreign key reference to users table (must have role = teacher)';
COMMENT ON COLUMN teachers.teacher_id IS 'Unique teacher identifier (format: TEA + YEAR + sequence)';
COMMENT ON COLUMN teachers.department IS 'Academic department (Mathematics, Science, etc.)';
COMMENT ON COLUMN teachers.subjects IS 'Array of subjects taught by the teacher';
COMMENT ON COLUMN teachers.qualification IS 'Highest educational qualification';
COMMENT ON COLUMN teachers.experience IS 'Years of teaching experience';
COMMENT ON COLUMN teachers.salary IS 'Monthly salary in local currency';
COMMENT ON COLUMN teachers.joining_date IS 'Date when teacher joined the school';
COMMENT ON COLUMN teachers.performance_rating IS 'Performance evaluation rating';
COMMENT ON COLUMN teachers.is_active IS 'Whether teacher is currently active/employed';
COMMENT ON COLUMN teachers.deleted_at IS 'Soft delete timestamp for audit trails';
