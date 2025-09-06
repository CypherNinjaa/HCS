# 🚀 Happy Child School - Supabase Backend Roadmap

## 📋 Overview

This roadmap outlines the complete backend implementation using **Supabase** for the Happy Child School management system. We'll build a secure, scalable, and feature-rich backend that supports students, parents, teachers, coordinators, librarians, media coordinators, and administrators.

## 🏗️ Phase 1: Foundation Setup (Week 1-2)

### ✅ 1.1 Initial Supabase Configuration

- [x] Create Supabase project
- [x] Set up environment variables
- [x] Initialize Supabase client
- [ ] Configure database connection
- [ ] Set up development and production environments

### 🔐 1.2 Authentication System

```sql
-- Enable RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
```

**Authentication Features:**

- [ ] Email/Password authentication
- [ ] Role-based access control (RBAC)
- [ ] Password reset functionality
- [ ] Account activation via email
- [ ] Session management
- [ ] Multi-factor authentication (MFA) for admins

**User Roles:**

- `student`
- `parent`
- `teacher`
- `coordinator`
- `librarian`
- `media_coordinator`
- `admin`

### 📊 1.3 Core Database Schema

#### Users & Profiles Table

```sql
-- Users Profile Table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Roles Enum
CREATE TYPE user_role AS ENUM (
    'student', 'parent', 'teacher',
    'coordinator', 'librarian',
    'media_coordinator', 'admin'
);
```

#### Academic Structure Tables

```sql
-- Classes Table
CREATE TABLE public.classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- e.g., "Class 5A"
    grade_level INTEGER NOT NULL, -- 1-10
    section VARCHAR(10) NOT NULL, -- A, B, C
    academic_year VARCHAR(20) NOT NULL, -- "2024-25"
    class_teacher_id UUID REFERENCES profiles(id),
    capacity INTEGER DEFAULT 40,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects Table
CREATE TABLE public.subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    grade_levels INTEGER[] NOT NULL, -- [1,2,3,4,5]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎓 Phase 2: Student Management System (Week 3-4)

### 2.1 Student Profile & Academic Records

```sql
-- Students Table
CREATE TABLE public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) UNIQUE,
    admission_number VARCHAR(20) UNIQUE NOT NULL,
    class_id UUID REFERENCES classes(id),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10),
    address TEXT,
    emergency_contact VARCHAR(20),
    admission_date DATE DEFAULT CURRENT_DATE,
    status student_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Status Enum
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'transferred', 'graduated');
```

### 2.2 Attendance System

```sql
-- Attendance Table
CREATE TABLE public.attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    class_id UUID REFERENCES classes(id),
    date DATE NOT NULL,
    status attendance_status DEFAULT 'present',
    marked_by UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- Attendance Status Enum
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
```

### 2.3 Assignment & Homework System

```sql
-- Assignments Table
CREATE TABLE public.assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES subjects(id),
    class_id UUID REFERENCES classes(id),
    teacher_id UUID REFERENCES profiles(id),
    due_date TIMESTAMP WITH TIME ZONE,
    max_marks INTEGER DEFAULT 100,
    attachment_url TEXT,
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assignment Submissions Table
CREATE TABLE public.assignment_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assignment_id UUID REFERENCES assignments(id),
    student_id UUID REFERENCES students(id),
    submission_text TEXT,
    attachment_url TEXT,
    marks_obtained INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    graded_at TIMESTAMP WITH TIME ZONE,
    graded_by UUID REFERENCES profiles(id),
    UNIQUE(assignment_id, student_id)
);
```

## 👨‍🏫 Phase 3: Teacher Management System (Week 5-6)

### 3.1 Teacher Profiles & Class Assignments

```sql
-- Teachers Table
CREATE TABLE public.teachers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) UNIQUE,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    qualification VARCHAR(200),
    experience_years INTEGER,
    specialization TEXT[],
    joining_date DATE DEFAULT CURRENT_DATE,
    salary DECIMAL(10,2),
    status teacher_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teacher Class Assignments
