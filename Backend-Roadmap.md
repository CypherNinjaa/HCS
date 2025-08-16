# Happy Child School - Backend Development Roadmap

## 🚀 Confidence-Building Strategy for Backend Development

**Don't be scared! This project is absolutely manageable with the right approach.**

### Why This Strategy Works:
- ✅ **Incremental Development**: Build one small piece at a time
- ✅ **Immediate Validation**: Test each step before moving forward
- ✅ **Clear Checkpoints**: Know exactly where you are and what's next
- ✅ **Rollback Plans**: Safe ways to undo if something goes wrong
- ✅ **Foundation-First**: Build solid basics before adding complexity

### Your Current Advantages:
- ✅ **Solid Foundation**: Next.js 14+ with TypeScript already set up
- ✅ **Libraries Ready**: Auth utilities, Prisma client, and validation schemas exist
- ✅ **Clear Requirements**: Well-defined features and security requirements
- ✅ **Migration-Ready**: Prisma ORM allows easy database switching later

---

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

## Phase 0: Preparation & Quick Wins (Days 1-3)

### 🎯 Goal: Get immediate confidence with working basics

### 0.1 Environment Setup (Day 1 - 2 hours)

#### Step 1: Create Prisma Directory and Basic Schema
```bash
# In hcs-app directory
mkdir prisma
cd prisma
```

#### Step 2: Create Initial Schema File
Create `prisma/schema.prisma`:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// Start with just User model for immediate testing
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  passwordHash String
  role        UserRole @default(STUDENT)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("users")
}

enum UserRole {
  STUDENT
  TEACHER
  PARENT
  ADMIN
}
```

#### Step 3: Environment Configuration
Create `.env.local` (if not exists):

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/hcs_db"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-here"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

#### ✅ Validation Checkpoint 1:
```bash
# Test schema compilation
npx prisma generate
```
**Expected Result**: No errors, Prisma client generated successfully.

### 0.2 Create Your First API Route (Day 1 - 1 hour)

#### Step 1: Create API Directory Structure
```bash
# In hcs-app/src/app
mkdir -p api/v1/test
```

#### Step 2: Create Test Endpoint
Create `src/app/api/v1/test/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: "🎉 Your backend is working!",
      timestamp: new Date().toISOString(),
      version: "v1"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### ✅ Validation Checkpoint 2:
```bash
# Start development server
npm run dev

# Test in browser or curl
curl http://localhost:3000/api/v1/test
```
**Expected Result**: JSON response with success message.

### 0.3 Database Connection Test (Day 2 - 2 hours)

#### Step 1: Set Up Local MySQL (Choose one option)

**Option A: Using XAMPP/WAMP (Easiest)**
1. Install XAMPP
2. Start MySQL service
3. Create database `hcs_db` in phpMyAdmin

**Option B: Using Docker (Recommended)**
```bash
# Create docker-compose.yml in project root
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: hcs_db
      MYSQL_USER: hcs_user
      MYSQL_PASSWORD: hcs_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

```bash
# Start database
docker-compose up -d
```

#### Step 2: Update DATABASE_URL
```env
# For XAMPP
DATABASE_URL="mysql://root:@localhost:3306/hcs_db"

# For Docker
DATABASE_URL="mysql://hcs_user:hcs_password@localhost:3306/hcs_db"
```

#### Step 3: Run Your First Migration
```bash
npx prisma migrate dev --name init
```

#### ✅ Validation Checkpoint 3:
```bash
# Check database tables
npx prisma studio
```
**Expected Result**: Prisma Studio opens, shows `users` table with proper structure.

### 0.4 Create Your First Database API (Day 2-3 - 3 hours)

#### Step 1: Create User API Route
Create `src/app/api/v1/users/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { UserRole } from '@/lib/auth';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    });
    
    return NextResponse.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role = UserRole.STUDENT } = body;
    
    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });
    
    return NextResponse.json({
      success: true,
      data: user,
      message: "User created successfully"
    });
    
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
```

#### ✅ Validation Checkpoint 4:
```bash
# Test creating a user
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test getting users
curl http://localhost:3000/api/v1/users
```
**Expected Result**: User created successfully, appears in GET request.

### 🎉 Phase 0 Success Metrics:
- ✅ Prisma schema compiles without errors
- ✅ Database connection works
- ✅ First API endpoint responds correctly
- ✅ Can create and retrieve users from database
- ✅ Development environment is stable

**Congratulations! You now have a working backend foundation. The scary part is over!**

---

## Phase 1: Core Models & Authentication (Week 1-2)

### 🎯 Goal: Expand your working foundation with core models and basic authentication

### 1.1 Complete Database Schema (Week 1)

#### Step 1: Expand Prisma Schema Incrementally

Update `prisma/schema.prisma` by adding models **one at a time**:

```prisma
// Add to existing schema.prisma

