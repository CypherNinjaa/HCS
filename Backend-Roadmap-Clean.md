# Happy Child School — Backend Roadmap (Role-Based Development)

## 🎯 **Development Strategy: Role by Role (Complete User Journeys)**

Instead of building features phase by phase, we'll develop **complete user roles** one at a time. This ensures each stakeholder gets a fully functional experience and provides immediate business value.

**Frontend**: Next.js (already in `hcs-app/`, TypeScript, App Router)  
**Backend**: New service `hcs-backend/` using Express + TypeScript  
**Database**: PostgreSQL locally via `pg` driver → seamless future migration to Supabase  
**Auth**: JWT (httpOnly cookies) with Role-Based Access Control (RBAC)  
**Validation**: Zod on all routes (body, query, params)  
**Security**: Helmet, CORS, rate limiting, input sanitization, audit logs  
**Logging**: Pino (pretty output in dev with pino-pretty)  
**Testing**: Jest + Supertest (unit + integration tests)  
**Deployment**: Local dev with `npm run dev` → Future: Render/Railway/Supabase

## Why This Stack & Approach is Perfect:

✅ **No Docker complexity** - Local PostgreSQL install  
✅ **No ORM overhead** - Direct SQL with `pg` driver  
✅ **Seamless Supabase migration** - Same PostgreSQL engine  
✅ **Better performance** - Raw SQL queries, full control  
✅ **Lighter dependencies** - Minimal, focused tech stack  
✅ **Future-proof** - Native PostgreSQL features available  
✅ **Complete user journeys** - Each role fully functional before next  
✅ **Immediate value delivery** - Stakeholders can use system incrementally  
✅ **Better testing** - Complete role workflows can be validated

---

## 🏗️ **Development Levels Overview**

### **Foundation Level: Core System** (Week 1)

- ✅ Authentication & JWT system
- ✅ Database schema & connections
- ✅ Security middleware & RBAC
- ✅ Basic API infrastructure

### **Level 1: Admin Panel** (Weeks 2-3) 🔥 **CURRENT FOCUS**

Complete admin workflow for school management foundation

### **Level 2: Teacher Panel** (Weeks 4-5)

Complete teacher workflow for classroom management

### **Level 3: Student Panel** (Weeks 6-7)

Complete student workflow for learning engagement

### **Level 4: Parent Panel** (Weeks 8-9)

Complete parent workflow for child monitoring

### **Level 5: Specialized Roles** (Weeks 10-11)

Librarian, Coordinator, Media roles

---

## Foundation Level: Bootstrap Express Backend ✅ **COMPLETED**

**Goal**: Run Express server with TypeScript, PostgreSQL connection, health route

### Core Setup Completed

- ✅ Express + TypeScript setup
- ✅ PostgreSQL connection
- ✅ JWT authentication system
- ✅ Security middleware
- ✅ Basic RBAC implementation
- ✅ Health check endpoint

---

## Level 1: Admin Panel Development 🔥 **CURRENT LEVEL**

**Goal**: Complete admin panel with full school management capabilities

### Current Status:

- ✅ **Frontend Authentication** - Complete integration with backend
- ✅ **Frontend Theme Issues** - Fixed hardcoded dark styles
- ⏳ **Backend APIs** - Ready to implement


### L1.1: Core Admin Database Schema (Day 2)

```sql
-- Academic Years Management
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year VARCHAR(20) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes (Grades & Sections)
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 12),
    section VARCHAR(10) NOT NULL,
    capacity INTEGER DEFAULT 30,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    class_teacher_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(grade, section, academic_year_id)
);

-- Subjects
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    class_id UUID NOT NULL REFERENCES classes(id),
    credits INTEGER DEFAULT 1,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(code, class_id)
);

-- Students
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    class_id UUID NOT NULL REFERENCES classes(id),
    roll_number VARCHAR(20) NOT NULL,
    admission_date DATE NOT NULL,
    blood_group VARCHAR(5),
    medical_conditions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(roll_number, class_id)
);

-- Teachers
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    teacher_id VARCHAR(20) UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    qualification TEXT,
    experience INTEGER DEFAULT 0,
    joining_date DATE NOT NULL,
    salary DECIMAL(10,2),
    department VARCHAR(100),
    specialization TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teacher-Subject Assignments
CREATE TABLE teacher_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id, subject_id, academic_year_id)
);

-- Parents
CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id VARCHAR(20) UNIQUE NOT NULL,
    occupation VARCHAR(100),
    relationship_type VARCHAR(20) NOT NULL,
    annual_income DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parent-Student Relationships
CREATE TABLE parent_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    relationship_type VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    is_emergency_contact BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(parent_id, student_id)
);
```