CREATE TABLE public.teacher_class_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID REFERENCES teachers(id),
    class_id UUID REFERENCES classes(id),
    subject_id UUID REFERENCES subjects(id),
    academic_year VARCHAR(20) NOT NULL,
    is_class_teacher BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.2 MCQ Test System

```sql
-- MCQ Tests Table
CREATE TABLE public.mcq_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES subjects(id),
    class_id UUID REFERENCES classes(id),
    teacher_id UUID REFERENCES teachers(id),
    duration_minutes INTEGER NOT NULL,
    total_marks INTEGER NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    instructions TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MCQ Questions Table
CREATE TABLE public.mcq_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID REFERENCES mcq_tests(id),
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer VARCHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    marks INTEGER DEFAULT 1,
    order_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MCQ Test Submissions
CREATE TABLE public.mcq_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID REFERENCES mcq_tests(id),
    student_id UUID REFERENCES students(id),
    answers JSONB, -- {"1": "A", "2": "B", ...}
    score INTEGER,
    total_marks INTEGER,
    time_taken_minutes INTEGER,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_id, student_id)
);
```

## 👨‍👩‍👧‍👦 Phase 4: Parent Portal System (Week 7-8)

### 4.1 Parent-Student Relationships

```sql
-- Parents Table
CREATE TABLE public.parents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) UNIQUE,
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    occupation VARCHAR(100),
    annual_income DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parent-Student Relationships
CREATE TABLE public.parent_student_relationships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID REFERENCES parents(id),
    student_id UUID REFERENCES students(id),
    relationship_type VARCHAR(20) NOT NULL, -- father, mother, guardian
    is_primary_contact BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.2 Fee Management System

```sql
-- Fee Categories
CREATE TABLE public.fee_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    frequency fee_frequency NOT NULL,
    applicable_grades INTEGER[],
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fee Frequency Enum
CREATE TYPE fee_frequency AS ENUM ('monthly', 'quarterly', 'half_yearly', 'yearly', 'one_time');

-- Student Fee Records
CREATE TABLE public.student_fees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    fee_category_id UUID REFERENCES fee_categories(id),
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status fee_status DEFAULT 'pending',
    payment_date DATE,
    payment_method payment_method,
    transaction_id VARCHAR(100),
    late_fee DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Status & Method Enums
CREATE TYPE fee_status AS ENUM ('pending', 'paid', 'partial', 'overdue', 'waived');
CREATE TYPE payment_method AS ENUM ('cash', 'online', 'bank_transfer', 'cheque', 'upi');
```

## 📚 Phase 5: Library Management System (Week 9-10)

### 5.1 Library Books & Inventory

```sql
-- Books Table
CREATE TABLE public.books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    isbn VARCHAR(20) UNIQUE,
    title VARCHAR(300) NOT NULL,
    author VARCHAR(200) NOT NULL,
    publisher VARCHAR(200),
    publication_year INTEGER,
    category VARCHAR(100),
    total_copies INTEGER NOT NULL,
    available_copies INTEGER NOT NULL,
    location VARCHAR(100),
    price DECIMAL(8,2),
    description TEXT,
    cover_image_url TEXT,
    is_digital BOOLEAN DEFAULT false,
    digital_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Book Issues/Returns
CREATE TABLE public.book_issues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id UUID REFERENCES books(id),
    student_id UUID REFERENCES students(id),
    teacher_id UUID REFERENCES teachers(id), -- NULL if issued to student
    issued_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    returned_date DATE,
    fine_amount DECIMAL(8,2) DEFAULT 0,
    status issue_status DEFAULT 'issued',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Issue Status Enum