// Profile information (linked to User)
model Profile {
  id           String    @id @default(uuid())
  userId       String    @unique
  firstName    String
  lastName     String
  phone        String?
  address      String?
  dateOfBirth  DateTime?
  avatar       String?   // URL to profile image
  emergencyContact String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  // Relations
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("profiles")
}

// Update User model to include Profile relation
model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String
  role         UserRole  @default(STUDENT)
  isActive     Boolean   @default(true)
  lastLoginAt  DateTime?
  emailVerified Boolean  @default(false)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  // Relations
  profile      Profile?
  sessions     Session[]
  studentProfile Student?
  teacherProfile Teacher?
  parentProfile  Parent?
  
  @@map("users")
}

// Session management for security
model Session {
  id          String   @id @default(uuid())
  userId      String
  token       String   @unique
  expiresAt   DateTime
  ipAddress   String?
  userAgent   String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  // Relations
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("sessions")
}
```

#### ✅ Validation Checkpoint 1.1:
```bash
npx prisma migrate dev --name add_profiles_sessions
npx prisma generate
```
**Expected Result**: Migration succeeds, new tables created.

#### Step 2: Add Academic Hierarchy Models

```prisma
// Add these models to schema.prisma

model AcademicYear {
  id        String   @id @default(uuid())
  year      String   @unique // e.g., "2024-2025"
  startDate DateTime
  endDate   DateTime
  isActive  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  classes   Class[]
  
  @@map("academic_years")
}

model Class {
  id             String       @id @default(uuid())
  name           String       // e.g., "Grade 5A"
  grade          Int          // 1-12
  section        String       // A, B, C, etc.
  capacity       Int          @default(30)
  academicYearId String
  isActive       Boolean      @default(true)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  
  // Relations
  academicYear   AcademicYear @relation(fields: [academicYearId], references: [id])
  subjects       Subject[]
  students       Student[]
  
  @@unique([grade, section, academicYearId])
  @@map("classes")
}

model Subject {
  id          String   @id @default(uuid())
  name        String   // e.g., "Mathematics"
  code        String   // e.g., "MATH-5A"
  classId     String
  credits     Int      @default(1)
  description String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  class       Class    @relation(fields: [classId], references: [id])
  
  @@unique([code, classId])
  @@map("subjects")
}
```

#### ✅ Validation Checkpoint 1.2:
```bash
npx prisma migrate dev --name add_academic_models
```

#### Step 3: Add User Role-Specific Models

```prisma
// Add these models to schema.prisma

model Student {
  id            String    @id @default(uuid())
  userId        String    @unique
  studentId     String    @unique // School-specific ID like "STU2024001"
  classId       String
  rollNumber    String
  admissionDate DateTime
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  class         Class     @relation(fields: [classId], references: [id])
  parents       ParentStudent[]
  
  @@unique([rollNumber, classId])
  @@map("students")
}

model Teacher {
  id            String   @id @default(uuid())
  userId        String   @unique
  teacherId     String   @unique // School-specific ID like "TCH2024001"
  qualification String
  experience    Int      // Years of experience
  joiningDate   DateTime
  salary        Decimal? @db.Decimal(10, 2)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("teachers")
}

model Parent {
  id              String   @id @default(uuid())
  userId          String   @unique
  parentId        String   @unique // School-specific ID like "PAR2024001"
  occupation      String?
  relationshipType String  // Father, Mother, Guardian
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  children        ParentStudent[]
  
  @@map("parents")
}

model ParentStudent {
  id               String   @id @default(uuid())
  parentId         String
  studentId        String
  relationshipType String   // Father, Mother, Guardian
  isPrimary        Boolean  @default(false) // Primary contact
  createdAt        DateTime @default(now())
  
  // Relations
  parent           Parent   @relation(fields: [parentId], references: [id], onDelete: Cascade)
  student          Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  @@unique([parentId, studentId])
  @@map("parent_students")
}

