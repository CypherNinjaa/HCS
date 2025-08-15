# Happy Child School - Backend Development Roadmap

## Project Overview

A comprehensive, secure school management system backend built with Next.js 14+ App Router, TypeScript, and MySQL (migrating to Supabase later). This roadmap ensures the highest security standards, robust architecture, and seamless scalability.

## Technology Stack

- **Framework**: Next.js 14+ with App Router (TypeScript only)
- **Database**: MySQL (current) → PostgreSQL/Supabase (future)
- **ORM**: Prisma (database-agnostic for easy migration)
- **Authentication**: NextAuth.js → Supabase Auth (future)
- **Storage**: MinIO/S3 → Supabase Storage (future)
- **Validation**: Zod schemas for all inputs/outputs
- **Security**: RBAC, RLS, CSRF, rate limiting, encryption
- **Caching**: Redis (Upstash) for rate limiting and sessions
- **File Processing**: Sharp for images, ClamAV for virus scanning
- **Monitoring**: Pino for logging, Sentry for error tracking

---

## Phase 1: Foundation & Core Infrastructure (Weeks 1-3)

### 1.1 Database Schema & Migrations (Week 1)

#### Core Models Priority:

1. **Authentication Models**

   ```prisma
   User (id, email, passwordHash, role, isActive, lastLoginAt, emailVerified)
   Profile (userId, firstName, lastName, phone, address, dateOfBirth, avatar)
   Session (id, userId, token, expiresAt, ipAddress, userAgent)
   ```

2. **Academic Hierarchy Models**

   ```prisma
   AcademicYear (id, year, startDate, endDate, isActive)
   Class (id, name, grade, section, capacity, academicYearId)
   Subject (id, name, code, classId, credits, description)
   ```

3. **User Role Models**

   ```prisma
   Student (id, userId, studentId, classId, rollNumber, admissionDate, isActive)
   Teacher (id, userId, teacherId, subjects[], qualification, experience, joiningDate)
   Parent (id, userId, parentId, occupation, relationshipType)
   ParentStudent (parentId, studentId, relationshipType, isPrimary)
   ```

4. **System Models**
   ```prisma
   AuditLog (id, actorId, action, entity, entityId, metadata, ipAddress, userAgent, createdAt)
   Notification (id, userId, title, message, type, isRead, scheduledAt, createdAt)
   SystemSettings (key, value, description, category, updatedBy, updatedAt)
   ```

#### Database Features:

- ✅ UUID primary keys (no exposed integers)
- ✅ Soft delete with `deletedAt` timestamps
- ✅ Audit trails for all sensitive operations
- ✅ Timestamps (`createdAt`, `updatedAt`) on all models
- ✅ JSON fields for flexible metadata
- ✅ Unique constraints and proper indexing
- ✅ Foreign key constraints with cascading rules

#### Migration Strategy:

```bash
# Development setup
npx prisma migrate dev --name init_schema
npx prisma generate
npx prisma db seed
```

### 1.2 Authentication & Security System (Week 1-2)

#### NextAuth.js Configuration:

```typescript
// app/api/auth/[...nextauth]/route.ts
- Credentials provider with Prisma adapter
- JWT strategy with custom token payload
- Session management with auto-logout (7 days)
- CSRF protection enabled by default
- Secure cookie settings
```

#### Security Middleware:

```typescript
// src/server/middleware/
1. rateLimitMiddleware.ts - Upstash Redis rate limiting
2. rbacMiddleware.ts - Role-based access control
3. corsMiddleware.ts - CORS configuration
4. csrfMiddleware.ts - CSRF token validation
5. validationMiddleware.ts - Zod schema validation
6. auditMiddleware.ts - Activity logging
7. errorMiddleware.ts - Global error handling
```

#### Password Security:

- ✅ bcrypt with 12+ rounds for hashing
- ✅ Password complexity validation
- ✅ Account lockout after failed attempts
- ✅ Password reset with secure tokens
- ✅ Force password change on first login

#### Role-Based Access Control (RBAC):

```typescript
// User Roles Hierarchy:
ADMIN > STUDENT_COORDINATOR > TEACHER/LIBRARIAN/MEDIA_COORDINATOR > PARENT/STUDENT

// Permission Matrix:
- ADMIN: Full system access
- STUDENT_COORDINATOR: Student management, class assignments
- TEACHER: Assigned classes, grading, attendance
- LIBRARIAN: Library management, book tracking
- MEDIA_COORDINATOR: Content management, media uploads
- PARENT: Child's data only
- STUDENT: Own data only
```