CREATE TYPE issue_status AS ENUM ('issued', 'returned', 'overdue', 'lost', 'damaged');
```

### 5.2 Digital Library & E-Resources

```sql
-- Digital Resources
CREATE TABLE public.digital_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    type resource_type NOT NULL,
    file_url TEXT NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES subjects(id),
    grade_levels INTEGER[],
    access_level access_level DEFAULT 'all',
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resource Types & Access Levels
CREATE TYPE resource_type AS ENUM ('pdf', 'video', 'audio', 'interactive', 'link');
CREATE TYPE access_level AS ENUM ('all', 'students_only', 'teachers_only', 'premium');
```

## 📰 Phase 6: Media & Content Management (Week 11-12)

### 6.1 News & Announcements

```sql
-- News/Announcements Table
CREATE TABLE public.news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image_url TEXT,
    author_id UUID REFERENCES profiles(id),
    category news_category DEFAULT 'general',
    target_audience TEXT[] DEFAULT ARRAY['all'],
    is_published BOOLEAN DEFAULT false,
    publish_date TIMESTAMP WITH TIME ZONE,
    is_urgent BOOLEAN DEFAULT false,
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News Categories
CREATE TYPE news_category AS ENUM ('general', 'academic', 'sports', 'cultural', 'admission', 'exam', 'holiday');
```

### 6.2 Media Gallery & Files

```sql
-- Media Gallery
CREATE TABLE public.media_gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type media_type NOT NULL,
    file_size INTEGER,
    album_id UUID REFERENCES media_albums(id),
    uploaded_by UUID REFERENCES profiles(id),
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Albums
CREATE TABLE public.media_albums (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    is_public BOOLEAN DEFAULT true,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Type Enum
CREATE TYPE media_type AS ENUM ('image', 'video', 'audio', 'document');
```

## 💬 Phase 7: Communication System (Week 13-14)

### 7.1 Messaging System

```sql
-- Messages Table
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES profiles(id),
    recipient_id UUID REFERENCES profiles(id),
    subject VARCHAR(200),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    parent_message_id UUID REFERENCES messages(id), -- For replies
    attachment_url TEXT,
    message_type message_type DEFAULT 'personal',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message Types
CREATE TYPE message_type AS ENUM ('personal', 'announcement', 'circular', 'complaint', 'suggestion');
```

### 7.2 Real-time Notifications

```sql
-- Notifications Table
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    reference_id UUID, -- ID of related entity (assignment, fee, etc.)
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Types
CREATE TYPE notification_type AS ENUM (
    'assignment', 'attendance', 'fee_due', 'exam_result',
    'announcement', 'library_due', 'new_message'
);
```

## 🎮 Phase 8: Gamification System (Week 15-16)

### 8.1 Student Achievement & Badges

```sql
-- Achievements/Badges System
CREATE TABLE public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    badge_icon_url TEXT,
    points INTEGER DEFAULT 0,
    category achievement_category,
    criteria JSONB, -- Flexible criteria definition
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Achievements
CREATE TABLE public.student_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    achievement_id UUID REFERENCES achievements(id),
    earned_date DATE DEFAULT CURRENT_DATE,
    points_earned INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, achievement_id)
);

-- Achievement Categories
CREATE TYPE achievement_category AS ENUM (
    'academic', 'attendance', 'sports', 'cultural',
    'leadership', 'community_service', 'behavior'
);
```

### 8.2 Points & Leaderboard System

```sql
-- Student Points
CREATE TABLE public.student_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    points INTEGER NOT NULL,
    reason VARCHAR(200) NOT NULL,
    category point_category NOT NULL,
    reference_id UUID, -- Related entity ID
    awarded_by UUID REFERENCES profiles(id),
    awarded_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Point Categories
CREATE TYPE point_category AS ENUM (
    'attendance', 'assignment', 'exam', 'mcq_test',
    'behavior', 'participation', 'achievement'
);
```

## 🔒 Phase 9: Security & Row Level Security (Week 17-18)

### 9.1 Row Level Security Policies

```sql
-- Student Data Access Policy
CREATE POLICY "Students can view own data" ON students
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Teachers can view their class students" ON students
    FOR SELECT USING (
        class_id IN (
            SELECT tca.class_id
            FROM teacher_class_assignments tca
            JOIN teachers t ON t.id = tca.teacher_id
            WHERE t.user_id = auth.uid()
        )
    );

