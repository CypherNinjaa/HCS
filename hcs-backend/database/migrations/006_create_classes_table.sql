-- Create classes table
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 12),
    section VARCHAR(10) NOT NULL,
    capacity INTEGER DEFAULT 30 CHECK (capacity > 0),
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    class_teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(grade, section, academic_year_id)
);

-- Create indexes for performance
CREATE INDEX idx_classes_academic_year ON classes(academic_year_id);
CREATE INDEX idx_classes_teacher ON classes(class_teacher_id);
CREATE INDEX idx_classes_grade_section ON classes(grade, section);
CREATE INDEX idx_classes_active ON classes(is_active);

-- Create trigger to update updated_at column
CREATE TRIGGER update_classes_updated_at
    BEFORE UPDATE ON classes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample classes for current academic year
INSERT INTO classes (name, grade, section, capacity, academic_year_id) 
SELECT 
    CONCAT('Class ', grade, section) as name,
    grade,
    section,
    30 as capacity,
    ay.id as academic_year_id
FROM 
    (SELECT id FROM academic_years WHERE is_active = true LIMIT 1) ay,
    (VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10)) AS grades(grade),
    (VALUES ('A'), ('B'), ('C')) AS sections(section);