### 1.3 API Infrastructure (Week 2-3)

#### API Route Structure:

```
app/api/v1/
├── auth/
│   ├── login/route.ts
│   ├── logout/route.ts
│   ├── register/route.ts
│   ├── reset-password/route.ts
│   └── verify-email/route.ts
├── users/
│   ├── route.ts (GET, POST)
│   ├── [id]/route.ts (GET, PUT, DELETE)
│   ├── profile/route.ts
│   └── change-password/route.ts
├── students/
├── teachers/
├── classes/
├── subjects/
└── admin/
```

#### API Standards:

```typescript
// Response Format:
{
  data?: any,
  error?: {
    code: string,
    message: string,
    details?: any
  },
  pagination?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}

// Error Codes:
- VALIDATION_ERROR (400)
- UNAUTHORIZED (401)
- FORBIDDEN (403)
- NOT_FOUND (404)
- RATE_LIMITED (429)
- INTERNAL_ERROR (500)
```

#### Request/Response Validation:

```typescript
// Every endpoint must have:
1. Input validation with Zod schemas
2. Output sanitization
3. RBAC permission checks
4. Rate limiting
5. Audit logging
6. Error handling
```

---

## Phase 2: User Management & Core Features (Weeks 4-6)

### 2.1 User Management System (Week 4)

#### Admin User Management:

```typescript
// Features:
- Create users with auto-generated IDs and passwords
- Bulk user import via CSV
- User profile management
- Role assignment and changes
- Account activation/deactivation
- Password reset for any user
- User activity monitoring
```

#### Student Management:

```typescript
// Features:
- Student registration with unique ID generation
- Class assignment and transfers
- Parent-child relationship management
- Academic history tracking
- Attendance records
- Fee payment tracking
- Performance analytics
```

#### Teacher Management:

```typescript
// Features:
- Teacher profile with qualifications
- Subject and class assignments
- Schedule management
- Performance tracking
- Salary and contract management
```

### 2.2 Class & Academic Structure (Week 4-5)

#### Class Management:

```typescript
// Models:
ClassSubject (classId, subjectId, teacherId, schedule)
ClassSchedule (id, classId, subjectId, teacherId, day, startTime, endTime)
ClassStudent (classId, studentId, enrollmentDate, status)

// Features:
- Class creation and management
- Student enrollment/transfer
- Teacher assignment to subjects
- Timetable generation
- Capacity management
```

#### Subject Management:

```typescript
// Features:
- Subject creation with codes
- Credit system
- Prerequisites management
- Curriculum mapping
- Resource assignment
```

### 2.3 Authentication Testing & Security Hardening (Week 5-6)

#### Security Testing:

```typescript
// Test Cases:
1. SQL injection attempts
2. XSS payload filtering
3. CSRF token validation
4. Rate limiting effectiveness
5. Session hijacking prevention
6. Password brute force protection
7. Role escalation attempts
```

#### Security Monitoring:

```typescript
// Audit Events:
- Failed login attempts
- Password changes
- Role changes
- Data access attempts
- Suspicious activities
- Admin actions
```

---

## Phase 3: Academic Management System (Weeks 7-10)

### 3.1 Attendance System (Week 7)

#### Attendance Models:

```prisma
Attendance (
  id, studentId, classId, date, status,
  markedBy, markedAt, remarks, createdAt
)

AttendanceSummary (
  studentId, academicYearId, totalDays,
  presentDays, absentDays, lateCount, percentage
)
```

#### Features:

- ✅ Bulk attendance marking by teachers
- ✅ Real-time attendance tracking
- ✅ Attendance reports with analytics
- ✅ Parent notifications for absences
- ✅ Monthly/yearly attendance summaries
- ✅ Holiday and leave management

#### Anti-Cheating Measures:

- ✅ Time-based attendance windows
- ✅ IP address tracking
- ✅ Geolocation verification (optional)
- ✅ Duplicate entry prevention

### 3.2 Assignment Management System (Week 7-8)

#### Assignment Models:

```prisma
Assignment (
  id, title, description, subjectId, classId,
  teacherId, dueDate, maxMarks, instructions,
  allowedFileTypes, maxFileSize, isActive
)

AssignmentSubmission (
  id, assignmentId, studentId, submittedAt,
  files[], content, marks, feedback, gradedBy,
  gradedAt, status, resubmissionAllowed
)

AssignmentFile (
  id, submissionId, fileName, filePath,
  fileSize, mimeType, uploadedAt
)
```

#### Features:

