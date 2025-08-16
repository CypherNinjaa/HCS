-- Create academic years table
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year VARCHAR(20) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for active academic year queries
CREATE INDEX idx_academic_years_active ON academic_years(is_active);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_academic_years_updated_at
    BEFORE UPDATE ON academic_years
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert current academic year
INSERT INTO academic_years (year, start_date, end_date, is_active) 
VALUES ('2024-25', '2024-04-01', '2025-03-31', true);
