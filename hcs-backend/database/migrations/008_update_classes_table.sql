-- Add missing columns to classes table
ALTER TABLE classes 
ADD COLUMN current_strength INTEGER DEFAULT 0 CHECK (current_strength >= 0),
ADD COLUMN room_number VARCHAR(20),
ADD COLUMN deleted_at TIMESTAMP DEFAULT NULL;

-- Create index for soft delete
CREATE INDEX idx_classes_deleted_at ON classes(deleted_at);

-- Update current_strength with actual count of students
UPDATE classes 
SET current_strength = (
    SELECT COUNT(*) 
    FROM students s 
    WHERE s.class_id = classes.id AND s.deleted_at IS NULL
);

-- Create trigger to automatically update current_strength when students are added/removed
CREATE OR REPLACE FUNCTION update_class_current_strength()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.class_id IS NOT NULL THEN
        UPDATE classes 
        SET current_strength = current_strength + 1 
        WHERE id = NEW.class_id;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle class transfer
        IF OLD.class_id IS NOT NULL AND NEW.class_id IS NOT NULL AND OLD.class_id != NEW.class_id THEN
            UPDATE classes 
            SET current_strength = current_strength - 1 
            WHERE id = OLD.class_id;
            
            UPDATE classes 
            SET current_strength = current_strength + 1 
            WHERE id = NEW.class_id;
        ELSIF OLD.class_id IS NOT NULL AND NEW.class_id IS NULL THEN
            UPDATE classes 
            SET current_strength = current_strength - 1 
            WHERE id = OLD.class_id;
        ELSIF OLD.class_id IS NULL AND NEW.class_id IS NOT NULL THEN
            UPDATE classes 
            SET current_strength = current_strength + 1 
            WHERE id = NEW.class_id;
        END IF;
        
        -- Handle soft delete/restore
        IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL AND NEW.class_id IS NOT NULL THEN
            UPDATE classes 
            SET current_strength = current_strength - 1 
            WHERE id = NEW.class_id;
        ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL AND NEW.class_id IS NOT NULL THEN
            UPDATE classes 
            SET current_strength = current_strength + 1 
            WHERE id = NEW.class_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.class_id IS NOT NULL THEN
        UPDATE classes 
        SET current_strength = current_strength - 1 
        WHERE id = OLD.class_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger on students table
DROP TRIGGER IF EXISTS update_class_strength_trigger ON students;
CREATE TRIGGER update_class_strength_trigger
    AFTER INSERT OR UPDATE OR DELETE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_class_current_strength();
