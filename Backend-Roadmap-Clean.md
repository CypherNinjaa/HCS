# Happy Child School — Backend Roadmap (Express + PostgreSQL)

## 🚀 Backend Direction (Clean & Simple)

**Frontend**: Next.js (already in `hcs-app/`, TypeScript, App Router)  
**Backend**: New service `hcs-backend/` using Express + TypeScript  
**Database**: PostgreSQL locally via `pg` driver → seamless future migration to Supabase  
**Auth**: JWT (httpOnly cookies) with Role-Based Access Control (RBAC)  
**Validation**: Zod on all routes (body, query, params)  
**Security**: Helmet, CORS, rate limiting, input sanitization, audit logs  
**Logging**: Pino (pretty output in dev with pino-pretty)  
**Testing**: Jest + Supertest (unit + integration tests)  
**Deployment**: Local dev with `npm run dev` → Future: Render/Railway/Supabase

## Why This Stack is Perfect:

✅ **No Docker complexity** - Local PostgreSQL install  
✅ **No ORM overhead** - Direct SQL with `pg` driver  
✅ **Seamless Supabase migration** - Same PostgreSQL engine  
✅ **Better performance** - Raw SQL queries, full control  
✅ **Lighter dependencies** - Minimal, focused tech stack  
✅ **Future-proof** - Native PostgreSQL features available

---

## Phase 0: Bootstrap Express Backend (Day 1)

**Goal**: Run Express server with TypeScript, PostgreSQL connection, health route

### 0.1 Create `hcs-backend` and install dependencies

```bash
mkdir hcs-backend && cd hcs-backend
npm init -y

# Core dependencies
npm install express pg bcryptjs jsonwebtoken cookie-parser zod
npm install helmet cors express-rate-limit pino pino-pretty dotenv
npm install @types/express @types/pg @types/bcryptjs @types/jsonwebtoken
npm install @types/cookie-parser typescript ts-node nodemon --save-dev

# Testing dependencies
npm install jest supertest @types/jest @types/supertest --save-dev
```

### 0.2 Project structure & TypeScript setup

```
hcs-backend/
├── src/
│   ├── config/
│   │   ├── env.ts          # Environment validation
│   │   └── database.ts     # PostgreSQL connection
│   ├── middleware/
│   │   ├── auth.ts         # JWT auth middleware
│   │   ├── rbac.ts         # Role-based access control
│   │   ├── rateLimit.ts    # Rate limiting
│   │   └── error.ts        # Error handling
│   ├── routes/
│   │   ├── index.ts        # Route aggregation
│   │   ├── health.ts       # Health check
│   │   └── auth.ts         # Auth endpoints
│   ├── services/
│   │   ├── authService.ts  # Auth business logic
│   │   └── userService.ts  # User operations
│   ├── utils/
│   │   ├── logger.ts       # Pino logger setup
│   │   ├── crypto.ts       # Hashing utilities
│   │   └── validation.ts   # Zod schemas
│   ├── app.ts              # Express app setup
│   └── server.ts           # Server startup
├── tests/
├── .env.example
├── tsconfig.json
└── package.json
```

### 0.3 Environment & database setup

```bash
# Install PostgreSQL locally (Ubuntu/Debian)
sudo apt update && sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE hcs_db;
CREATE USER hcs_user WITH PASSWORD 'hcs_password';
GRANT ALL PRIVILEGES ON DATABASE hcs_db TO hcs_user;
\q
```

### ✅ Checkpoint: Health route working

`npm run dev` → `http://localhost:4000/health` → `{ status: 'ok' }`

---

## Phase 1: Database Schema & Raw SQL (2-3 days)

**Goal**: Create tables with raw SQL, database connection, basic user operations

### 1.1 Database schema creation

```sql
-- Create tables with proper constraints
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (core authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Profiles table (user details)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    avatar_url VARCHAR(500),
    emergency_contact VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs (security tracking)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id UUID,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### 1.2 Database service implementation

```typescript
// src/config/database.ts
import { Pool } from "pg";
import { env } from "./env";

