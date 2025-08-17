-- Create students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
    roll_number VARCHAR(20) NOT NULL,
    admission_date DATE NOT NULL,
    blood_group VARCHAR(5),
    medical_conditions TEXT,
    fee_status VARCHAR(20) DEFAULT 'PENDING' CHECK (fee_status IN ('PAID', 'PENDING', 'OVERDUE')),
    attendance_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (attendance_percentage >= 0 AND attendance_percentage <= 100),
    performance_grade VARCHAR(20) DEFAULT 'AVERAGE' CHECK (performance_grade IN ('EXCELLENT', 'GOOD', 'AVERAGE', 'NEEDS_IMPROVEMENT')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    UNIQUE(roll_number, class_id)
);

-- Create indexes for performance
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_admission_number ON students(admission_number);
CREATE INDEX idx_students_active ON students(is_active);
CREATE INDEX idx_students_deleted_at ON students(deleted_at);
CREATE INDEX idx_students_fee_status ON students(fee_status);

-- Create trigger to update updated_at column
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate student ID
CREATE OR REPLACE FUNCTION generate_student_id() 
RETURNS VARCHAR(20) AS $$
DECLARE
    new_id VARCHAR(20);
    counter INTEGER := 1;
BEGIN
    LOOP
        new_id := 'STU' || TO_CHAR(EXTRACT(YEAR FROM CURRENT_DATE), 'FM0000') || LPAD(counter::TEXT, 3, '0');
        
        -- Check if this ID already exists
        IF NOT EXISTS (SELECT 1 FROM students WHERE student_id = new_id) THEN
            RETURN new_id;
        END IF;
        
        counter := counter + 1;
        
        -- Safety check to prevent infinite loop
        IF counter > 9999 THEN
            RAISE EXCEPTION 'Cannot generate unique student ID';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate admission number
CREATE OR REPLACE FUNCTION generate_admission_number() 
RETURNS VARCHAR(50) AS $$
DECLARE
    new_number VARCHAR(50);
    counter INTEGER := 1;
BEGIN
    LOOP
        new_number := 'ADM' || TO_CHAR(EXTRACT(YEAR FROM CURRENT_DATE), 'FM0000') || LPAD(counter::TEXT, 4, '0');
        
        -- Check if this number already exists
        IF NOT EXISTS (SELECT 1 FROM students WHERE admission_number = new_number) THEN
            RETURN new_number;
        END IF;
        
        counter := counter + 1;
        
        -- Safety check to prevent infinite loop
        IF counter > 99999 THEN
            RAISE EXCEPTION 'Cannot generate unique admission number';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