// Expand UserRole enum
enum UserRole {
  STUDENT
  TEACHER
  PARENT
  ADMIN
  STUDENT_COORDINATOR
  LIBRARIAN
  MEDIA_COORDINATOR
}
```

#### ✅ Validation Checkpoint 1.3:
```bash
npx prisma migrate dev --name add_user_roles
npx prisma studio
```
**Expected Result**: All tables visible in Prisma Studio with proper relationships.

### 1.2 Authentication System Implementation (Week 1-2)

#### Step 1: Create Authentication API Routes

Create `src/app/api/v1/auth/register/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateUniqueId, UserRole } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.nativeEnum(UserRole),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);
    
    const { email, password, firstName, lastName, role, phone } = validatedData;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 409 }
      );
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user with profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role,
        }
      });
      
      // Create profile
      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          phone,
        }
      });
      
      // Create role-specific profile
      let roleProfile = null;
      switch (role) {
        case UserRole.STUDENT:
          roleProfile = await tx.student.create({
            data: {
              userId: user.id,
              studentId: generateUniqueId('STU'),
              classId: '', // Will be assigned later
              rollNumber: '', // Will be assigned later
              admissionDate: new Date(),
            }
          });
          break;
          
        case UserRole.TEACHER:
          roleProfile = await tx.teacher.create({
            data: {
              userId: user.id,
              teacherId: generateUniqueId('TCH'),
              qualification: '',
              experience: 0,
              joiningDate: new Date(),
            }
          });
          break;
          
        case UserRole.PARENT:
          roleProfile = await tx.parent.create({
            data: {
              userId: user.id,
              parentId: generateUniqueId('PAR'),
              relationshipType: 'Parent',
            }
          });
          break;
      }
      
      return { user, profile, roleProfile };
    });
    
    return NextResponse.json({
      success: true,
      data: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        profile: result.profile,
      },
      message: "User registered successfully"
    });
    
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}
```

#### Step 2: Create Login API Route

Create `src/app/api/v1/auth/login/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);
    
    // Find user with profile
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      }
    });
    
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Verify password
    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    
    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });
    
    // Create session record
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      }
    });
    
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
        token,
      },
      message: "Login successful"
    });
    
    // Set HTTP-only cookie for additional security
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    
    return response;
    
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
```

#### ✅ Validation Checkpoint 1.4:
```bash
# Test registration
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "admin123456",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN",
    "phone": "1234567890"
  }'

# Test login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "admin123456"
  }'
```
**Expected Result**: Both requests return success with proper user data and JWT token.

### 🎉 Phase 1 Success Metrics:
- ✅ Complete database schema with all core models
- ✅ User registration works with profile creation
- ✅ User login works with JWT token generation
- ✅ Role-specific profiles are created automatically
- ✅ Session tracking is implemented
- ✅ All relationships between models work correctly

**Great job! You now have a solid authentication system and complete data models.**

---

4. **System Models**
   ```prisma
   AuditLog (id, actorId, action, entity, entityId, metadata, ipAddress, userAgent, createdAt)
   Notification (id, userId, title, message, type, isRead, scheduledAt, createdAt)
   SystemSettings (key, value, description, category, updatedBy, updatedAt)
   ```

## Phase 2: API Infrastructure & Security (Week 2-3)

### 🎯 Goal: Build robust API foundation with security middleware

### 2.1 Authentication Middleware (Week 2)

#### Step 1: Create Authentication Middleware

Create `src/lib/middleware.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, hasRole, UserRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

export function withAuth(requiredRoles?: UserRole[]) {
  return async function middleware(
    request: NextRequest,
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
  ) {
    try {
      // Get token from header or cookie
      const authHeader = request.headers.get('authorization');
      const cookieToken = request.cookies.get('auth-token')?.value;
      
      const token = authHeader?.replace('Bearer ', '') || cookieToken;
      
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      // Verify JWT token
      const payload = verifyToken(token);
      
      // Check if session is still active
      const session = await prisma.session.findFirst({
        where: {
          token,
          isActive: true,
          expiresAt: {
            gt: new Date()
          }
        }
      });
      
      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Session expired' },
          { status: 401 }
        );
      }
      
      // Check role permissions
      if (requiredRoles && !hasRole(payload.role, requiredRoles)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      
      // Add user to request
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = payload;
      
      return handler(authenticatedRequest);
      
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  };
}