CREATE POLICY "Parents can view their children" ON students
    FOR SELECT USING (
        id IN (
            SELECT psr.student_id
            FROM parent_student_relationships psr
            JOIN parents p ON p.id = psr.parent_id
            WHERE p.user_id = auth.uid()
        )
    );

-- Assignment Access Policies
CREATE POLICY "Students can view assignments for their class" ON assignments
    FOR SELECT USING (
        class_id = (
            SELECT class_id FROM students WHERE user_id = auth.uid()
        )
    );

-- Fee Access Policies
CREATE POLICY "Parents can view their children's fees" ON student_fees
    FOR SELECT USING (
        student_id IN (
            SELECT psr.student_id
            FROM parent_student_relationships psr
            JOIN parents p ON p.id = psr.parent_id
            WHERE p.user_id = auth.uid()
        )
    );
```

### 9.2 Role-based Function Access

```sql
-- Create role checking function
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role
        FROM profiles
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin-only access function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 📊 Phase 10: Analytics & Reporting (Week 19-20)

### 10.1 Student Performance Analytics

```sql
-- Student Performance Summary View
CREATE VIEW student_performance_summary AS
SELECT
    s.id,
    s.admission_number,
    p.first_name || ' ' || p.last_name as full_name,
    c.name as class_name,
    AVG(asub.marks_obtained::float / a.max_marks * 100) as avg_assignment_score,
    AVG(msub.score::float / msub.total_marks * 100) as avg_mcq_score,
    COUNT(CASE WHEN att.status = 'present' THEN 1 END)::float /
    COUNT(att.id) * 100 as attendance_percentage,
    SUM(sp.points) as total_points
FROM students s
JOIN profiles p ON p.id = s.user_id
JOIN classes c ON c.id = s.class_id
LEFT JOIN assignment_submissions asub ON asub.student_id = s.id
LEFT JOIN assignments a ON a.id = asub.assignment_id
LEFT JOIN mcq_submissions msub ON msub.student_id = s.id
LEFT JOIN attendance att ON att.student_id = s.id
LEFT JOIN student_points sp ON sp.student_id = s.id
GROUP BY s.id, s.admission_number, p.first_name, p.last_name, c.name;
```

### 10.2 Financial Reports

```sql
-- Fee Collection Summary View
CREATE VIEW fee_collection_summary AS
SELECT
    fc.name as fee_category,
    COUNT(sf.id) as total_fees,
    SUM(sf.amount) as total_amount,
    SUM(CASE WHEN sf.status = 'paid' THEN sf.amount ELSE 0 END) as collected_amount,
    SUM(CASE WHEN sf.status = 'pending' THEN sf.amount ELSE 0 END) as pending_amount,
    SUM(CASE WHEN sf.status = 'overdue' THEN sf.amount ELSE 0 END) as overdue_amount
FROM fee_categories fc
LEFT JOIN student_fees sf ON sf.fee_category_id = fc.id
GROUP BY fc.id, fc.name;
```

## 🔌 Phase 11: API Integration & Services (Week 21-22)

### 11.1 File Storage Functions