- ✅ Assignment creation with rich text editor
- ✅ File upload with virus scanning
- ✅ Plagiarism detection (basic text comparison)
- ✅ Deadline management with extensions
- ✅ Bulk grading interface
- ✅ Student submission tracking
- ✅ Parent visibility into assignments

#### File Upload Security:

```typescript
// File Validation:
- File type whitelist (PDF, DOC, DOCX, TXT, JPG, PNG)
- File size limits (10MB for documents, 5MB for images)
- Virus scanning with ClamAV
- Filename sanitization
- Secure storage paths
- Access control for file downloads
```

### 3.3 Examination System (Week 8-9)

#### Exam Models:

```prisma
Exam (
  id, title, subjectId, classId, examDate,
  duration, maxMarks, instructions, examType,
  createdBy, isActive
)

ExamMark (
  id, examId, studentId, obtainedMarks,
  gradedBy, gradedAt, remarks, status
)

ExamSchedule (
  id, examId, startTime, endTime, venue,
  invigilator, instructions
)
```

#### Features:

- ✅ Exam scheduling and management
- ✅ Mark entry with validation
- ✅ Result generation and publication
- ✅ Grade calculation with curves
- ✅ Report card generation (PDF)
- ✅ Performance analytics
- ✅ Parent/student result access

### 3.4 MCQ Test System (Week 9-10)

#### MCQ Models:

```prisma
MCQTest (
  id, title, subjectId, classId, teacherId,
  timeLimit, totalMarks, scheduledAt, expiresAt,
  instructions, randomizeQuestions, isActive
)

MCQQuestion (
  id, testId, question, optionA, optionB,
  optionC, optionD, correctOption, marks,
  explanation, difficulty, order
)

MCQSubmission (
  id, testId, studentId, startedAt, submittedAt,
  answers, totalMarks, obtainedMarks, percentage,
  timeSpent, isCompleted, suspiciousActivity[]
)

MCQAnswer (
  id, submissionId, questionId, selectedOption,
  isCorrect, marksAwarded, timeTaken
)
```

#### Anti-Cheating Features:

```typescript
// Security Measures:
- Time-based question expiry
- Random question order per student
- Tab switching detection
- Copy-paste prevention
- Screenshot detection
- Full-screen mode enforcement
- IP address monitoring
- Unusual timing pattern detection
- Multiple attempt prevention
```

#### Analytics Features:

- ✅ Question-wise performance analysis
- ✅ Student ranking and percentiles
- ✅ Difficulty level assessment
- ✅ Time analysis per question
- ✅ Cheating attempt logs
- ✅ Teacher performance insights

---

## Phase 4: Communication & Media Management (Weeks 11-13)

### 4.1 Notification System (Week 11)

#### Notification Models:

```prisma
NotificationTemplate (
  id, name, title, content, variables[],
  category, isActive
)

Notification (
  id, userId, title, message, type, priority,
  isRead, readAt, scheduledAt, expiresAt,
  metadata, createdAt
)

NotificationPreference (
  userId, emailEnabled, smsEnabled, pushEnabled,
  categories[], quietHours
)
```

#### Notification Types:

- ✅ Assignment deadlines
- ✅ Exam schedules
- ✅ Fee due dates
- ✅ Attendance alerts
- ✅ Result publications
- ✅ School announcements
- ✅ Emergency alerts

#### Delivery Channels:

- ✅ In-app notifications
- ✅ Email notifications
- ✅ SMS notifications (future)
- ✅ Push notifications (PWA)

### 4.2 News & Announcement System (Week 11-12)

#### Content Models:

```prisma
NewsArticle (
  id, title, content, excerpt, featuredImage,
  author, publishedAt, status, category,
  tags[], viewCount, isPublic
)

Announcement (
  id, title, content, targetAudience[],
  priority, publishedAt, expiresAt,
  createdBy, attachments[]
)

CircularDocument (
  id, title, description, filePath,
  targetAudience[], publishedAt, downloadCount,
  createdBy
)
```

#### Features:

- ✅ Rich text editor for content creation
- ✅ Image upload and optimization
- ✅ SEO-friendly URLs and meta tags
- ✅ Content scheduling
- ✅ Target audience selection
- ✅ Download tracking for circulars
- ✅ Content approval workflow

### 4.3 Media Management System (Week 12-13)

#### Media Models:

```prisma
MediaAsset (
  id, fileName, filePath, fileSize,
  mimeType, category, tags[], uploadedBy,
  uploadedAt, isPublic, downloadCount
)

Gallery (
  id, title, description, coverImage,
  category, createdBy, createdAt, isPublic
)

GalleryMedia (
  galleryId, mediaAssetId, order, caption
)
```