// Rate limiting helper
const rateLimitMap = new Map();

export function withRateLimit(maxRequests: number = 100, windowMs: number = 60000) {
  return function (handler: Function) {
    return async function (request: NextRequest) {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      const now = Date.now();
      const windowStart = now - windowMs;
      
      // Clean old entries
      const requests = rateLimitMap.get(ip) || [];
      const validRequests = requests.filter((time: number) => time > windowStart);
      
      if (validRequests.length >= maxRequests) {
        return NextResponse.json(
          { success: false, error: 'Rate limit exceeded' },
          { status: 429 }
        );
      }
      
      // Add current request
      validRequests.push(now);
      rateLimitMap.set(ip, validRequests);
      
      return handler(request);
    };
  };
}
```

#### Step 2: Create Protected Route Example

Create `src/app/api/v1/profile/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserRole } from '@/lib/auth';

async function handleGetProfile(request: AuthenticatedRequest) {
  try {
    const userId = request.user!.userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        studentProfile: true,
        teacherProfile: true,
        parentProfile: {
          include: {
            children: {
              include: {
                student: {
                  include: {
                    class: true,
                    user: {
                      include: {
                        profile: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        roleProfile: user.studentProfile || user.teacherProfile || user.parentProfile,
      }
    });
    
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export const GET = withAuth()(handleGetProfile);
```

#### ✅ Validation Checkpoint 2.1:
```bash
# Test protected route without token
curl http://localhost:3000/api/v1/profile

# Test with valid token (use token from login response)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/v1/profile
```
**Expected Result**: First request returns 401, second returns user profile.

### 2.2 CRUD Operations for Core Models (Week 2-3)

#### Step 1: Students API

Create `src/app/api/v1/students/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, withRateLimit, AuthenticatedRequest } from '@/lib/middleware';
import { UserRole } from '@/lib/auth';
import { z } from 'zod';

const createStudentSchema = z.object({
  userId: z.string().uuid(),
  classId: z.string().uuid(),
  rollNumber: z.string().min(1),
});

async function handleGetStudents(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const classId = searchParams.get('classId');
    
    const where = {
      isActive: true,
      ...(classId && { classId }),
    };
    
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          user: {
            include: {
              profile: true
            }
          },
          class: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { rollNumber: 'asc' }
      }),
      prisma.student.count({ where })
    ]);
    
    return NextResponse.json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Students fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

async function handleCreateStudent(request: AuthenticatedRequest) {
  try {
    const body = await request.json();
    const { userId, classId, rollNumber } = createStudentSchema.parse(body);
    
    // Check if user exists and doesn't already have a student profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (user.studentProfile) {
      return NextResponse.json(
        { success: false, error: 'User already has a student profile' },
        { status: 400 }
      );
    }
    
    // Create student profile
    const student = await prisma.student.create({
      data: {
        userId,
        studentId: `STU${Date.now()}`, // Generate unique ID
        classId,
        rollNumber,
        admissionDate: new Date(),
      },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        class: true,
      }
    });
    
    return NextResponse.json({
      success: true,
      data: student,
      message: 'Student created successfully'
    });
    
  } catch (error: any) {
    console.error('Student creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create student' },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit()(withAuth([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT_COORDINATOR])(handleGetStudents));
export const POST = withAuth([UserRole.ADMIN, UserRole.STUDENT_COORDINATOR])(handleCreateStudent);
```

#### ✅ Validation Checkpoint 2.2:
```bash
# Test creating academic year and class first
curl -X POST http://localhost:3000/api/v1/academic-years \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"year":"2024-2025","startDate":"2024-09-01","endDate":"2025-06-30","isActive":true}'

# Test students API
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/v1/students
```

### 2.3 Error Handling & Logging (Week 3)

#### Step 1: Global Error Handler

Create `src/lib/error-handler.ts`:

```typescript
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export interface ApiError extends Error {
  code?: string;
  statusCode?: number;
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json({
      success: false,
      error: 'Validation failed',
      details: error.errors
    }, { status: 400 });
  }
  
  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json({
          success: false,
          error: 'Record already exists'
        }, { status: 409 });
        
      case 'P2025':
        return NextResponse.json({
          success: false,
          error: 'Record not found'
        }, { status: 404 });
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Database error'
        }, { status: 500 });
    }
  }
  
  // Custom API errors
  if (error instanceof Error && 'statusCode' in error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: (error as ApiError).statusCode || 500 });
  }
  
  // Generic errors
  return NextResponse.json({
    success: false,
    error: 'Internal server error'
  }, { status: 500 });
}
```

#### ✅ Validation Checkpoint 2.3:
Update your API routes to use the error handler and test error scenarios.

### 🎉 Phase 2 Success Metrics:
- ✅ Authentication middleware protects routes correctly
- ✅ Rate limiting prevents abuse
- ✅ CRUD operations work for core models
- ✅ Proper error handling and validation
- ✅ Role-based access control implemented
- ✅ Pagination and filtering work correctly

**Excellent! You now have a secure, robust API foundation.**

---

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

### 🎯 Final Implementation Strategy

## Development Confidence Checklist

### Week 1 Milestones
- [ ] Database schema compiles without errors
- [ ] Can create and read users from database
- [ ] Basic API endpoints return correct responses
- [ ] Authentication (login/register) works completely
- [ ] JWT tokens are generated and verified correctly

### Week 2 Milestones
- [ ] Protected routes require authentication
- [ ] Role-based access control works
- [ ] CRUD operations for students, teachers, parents
- [ ] Error handling catches all edge cases
- [ ] API follows consistent response format

### Week 3 Milestones
- [ ] Academic year and class management
- [ ] Attendance system functional
- [ ] Data validation prevents bad inputs
- [ ] Database relationships work correctly
- [ ] Performance is acceptable for test data

### Week 4+ Milestones
- [ ] Assignment submission system
- [ ] Grade management
- [ ] Parent-student relationships
- [ ] File upload security
- [ ] Comprehensive testing

## Risk Mitigation Strategies

### 1. Start Small, Build Incrementally
- ✅ **Don't try to build everything at once**
- ✅ **Get one feature completely working before starting the next**
- ✅ **Test each component thoroughly before moving on**

### 2. Backup and Version Control
```bash
# Always work on feature branches
git checkout -b feature/authentication
git commit -m "Add user authentication"
git push origin feature/authentication