### L1.3: Admin API Development (Days 3-5)

**Student Management APIs**:

```
POST   /api/admin/students              # Create student
GET    /api/admin/students              # List with pagination/filters
GET    /api/admin/students/:id          # Get student details
PUT    /api/admin/students/:id          # Update student
DELETE /api/admin/students/:id          # Soft delete student
POST   /api/admin/students/bulk         # Bulk operations
GET    /api/admin/students/export       # Export student data
```

**Teacher Management APIs**:

```
POST   /api/admin/teachers              # Create teacher
GET    /api/admin/teachers              # List with pagination/filters
GET    /api/admin/teachers/:id          # Get teacher details
PUT    /api/admin/teachers/:id          # Update teacher
DELETE /api/admin/teachers/:id          # Soft delete teacher
POST   /api/admin/teachers/assign       # Assign subjects
```

**Class Management APIs**:

```
POST   /api/admin/classes               # Create class
GET    /api/admin/classes               # List classes
PUT    /api/admin/classes/:id           # Update class
POST   /api/admin/classes/:id/students  # Assign students to class
POST   /api/admin/classes/:id/teacher   # Assign class teacher
```

**Academic Year Management**:

```
POST   /api/admin/academic-years        # Create academic year
GET    /api/admin/academic-years        # List academic years
PUT    /api/admin/academic-years/:id    # Update academic year
PUT    /api/admin/academic-years/:id/activate # Set as active year
```

### L1.4: Fee Management System (Days 6-7)

```sql
-- Fee Categories
CREATE TABLE fee_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_mandatory BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fee Structures
CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id),
    fee_category_id UUID NOT NULL REFERENCES fee_categories(id),
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, fee_category_id, academic_year_id)
);

-- Fee Payments
CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id),
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id),
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fee Management APIs**:

```
POST   /api/admin/fees/categories       # Create fee category
POST   /api/admin/fees/structures       # Create fee structure
GET    /api/admin/fees/pending          # Get pending fee payments
POST   /api/admin/fees/payments         # Record fee payment
GET    /api/admin/fees/reports          # Fee collection reports
```

### L1.5: Transport Management (Day 8)

```sql
-- Transport Routes
CREATE TABLE transport_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_name VARCHAR(100) NOT NULL,
    route_number VARCHAR(20) UNIQUE NOT NULL,
    start_point VARCHAR(200) NOT NULL,
    end_point VARCHAR(200) NOT NULL,
    total_distance DECIMAL(8,2),
    estimated_time INTEGER, -- in minutes
    monthly_fee DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Route Stops
CREATE TABLE route_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES transport_routes(id) ON DELETE CASCADE,
    stop_name VARCHAR(200) NOT NULL,
    stop_order INTEGER NOT NULL,
    pickup_time TIME,
    drop_time TIME,
    landmark VARCHAR(200),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(route_id, stop_order)
);

-- Student Transport Assignments
CREATE TABLE student_transport (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES transport_routes(id),
    pickup_stop_id UUID NOT NULL REFERENCES route_stops(id),
    drop_stop_id UUID NOT NULL REFERENCES route_stops(id),
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, academic_year_id)
);
```

### L1.6: Admin Analytics & Reports (Days 9-10)

**Analytics APIs**:

```
GET    /api/admin/analytics/overview    # Dashboard KPIs
GET    /api/admin/analytics/students    # Student statistics
GET    /api/admin/analytics/teachers    # Teacher statistics
GET    /api/admin/analytics/fees        # Fee collection analytics
GET    /api/admin/analytics/transport   # Transport utilization
```

### L1.7: Integration & Testing (Days 11-12)

**Tasks**:

1. Connect frontend admin panel with backend APIs
2. Test all CRUD operations
3. Test bulk operations and data imports
4. Performance testing with sample data
5. Security testing and audit trails
6. User acceptance testing with admin stakeholders

### ✅ **Level 1 Completion Criteria**:

- [ ] Admin can manage complete student lifecycle
- [ ] Admin can manage complete teacher lifecycle
- [ ] Admin can manage classes and academic structure
- [ ] Admin can handle fee management end-to-end
- [ ] Admin can manage transport system
- [ ] All operations are audited and logged
- [ ] Frontend theme works perfectly in light/dark modes
- [ ] Performance benchmarks met
- [ ] Security audit passed

---

## Level 2: Teacher Panel Development ⏳ **NEXT LEVEL**

**Goal**: Complete teacher workflow for classroom management and assessment

### Teacher Role Capabilities:

- **Class Management**: View assigned classes and students
- **Attendance Management**: Mark and track student attendance
- **Assignment Management**: Create, distribute, and grade assignments
- **Grade Book**: Maintain student grades and assessments
- **Communication**: Parent-teacher messaging system
- **Lesson Planning**: Schedule and plan lessons
- **Resource Management**: Share study materials

### L2.1: Teacher-Specific Schema

```sql
-- Attendance tracking
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- PRESENT, ABSENT, LATE, EXCUSED
    marked_by UUID NOT NULL REFERENCES teachers(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);