export const pool = new Pool({
	connectionString: env.DATABASE_URL,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

// Test connection
pool.on("connect", () => {
	console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
	console.error("PostgreSQL pool error:", err);
	process.exit(-1);
});
```

### ✅ Checkpoint: Database operations working

- Tables created successfully
- Connection pool functioning
- Basic CRUD operations with raw SQL

---

## Phase 2: Authentication & JWT (3-4 days)

**Goal**: Complete auth system with JWT cookies, RBAC, security middleware

### 2.1 Auth service with raw SQL

```typescript
// src/services/authService.ts
import { pool } from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
	async register(userData: RegisterData) {
		const client = await pool.connect();
		try {
			await client.query("BEGIN");

			// Check if user exists
			const existingUser = await client.query(
				"SELECT id FROM users WHERE email = $1",
				[userData.email]
			);

			if (existingUser.rows.length > 0) {
				throw new Error("User already exists");
			}

			// Hash password
			const passwordHash = await bcrypt.hash(userData.password, 12);

			// Create user
			const userResult = await client.query(
				`INSERT INTO users (email, password_hash, role) 
         VALUES ($1, $2, $3) RETURNING id, email, role`,
				[userData.email, passwordHash, userData.role || "STUDENT"]
			);

			// Create profile
			await client.query(
				`INSERT INTO profiles (user_id, first_name, last_name) 
         VALUES ($1, $2, $3)`,
				[userResult.rows[0].id, userData.firstName, userData.lastName]
			);

			await client.query("COMMIT");
			return userResult.rows[0];
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}
	}

	async login(email: string, password: string) {
		const result = await pool.query(
			"SELECT id, email, password_hash, role FROM users WHERE email = $1 AND is_active = true",
			[email]
		);

		if (result.rows.length === 0) {
			throw new Error("Invalid credentials");
		}

		const user = result.rows[0];
		const isValid = await bcrypt.compare(password, user.password_hash);

		if (!isValid) {
			throw new Error("Invalid credentials");
		}

		// Update last login
		await pool.query(
			"UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1",
			[user.id]
		);

		// Generate JWT
		const token = jwt.sign(
			{ userId: user.id, email: user.email, role: user.role },
			process.env.JWT_SECRET!,
			{ expiresIn: "7d" }
		);

		return { user: { id: user.id, email: user.email, role: user.role }, token };
	}
}
```

### ✅ Checkpoint: Auth system working

- Register/login with PostgreSQL
- JWT tokens with httpOnly cookies
- RBAC middleware protecting routes
- Rate limiting and security headers

---

## Phase 3: Core CRUD Operations (1 week)

**Goal**: Users, Profiles, Academic Year, Class, Subject with pagination

### 3.1 Academic schema

```sql
-- Academic years
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year VARCHAR(20) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 12),
    section VARCHAR(10) NOT NULL,
    capacity INTEGER DEFAULT 30,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
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
```

### ✅ Checkpoint: Academic structure working

- CRUD operations for all entities
- Proper pagination and filtering
- Frontend can create/list academic data

---

## Phase 4: Role-Specific Tables (1 week)

**Goal**: Students, Teachers, Parents with relationships

```sql
-- Students
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    class_id UUID NOT NULL REFERENCES classes(id),
    roll_number VARCHAR(20) NOT NULL,
    admission_date DATE NOT NULL,
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
    qualification TEXT,
    experience INTEGER DEFAULT 0,
    joining_date DATE NOT NULL,
    salary DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parents
CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id VARCHAR(20) UNIQUE NOT NULL,
    occupation VARCHAR(100),
    relationship_type VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parent-Student relationships
CREATE TABLE parent_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    relationship_type VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(parent_id, student_id)
);
```

### ✅ Checkpoint: Role relationships working

- Parent-child linking functional
- Role-based data access enforced
- Permission checks working correctly

---

## Remaining Phases (Simplified)

- **Phase 5**: Attendance & Assignments (raw SQL, file handling)
- **Phase 6**: Exams & MCQ (with anti-cheat metadata)
- **Phase 7**: Notifications & Media (SMTP, file storage)
- **Phase 8**: Fees, Library, Analytics (business logic)

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