#### Features:

- ✅ Image/video upload with processing
- ✅ Gallery creation and management
- ✅ Image optimization and thumbnails
- ✅ Bulk upload functionality
- ✅ Media categorization and tagging
- ✅ Access control for sensitive media
- ✅ CDN integration for performance

---

## Phase 5: Financial Management (Weeks 14-16)

### 5.1 Fee Management System (Week 14-15)

#### Fee Models:

```prisma
FeeStructure (
  id, academicYearId, classId, feeType,
  amount, dueDate, description, isActive
)

FeePayment (
  id, studentId, feeStructureId, amount,
  paymentMethod, paymentDate, receiptNumber,
  status, remarks, processedBy
)

FeeReminder (
  id, studentId, feeStructureId, reminderDate,
  reminderType, sentAt, isRead
)

PaymentReceipt (
  id, paymentId, receiptNumber, generateDate,
  filePath, downloadCount
)
```

#### Current Features (Cash Only):

- ✅ Fee structure management
- ✅ Manual payment recording
- ✅ Receipt generation (PDF)
- ✅ Payment history tracking
- ✅ Due date reminders
- ✅ Defaulter reports
- ✅ Collection analytics

#### Future Features (Online Payments):

- 🔄 UPI integration
- 🔄 Credit/Debit card payments
- 🔄 Net banking
- 🔄 Payment gateway integration
- 🔄 Auto-reconciliation
- 🔄 Refund management

### 5.2 Financial Reports & Analytics (Week 15-16)

#### Reporting Features:

- ✅ Daily collection reports
- ✅ Monthly fee analysis
- ✅ Defaulter identification
- ✅ Payment method analytics
- ✅ Class-wise collection summary
- ✅ Outstanding dues tracking
- ✅ Financial dashboards

---

## Phase 6: Library Management System (Weeks 17-18)

### 6.1 Digital Library System (Week 17)

#### Library Models:

```prisma
Book (
  id, title, author, isbn, category,
  totalCopies, availableCopies, location,
  purchaseDate, price, isDigital, filePath
)

BookIssue (
  id, bookId, userId, issueDate, dueDate,
  returnDate, fine, status, renewalCount,
  issuedBy
)

BookReservation (
  id, bookId, userId, reservationDate,
  expiryDate, status, notifiedAt
)

LibraryFine (
  id, userId, bookIssueId, amount,
  reason, paidAt, paymentMethod, status
)
```

#### Features:

- ✅ Book catalog management
- ✅ Issue/return tracking
- ✅ Fine calculation and collection
- ✅ Reservation system with waitlist
- ✅ Digital book access control
- ✅ Barcode/QR code integration
- ✅ Overdue notifications

### 6.2 Digital Reading Room (Week 18)

#### Features:

- ✅ PDF preview system
- ✅ Reading time tracking
- ✅ Access control for digital content
- ✅ Download restrictions
- ✅ Reading analytics
- ✅ Bookmark functionality

---

## Phase 7: Advanced Features & Analytics (Weeks 19-22)

### 7.1 Gamification System (Week 19-20)

#### Gamification Models:

```prisma
Badge (
  id, name, description, iconUrl,
  criteria, points, category, isActive
)

UserBadge (
  id, userId, badgeId, earnedAt,
  reason, points
)

Leaderboard (
  id, name, category, period, criteria,
  isActive
)

LeaderboardEntry (
  id, leaderboardId, userId, score,
  rank, period, updatedAt
)

GamificationRule (
  id, action, points, description,
  isActive, conditions
)
```

#### Point System:

```typescript
// Point Allocation:
- Daily attendance: 5 points
- Assignment submission: 10 points
- Assignment excellence: 30 points
- MCQ test completion: 5 points
- MCQ test excellence: 25 points
- Exam performance: 50-100 points
- Library engagement: 3 points
- Extracurricular participation: 15 points
```

#### Features:

- ✅ Automatic badge assignment
- ✅ Dynamic leaderboards
- ✅ Achievement unlocking
- ✅ Progress tracking
- ✅ Parent visibility
- ✅ Teacher analytics

### 7.2 Analytics & Reporting Engine (Week 20-21)

#### Academic Analytics:

```typescript
// Student Performance:
- Grade trends over time
- Subject-wise performance
- Attendance correlation with grades
- Assignment submission patterns
- MCQ test analytics
- Peer comparison metrics

// Teacher Analytics:
- Class performance summaries
- Grading patterns
- Student engagement metrics
- Assignment effectiveness
- Teaching load analysis

// School Analytics:
- Overall academic performance
- Fee collection trends
- Attendance patterns
- Resource utilization
- System usage metrics
```