```sql
-- File upload helper function
CREATE OR REPLACE FUNCTION public.handle_file_upload(
    bucket_name TEXT,
    file_path TEXT,
    file_data BYTEA
)
RETURNS TEXT AS $$
DECLARE
    file_url TEXT;
BEGIN
    -- Upload file to Supabase Storage
    SELECT storage.upload(bucket_name, file_path, file_data) INTO file_url;
    RETURN file_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 11.2 Email Notification Functions

```sql
-- Email notification queue
CREATE TABLE public.email_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(300) NOT NULL,
    body TEXT NOT NULL,
    template_name VARCHAR(100),
    template_data JSONB,
    status email_status DEFAULT 'pending',
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Status Enum
CREATE TYPE email_status AS ENUM ('pending', 'sent', 'failed', 'cancelled');
```

## 🚀 Phase 12: Performance Optimization (Week 23-24)

### 12.1 Database Indexing

```sql
-- Performance indexes
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_assignments_class_subject ON assignments(class_id, subject_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_messages_recipient_unread ON messages(recipient_id, is_read);
CREATE INDEX idx_student_fees_status ON student_fees(status, due_date);
```

### 12.2 Database Functions for Complex Queries

```sql
-- Get student dashboard data
CREATE OR REPLACE FUNCTION public.get_student_dashboard(student_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'profile', (SELECT row_to_json(p) FROM profiles p WHERE id = student_uuid),
        'attendance_percentage', (
            SELECT ROUND(
                COUNT(CASE WHEN status = 'present' THEN 1 END)::float /
                COUNT(*)::float * 100, 2
            )
            FROM attendance
            WHERE student_id = student_uuid
            AND date >= CURRENT_DATE - INTERVAL '30 days'
        ),
        'pending_assignments', (
            SELECT json_agg(row_to_json(a))
            FROM assignments a
            WHERE a.class_id = (SELECT class_id FROM students WHERE user_id = student_uuid)
            AND a.due_date > NOW()
            AND a.id NOT IN (
                SELECT assignment_id
                FROM assignment_submissions
                WHERE student_id = student_uuid
            )
        ),
        'recent_mcq_scores', (
            SELECT json_agg(
                json_build_object(
                    'test_title', mt.title,
                    'score', ms.score,
                    'total_marks', ms.total_marks,
                    'submitted_at', ms.submitted_at
                )
            )
            FROM mcq_submissions ms
            JOIN mcq_tests mt ON mt.id = ms.test_id
            WHERE ms.student_id = student_uuid
            ORDER BY ms.submitted_at DESC
            LIMIT 5
        ),
        'total_points', (
            SELECT COALESCE(SUM(points), 0)
            FROM student_points
            WHERE student_id = student_uuid
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🧪 Phase 13: Testing & Quality Assurance (Week 25-26)

### 13.1 Database Testing

- [ ] Unit tests for all database functions
- [ ] Integration tests for RLS policies
- [ ] Performance testing for complex queries
- [ ] Data integrity validation
- [ ] Backup and restore testing

### 13.2 API Testing

- [ ] Authentication flow testing
- [ ] Role-based access testing
- [ ] File upload/download testing
- [ ] Real-time functionality testing
- [ ] Load testing for concurrent users

## 📱 Phase 14: Real-time Features (Week 27-28)

### 14.1 Real-time Subscriptions

```typescript
// Real-time attendance updates
const attendanceSubscription = supabase
	.channel("attendance_changes")
	.on(
		"postgres_changes",
		{
			event: "INSERT",
			schema: "public",
			table: "attendance",
		},
		(payload) => {
			console.log("New attendance marked:", payload);
		}
	)
	.subscribe();

// Real-time notifications
const notificationSubscription = supabase
	.channel("user_notifications")
	.on(
		"postgres_changes",
		{
			event: "INSERT",
			schema: "public",
			table: "notifications",
			filter: `user_id=eq.${userId}`,
		},
		(payload) => {
			showNotification(payload.new);
		}
	)
	.subscribe();
```

### 14.2 Live Chat System

```sql
-- Chat Rooms Table
CREATE TABLE public.chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200),
    type chat_type NOT NULL,
    class_id UUID REFERENCES classes(id),
    subject_id UUID REFERENCES subjects(id),
    created_by UUID REFERENCES profiles(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages Table
CREATE TABLE public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES chat_rooms(id),
    sender_id UUID REFERENCES profiles(id),
    message TEXT NOT NULL,
    message_type message_content_type DEFAULT 'text',
    file_url TEXT,
    reply_to_id UUID REFERENCES chat_messages(id),
    is_edited BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Types
CREATE TYPE chat_type AS ENUM ('class_group', 'subject_group', 'parent_teacher', 'admin_broadcast');
CREATE TYPE message_content_type AS ENUM ('text', 'image', 'file', 'voice', 'video');
```

## 🔧 Phase 15: Advanced Features (Week 29-30)

### 15.1 AI-Powered Features

```sql
-- Student Performance Predictions
CREATE TABLE public.performance_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    subject_id UUID REFERENCES subjects(id),
    predicted_grade VARCHAR(5),
    confidence_score DECIMAL(5,2),
    factors JSONB,
    prediction_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 15.2 Advanced Analytics

```sql
-- Learning Path Recommendations
CREATE TABLE public.learning_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    subject_id UUID REFERENCES subjects(id),
    recommendation_type recommendation_type,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    resource_url TEXT,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    estimated_time_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendation Types
CREATE TYPE recommendation_type AS ENUM ('practice_exercise', 'video_lesson', 'reading_material', 'peer_study', 'teacher_consultation');
```

## 🛡️ Phase 16: Security Hardening (Week 31-32)

### 16.1 Advanced Security Measures

```sql
-- Audit Log Table
CREATE TABLE public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Events Table
CREATE TABLE public.security_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    event_type security_event_type NOT NULL,
    severity security_severity NOT NULL,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Enums
CREATE TYPE security_event_type AS ENUM ('failed_login', 'suspicious_activity', 'data_breach_attempt', 'unauthorized_access');
CREATE TYPE security_severity AS ENUM ('low', 'medium', 'high', 'critical');
```

## 🚀 Phase 17: Deployment & Monitoring (Week 33-34)

### 17.1 Production Setup

- [ ] Environment-specific configurations
- [ ] Database migrations management
- [ ] Backup strategies
- [ ] Monitoring and alerting
- [ ] Performance optimization
- [ ] SSL/TLS configuration

### 17.2 Monitoring & Analytics

```sql
-- System Health Monitoring
CREATE TABLE public.system_health (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2),
    metric_unit VARCHAR(20),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📋 Final Checklist

### ✅ Core Features Completion

- [ ] Authentication & Authorization
- [ ] Student Management
- [ ] Teacher Portal
- [ ] Parent Portal
- [ ] Administrative Functions
- [ ] Library Management
- [ ] Fee Management
- [ ] Communication System
- [ ] Media Management
- [ ] Gamification
- [ ] Real-time Features
- [ ] Reporting & Analytics

### 🔒 Security Checklist

- [ ] Row Level Security policies implemented
- [ ] API endpoint security
- [ ] File upload security
- [ ] Data encryption
- [ ] Audit logging
- [ ] Regular security assessments

### 🚀 Performance Checklist

- [ ] Database indexing optimized
- [ ] Query performance tuned
- [ ] Caching strategies implemented
- [ ] CDN configuration for static assets
- [ ] Real-time subscription optimization

### 📱 User Experience Checklist

- [ ] Mobile-responsive design
- [ ] Progressive Web App features
- [ ] Offline functionality (where applicable)
- [ ] Push notifications
- [ ] Accessibility compliance

## 🎯 Success Metrics

1. **Performance Metrics:**

   - Page load time < 2 seconds
   - API response time < 500ms
   - 99.9% uptime
   - Support for 1000+ concurrent users

2. **User Engagement Metrics:**

   - Student portal daily active usage > 80%
   - Parent portal weekly engagement > 60%
   - Teacher portal feature adoption > 90%

3. **Security Metrics:**
   - Zero data breaches
   - 100% audit trail coverage
   - Multi-factor authentication adoption > 95%

## 🔄 Maintenance & Updates

### Monthly Tasks

- [ ] Security patches and updates
- [ ] Performance monitoring review
- [ ] Backup verification
- [ ] User feedback analysis
- [ ] Feature usage analytics

### Quarterly Tasks

- [ ] Major feature releases
- [ ] Comprehensive security audit
- [ ] Performance optimization
- [ ] User training sessions
- [ ] System capacity planning

---

This comprehensive roadmap ensures a robust, secure, and scalable backend for your Happy Child School management system using Supabase. Each phase builds upon the previous one, ensuring steady progress toward a production-ready system.

**Estimated Timeline:** 34 weeks (8-9 months)
**Team Size:** 2-3 developers + 1 QA engineer
**Budget Consideration:** Supabase costs scale with usage - perfect for gradual growth

Ready to start with Phase 1? 🚀
