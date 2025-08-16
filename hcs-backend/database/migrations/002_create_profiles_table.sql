-- Migration: Create profiles table
-- Description: User profile information linked to users table
-- Created: 2025-08-16

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),
    phone_number VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    avatar_url VARCHAR(500),
    bio TEXT,
    nationality VARCHAR(100),
    blood_group VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

-- Create indexes
CREATE UNIQUE INDEX idx_profiles_user_id ON profiles(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_name ON profiles(first_name, last_name) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_phone ON profiles(phone_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_city ON profiles(city) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- Add constraints
ALTER TABLE profiles ADD CONSTRAINT chk_phone_format 
    CHECK (phone_number IS NULL OR phone_number ~ '^\+?[1-9]\d{1,14}$');

ALTER TABLE profiles ADD CONSTRAINT chk_gender 
    CHECK (gender IS NULL OR gender IN ('male', 'female', 'other', 'prefer_not_to_say'));

ALTER TABLE profiles ADD CONSTRAINT chk_blood_group 
    CHECK (blood_group IS NULL OR blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'));

ALTER TABLE profiles ADD CONSTRAINT chk_names_not_empty 
    CHECK (length(trim(first_name)) > 0 AND length(trim(last_name)) > 0);

-- Create trigger for profiles table
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE profiles IS 'User profile information and personal details';
COMMENT ON COLUMN profiles.user_id IS 'Foreign key reference to users table';
COMMENT ON COLUMN profiles.phone_number IS 'Contact phone number (international format)';
COMMENT ON COLUMN profiles.emergency_contact_name IS 'Emergency contact person name';
COMMENT ON COLUMN profiles.avatar_url IS 'Profile picture URL (external storage)';
COMMENT ON COLUMN profiles.blood_group IS 'Medical blood group information';
COMMENT ON COLUMN profiles.deleted_at IS 'Soft delete timestamp for audit trails';