#### Dashboard Widgets:

- ✅ Real-time KPI cards
- ✅ Interactive charts and graphs
- ✅ Performance heatmaps
- ✅ Trend analysis
- ✅ Comparative reports
- ✅ Export functionality

### 7.3 Chat & Communication System (Week 21-22)

#### Chat Models:

```prisma
ChatRoom (
  id, name, type, participants[],
  createdBy, createdAt, isActive
)

ChatMessage (
  id, roomId, senderId, content,
  messageType, attachments[], sentAt,
  editedAt, isDeleted
)

ChatParticipant (
  id, roomId, userId, joinedAt,
  role, lastSeenAt, isActive
)
```

#### Features:

- ✅ One-on-one teacher-parent chat
- ✅ Class group discussions
- ✅ File sharing in chats
- ✅ Message moderation
- ✅ Inappropriate content filtering
- ✅ Chat history archival
- ✅ Real-time notifications

---

## Phase 8: System Optimization & Migration Prep (Weeks 23-25)

### 8.1 Performance Optimization (Week 23)

#### Database Optimization:

```sql
-- Index Creation Strategy:
- Composite indexes for common queries
- Covering indexes for read-heavy operations
- Partial indexes for filtered queries
- Full-text search indexes

-- Query Optimization:
- N+1 query elimination
- Proper join strategies
- Pagination optimization
- Connection pooling
```

#### Caching Strategy:

```typescript
// Cache Layers:
1. Redis for session data
2. Application-level caching for static data
3. Database query result caching
4. CDN for media assets
5. Browser caching for static resources
```

#### Security Hardening:

```typescript
// Security Checklist:
- SQL injection prevention
- XSS protection
- CSRF token validation
- Rate limiting implementation
- Input sanitization
- Output encoding
- File upload security
- API endpoint protection
```

### 8.2 Testing & Quality Assurance (Week 24)

#### Testing Strategy:

```typescript
// Test Coverage:
1. Unit Tests (>80% coverage)
   - Authentication functions
   - Utility functions
   - Business logic
   - Validation schemas

2. Integration Tests
   - API endpoint testing
   - Database operations
   - File upload/download
   - Authentication flow

3. E2E Tests
   - Critical user journeys
   - Cross-role interactions
   - Payment workflows
   - Exam/MCQ flows

4. Security Tests
   - Penetration testing
   - Vulnerability scanning
   - Access control testing
   - Data leakage prevention
```

#### Load Testing:

```typescript
// Performance Benchmarks:
- 1000+ concurrent users
- <200ms API response times
- <2s page load times
- 99.9% uptime target
- Database connection limits
- Memory usage optimization
```

### 8.3 Supabase Migration Preparation (Week 25)

#### Migration Strategy:

```typescript
// Phase 1: Database Migration
1. Schema conversion (MySQL → PostgreSQL)
2. Data migration scripts
3. Prisma provider update
4. Connection string changes
5. Query compatibility testing

// Phase 2: Authentication Migration
1. User data export from MySQL
2. Supabase Auth user creation
3. Password reset workflow
4. Session migration strategy
5. NextAuth → Supabase Auth transition

// Phase 3: Storage Migration
1. File migration to Supabase Storage
2. URL reference updates
3. Access control policy setup
4. CDN configuration
5. Backup verification

// Phase 4: RLS Implementation
1. Row Level Security policy creation
2. Role-based access rules
3. Policy testing and validation
4. Performance optimization
5. Security audit
```

#### Compatibility Layer:

```typescript
// Abstraction Interfaces:
interface DatabaseAdapter {
	users: UserRepository;
	students: StudentRepository;
	// ... other repositories
}

interface AuthAdapter {
	signIn(credentials: LoginCredentials): Promise<User>;
	signOut(): Promise<void>;
	getSession(): Promise<Session | null>;
}

interface StorageAdapter {
	upload(file: File, path: string): Promise<string>;
	download(path: string): Promise<Buffer>;
	delete(path: string): Promise<void>;
}
```

---

## Phase 9: Production Deployment & Monitoring (Week 26)

### 9.1 Production Setup

#### Environment Configuration:

```bash
# Production Environment Variables
DATABASE_URL="mysql://..."
NEXTAUTH_SECRET="..."
JWT_SECRET="..."
REDIS_URL="..."
SMTP_HOST="..."
STORAGE_ENDPOINT="..."
SENTRY_DSN="..."
```