# Create daily backups
cp -r hcs-app hcs-app-backup-$(date +%Y%m%d)
```

### 3. Rollback Plans
```bash
# If something breaks, you can always rollback
git checkout main
git reset --hard HEAD~1  # Go back one commit

# Or restore from backup
rm -rf hcs-app
mv hcs-app-backup-20240101 hcs-app
```

### 4. Test Everything Immediately
```bash
# After each major change, test immediately
npm run build    # Check for TypeScript errors
npm run dev      # Start development server
# Test API endpoints with curl or Postman
```

---

## Next Steps After Completing Foundation

### Phase 4: Assignment & Grade Management
- Assignment creation and submission
- Grade entry and calculation
- Student progress tracking
- Parent grade access

### Phase 5: Communication System
- In-app messaging
- Announcements
- Email notifications
- Parent-teacher chat

### Phase 6: Fee Management
- Fee structure setup
- Payment processing
- Receipt generation
- Payment tracking

### Phase 7: Advanced Features
- Library management
- Event calendar
- Report generation
- Mobile app API

### Phase 8: Production Deployment
- Environment setup
- Security hardening
- Performance optimization
- Monitoring and logging

---

## 🚀 Getting Started Right Now

### Step 1: Create Your First Branch
```bash
cd /home/runner/work/HCS/HCS/hcs-app
git checkout -b feature/backend-foundation
```

### Step 2: Create Prisma Directory
```bash
mkdir prisma
```

### Step 3: Follow Phase 0 Instructions Above
- Start with the Prisma schema
- Create your first API endpoint
- Test database connection
- Get first success! 🎉

### Step 4: Celebrate Small Wins
- Each working API endpoint is a victory
- Each successful database operation builds confidence
- Each test that passes proves you're on the right track

---

## Remember: You've Got This! 💪

- **This project is absolutely doable** - thousands of developers have built similar systems
- **You have all the tools and knowledge** - TypeScript, Next.js, Prisma are well-documented
- **Start small and build up** - every expert was once a beginner
- **The foundation is already there** - your frontend structure shows you can build complex applications
- **One step at a time** - focus on today's task, not the entire project

### Most Important Rule: 
**If you get stuck for more than 30 minutes, take a break. Come back with fresh eyes. The solution is usually simpler than you think.**

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