-- Assignments
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    due_date TIMESTAMP NOT NULL,
    max_marks INTEGER DEFAULT 100,
    assignment_type VARCHAR(50), -- HOMEWORK, PROJECT, QUIZ
    instructions TEXT,
    attachments JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assignment submissions
CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id),
    student_id UUID NOT NULL REFERENCES students(id),
    submitted_at TIMESTAMP NOT NULL,
    content TEXT,
    attachments JSONB,
    marks_obtained INTEGER,
    feedback TEXT,
    graded_by UUID REFERENCES teachers(id),
    graded_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'SUBMITTED',
    UNIQUE(assignment_id, student_id)
);
```

---

## Level 3: Student Panel Development ⏳ **FUTURE**

**Goal**: Complete student learning and engagement platform

### Student Role Capabilities:

- **Academic Dashboard**: Overview of grades, assignments, attendance
- **Assignment Portal**: View and submit assignments
- **Grade Tracking**: Monitor academic performance
- **Schedule Management**: Class timetables and events
- **Resource Access**: Download study materials
- **Communication**: Chat with teachers and classmates

---

## Level 4: Parent Panel Development ⏳ **FUTURE**

**Goal**: Complete parent monitoring and engagement platform

### Parent Role Capabilities:

- **Child Monitoring**: Track academic progress and attendance
- **Fee Management**: View and pay school fees online
- **Communication**: Direct messaging with teachers
- **Event Notifications**: School events and announcements
- **Report Cards**: Download academic reports
- **Transport Tracking**: Monitor school bus location

---

## Level 5: Specialized Roles ⏳ **FUTURE**

### Librarian Panel:

- **Book Management**: Catalog and inventory management
- **Issue/Return System**: Track book transactions
- **Fine Management**: Handle overdue fines
- **Digital Resources**: Manage e-books and digital content

### Coordinator Panel:

- **Academic Coordination**: Oversee curriculum planning
- **Event Management**: Organize school events
- **Performance Monitoring**: Track overall academic performance
- **Resource Allocation**: Manage classroom and equipment assignments

### Media Coordinator Panel:

- **Content Management**: Manage school website and social media
- **Event Documentation**: Photo and video management
- **Announcement System**: School-wide communications
- **Digital Asset Management**: Organize multimedia resources

---

## API Contracts (Consistent Response Format)

```typescript
// Success response
{
  "data": any,
  "error": null,
  "pagination": { page: number, limit: number, total: number } | null
}

// Error response
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR" | "AUTH_ERROR" | "NOT_FOUND" | "SERVER_ERROR",
    "message": string,
    "details": any
  },
  "pagination": null
}
```

---

## Migration to Supabase (Future)

1. **Database Migration**: Export PostgreSQL → Import to Supabase
2. **Connection Update**: Change `DATABASE_URL` to Supabase connection
3. **Auth Optional**: Keep JWT or migrate to Supabase Auth
4. **Storage Migration**: Move files to Supabase Storage
5. **RLS Setup**: Add Row Level Security policies

**Zero code changes needed** - same PostgreSQL, same queries! 🎯

---

## Security & Compliance Checklist

✅ **Password Security**: bcrypt(12), secure policies  
✅ **JWT Security**: httpOnly cookies, secure flags  
✅ **Input Validation**: Zod schemas on all routes  
✅ **SQL Injection**: Parameterized queries only  
✅ **Rate Limiting**: Auth and write endpoints  
✅ **RBAC**: Role checks on every protected route  
✅ **Audit Logs**: All critical actions logged  
✅ **Error Handling**: No sensitive data in responses

This approach is **cleaner, faster, and more maintainable** than ORM-heavy alternatives! 🚀