#### CI/CD Pipeline:

```yaml
# GitHub Actions Workflow
1. Code quality checks (ESLint, Prettier)
2. Type checking (TypeScript)
3. Unit test execution
4. Integration test execution
5. Security scanning (Snyk, CodeQL)
6. Database migration
7. Build and deployment
8. Smoke tests
```

#### Monitoring Setup:

```typescript
// Monitoring Stack:
1. Application Performance Monitoring (APM)
2. Error tracking (Sentry)
3. Log aggregation (Pino + structured logging)
4. Database monitoring
5. Uptime monitoring
6. Security incident detection
7. Resource usage alerts
```

### 9.2 Documentation & Training

#### Technical Documentation:

- API documentation (OpenAPI/Swagger)
- Database schema documentation
- Deployment procedures
- Security policies
- Backup and recovery procedures
- Troubleshooting guides

#### User Documentation:

- Admin user manual
- Teacher portal guide
- Parent portal guide
- Student portal guide
- Troubleshooting FAQ

---

## Security Checklist

### Authentication Security

- ✅ Strong password policies
- ✅ Account lockout mechanisms
- ✅ Session timeout implementation
- ✅ JWT token security
- ✅ Multi-factor authentication ready
- ✅ Password reset security
- ✅ Email verification

### Data Protection

- ✅ Input validation and sanitization
- ✅ Output encoding
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF protection
- ✅ File upload security
- ✅ Data encryption at rest

### Access Control

- ✅ Role-based access control (RBAC)
- ✅ Principle of least privilege
- ✅ Row-level security (future)
- ✅ API endpoint protection
- ✅ Resource-based permissions
- ✅ Audit trail implementation

### Infrastructure Security

- ✅ HTTPS enforcement
- ✅ Security headers
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Environment variable security
- ✅ Database connection security

---

## Performance Requirements

### Response Time Targets

- Authentication: <500ms
- Dashboard loading: <1s
- API responses: <200ms
- File uploads: <5s (depending on size)
- Report generation: <3s
- Search queries: <300ms

### Scalability Targets

- 1000+ concurrent users
- 10,000+ students
- 500+ teachers
- 100GB+ file storage
- 1M+ database records

### Availability Targets

- 99.9% uptime
- <5 minutes planned downtime
- Automatic failover capability
- Data backup every 6 hours
- Point-in-time recovery

---

## Future Enhancements (Post-Launch)

### Advanced Features

- AI-powered student performance prediction
- Automated grading for subjective answers
- Voice-to-text assignment submission
- Blockchain-based certificate verification
- IoT integration for attendance (RFID)
- Mobile app development
- Offline capability

### Integration Possibilities

- Third-party exam platforms
- Video conferencing tools
- Payment gateways
- SMS/WhatsApp APIs
- Learning management systems
- Government education portals

---

## Resource Requirements

### Development Team

- 1 Full-stack Developer (you)
- 1 UI/UX Designer (future)
- 1 DevOps Engineer (future)
- 1 QA Engineer (future)

### Infrastructure

- MySQL Database Server
- Redis Cache Server
- File Storage (MinIO/S3)
- Application Server
- CDN for static assets
- Monitoring tools

### Timeline Summary

- **Weeks 1-6**: Foundation (Auth, Database, Core API)
- **Weeks 7-13**: Academic Management (Attendance, Assignments, Exams)
- **Weeks 14-18**: Financial & Library Management
- **Weeks 19-22**: Advanced Features (Gamification, Analytics, Chat)
- **Weeks 23-26**: Optimization, Testing, and Deployment

This roadmap ensures a secure, scalable, and maintainable school management system that can grow with your institution's needs while maintaining the flexibility to migrate to Supabase when ready.

---

## GitHub Copilot Custom Rules for Backend Development

### Core Development Rules

#### TypeScript & Code Quality

- **ALWAYS** use TypeScript with strict mode enabled - NO JavaScript files
- **ALWAYS** define proper interfaces and types for all data structures
- **NEVER** use `any` or `unknown` types without proper type guards
- **ALWAYS** use meaningful variable and function names
- **ALWAYS** implement proper error handling with try-catch blocks
- **ALWAYS** use async/await instead of .then() chains
- **ALWAYS** validate all inputs with Zod schemas before processing
- **ALWAYS** sanitize outputs to prevent XSS attacks

#### Database & Prisma Rules

- **ALWAYS** use UUID as primary keys, never expose auto-increment integers
- **ALWAYS** implement soft delete with `deletedAt` timestamps for sensitive data
- **ALWAYS** use prepared statements (Prisma handles this automatically)
- **NEVER** use string concatenation for dynamic queries
- **ALWAYS** implement proper database transactions for multi-table operations
- **ALWAYS** add audit trails for all sensitive operations
- **ALWAYS** use proper foreign key constraints with cascading rules
- **ALWAYS** add timestamps (`createdAt`, `updatedAt`) to all models
- **ALWAYS** implement proper indexing for frequently queried fields

#### Authentication & Security Rules

- **ALWAYS** hash passwords with bcrypt using minimum 12 rounds
- **ALWAYS** implement role-based access control (RBAC) on every endpoint
- **ALWAYS** validate user permissions on both client and server side
- **ALWAYS** implement rate limiting on all API routes
- **ALWAYS** use environment variables for all secrets and configuration
- **NEVER** store sensitive data in localStorage or expose secrets in client code
- **ALWAYS** implement CSRF protection for forms
- **ALWAYS** sanitize all user inputs before database operations
- **ALWAYS** implement session timeout and auto-logout
- **ALWAYS** log all security-related events for audit purposes

#### API Design Rules

- **ALWAYS** follow RESTful conventions for API endpoints
- **ALWAYS** implement consistent error response format
- **ALWAYS** use proper HTTP status codes (400, 401, 403, 404, 500)
- **ALWAYS** implement request/response logging with correlation IDs
- **ALWAYS** validate all inputs with Zod schemas
- **ALWAYS** implement pagination for list endpoints (cursor or offset-based)
- **ALWAYS** use proper caching strategies with appropriate headers
- **NEVER** expose internal implementation details in API responses
- **ALWAYS** implement API versioning (e.g., /api/v1/)

#### File Upload & Storage Rules

- **ALWAYS** validate file types, sizes, and content before upload
- **NEVER** allow direct file uploads to server filesystem
- **ALWAYS** scan uploaded files for malware using ClamAV
- **ALWAYS** implement file size limits (images: 5MB, documents: 10MB, videos: 100MB)
- **ALWAYS** generate unique filenames to prevent conflicts
- **ALWAYS** implement image optimization and compression
- **ALWAYS** use secure storage solutions (MinIO/S3/Supabase Storage)
- **ALWAYS** implement access controls for file downloads

#### Error Handling & Logging Rules

- **ALWAYS** implement global error handling middleware
- **ALWAYS** provide user-friendly error messages (never expose technical details)
- **ALWAYS** log errors with proper context, stack traces, and correlation IDs
- **ALWAYS** implement proper error boundaries for async operations
- **ALWAYS** use structured logging with Pino for better searchability
- **ALWAYS** implement different log levels (debug, info, warn, error)

#### Performance & Optimization Rules

- **ALWAYS** implement proper caching strategies (Redis for sessions, app-level for static data)
- **ALWAYS** optimize database queries to prevent N+1 problems
- **ALWAYS** implement connection pooling for database connections
- **ALWAYS** use CDN for static assets and media files
- **ALWAYS** implement lazy loading for heavy operations
- **ALWAYS** monitor and optimize bundle sizes
- **ALWAYS** implement proper pagination and limit result sets

#### Testing Rules

- **ALWAYS** write unit tests for utility functions and business logic
- **ALWAYS** write integration tests for API endpoints
- **ALWAYS** implement E2E tests for critical user flows
- **ALWAYS** test with different user roles and permissions
- **ALWAYS** test form validation edge cases and error scenarios
- **ALWAYS** achieve minimum 80% test coverage
- **NEVER** commit code without proper test coverage

### Role-Specific Backend Rules

#### Student Management Rules

- **ALWAYS** verify student can only access their own data
- **ALWAYS** implement parent-child relationship validation
- **ALWAYS** log all academic activities for audit trails
- **NEVER** allow students to modify attendance or grades directly
- **ALWAYS** implement anti-cheating measures for MCQ tests
- **ALWAYS** validate assignment submission deadlines and file types

#### Teacher Management Rules

- **ALWAYS** verify teacher can only access assigned classes and students
- **ALWAYS** implement approval workflow for grade changes
- **ALWAYS** log all grade modifications with timestamps and reasons
- **ALWAYS** validate teacher permissions for each student action
- **ALWAYS** implement bulk operations with proper validation

#### Parent Management Rules

- **ALWAYS** verify parent can only access their child's data
- **ALWAYS** implement secure payment processing with PCI compliance
- **ALWAYS** require additional authentication for fee payments
- **NEVER** cache sensitive financial information
- **ALWAYS** provide transaction receipts and audit trails

#### Admin Management Rules

- **ALWAYS** implement multi-factor authentication for admins
- **ALWAYS** log all admin actions with detailed audit trails
- **ALWAYS** implement confirmation dialogs for destructive actions
- **ALWAYS** require supervisor approval for critical operations
- **ALWAYS** implement IP whitelisting for admin access when possible

### Data Privacy & Compliance Rules

- **ALWAYS** implement data minimization principles
- **ALWAYS** provide data export functionality for users (GDPR compliance)
- **ALWAYS** implement data retention policies with automatic cleanup
- **ALWAYS** anonymize data for analytics and reporting
- **NEVER** share personal data without explicit consent
- **ALWAYS** implement GDPR compliance features (right to be forgotten)
- **ALWAYS** encrypt sensitive data at rest and in transit

### MCQ Test System Rules

- **ALWAYS** implement time-based question expiry
- **ALWAYS** prevent answer submission after time limit expires
- **ALWAYS** randomize question order for each student
- **ALWAYS** implement tab switching detection and logging
- **ALWAYS** prevent copy-paste and screenshot detection
- **ALWAYS** track unusual timing patterns for cheating detection
- **ALWAYS** implement IP address monitoring during tests
- **NEVER** allow multiple simultaneous attempts

### Fee Management Rules

- **ALWAYS** use PCI DSS compliant payment processors for online payments
- **ALWAYS** implement transaction encryption and secure tokenization
- **ALWAYS** provide detailed payment receipts and audit trails
- **NEVER** store credit card information in application database
- **ALWAYS** implement proper reconciliation processes
- **ALWAYS** validate payment amounts and currency formatting

### File & Media Management Rules

- **ALWAYS** implement access controls for shared files and media
- **ALWAYS** scan files for viruses before processing or sharing
- **ALWAYS** implement file versioning for important documents
- **ALWAYS** provide download audit trails and access logs
- **ALWAYS** optimize images and videos for web delivery
- **ALWAYS** implement proper backup strategies for media assets

### Communication & Chat Rules

- **ALWAYS** implement message encryption for sensitive communications
- **ALWAYS** moderate chat content for inappropriate language
- **ALWAYS** implement user blocking and reporting features
- **ALWAYS** log all communications for compliance and safety
- **ALWAYS** implement message retention policies
- **ALWAYS** provide parental controls for student communications

### Environment & Configuration Rules

- **ALWAYS** use different configurations for development, staging, and production
- **ALWAYS** implement proper environment variable validation
- **NEVER** commit secrets or API keys to version control
- **ALWAYS** use secure methods for secret management
- **ALWAYS** implement proper backup and disaster recovery procedures
- **ALWAYS** document all environment setup and deployment procedures

### Migration & Supabase Preparation Rules

- **ALWAYS** write database-agnostic code using Prisma abstractions
- **ALWAYS** implement proper abstraction layers for auth and storage
- **ALWAYS** create migration scripts with rollback capabilities
- **ALWAYS** test compatibility between MySQL and PostgreSQL data types
- **ALWAYS** implement proper data validation during migration
- **ALWAYS** maintain backward compatibility during transition periods

### Monitoring & Alerting Rules

- **ALWAYS** implement application performance monitoring (APM)
- **ALWAYS** set up proper alerting for system failures and security events
- **ALWAYS** monitor database performance and query optimization
- **ALWAYS** track user engagement and system usage metrics
- **ALWAYS** implement uptime monitoring with proper SLA targets
- **ALWAYS** monitor for unusual user behavior patterns

### Code Organization Rules

- **ALWAYS** use feature-based folder structure for better organization
- **ALWAYS** implement proper separation of concerns (controllers, services, repositories)
- **ALWAYS** create reusable utility functions and custom hooks
- **ALWAYS** implement proper dependency injection patterns
- **ALWAYS** maintain consistent coding standards across the entire codebase
- **ALWAYS** document complex business logic and algorithms

### Emergency Response Rules

- **ALWAYS** implement circuit breakers for external API calls
- **ALWAYS** have fallback mechanisms for critical features
- **ALWAYS** implement graceful degradation when services are unavailable
- **ALWAYS** maintain emergency contact procedures and incident response plans
- **ALWAYS** implement automated backup verification and testing

Remember: This is an educational institution handling sensitive data of minors. Security, privacy, and reliability are paramount. When in doubt, choose the more secure and robust approach. Every line of code should be written with the assumption that it will be audited for security and compliance.
