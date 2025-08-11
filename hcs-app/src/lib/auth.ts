import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define the UserRole enum locally since it should match Prisma schema
export enum UserRole {
	STUDENT = "STUDENT",
	TEACHER = "TEACHER",
	PARENT = "PARENT",
	ADMIN = "ADMIN",
	STUDENT_COORDINATOR = "STUDENT_COORDINATOR",
	LIBRARIAN = "LIBRARIAN",
	MEDIA_COORDINATOR = "MEDIA_COORDINATOR",
}

export interface JWTPayload {
	userId: string;
	email: string;
	role: UserRole;
	iat?: number;
	exp?: number;
}

/**
 * Hash password with bcrypt (minimum 12 rounds for security)
 */
export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 12);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
	password: string,
	hash: string
): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(
	payload: Omit<JWTPayload, "iat" | "exp">
): string {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET is not configured");
	}

	return jwt.sign(payload, secret, {
		expiresIn: "7d", // Token expires in 7 days
	});
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET is not configured");
	}

	try {
		return jwt.verify(token, secret) as JWTPayload;
	} catch {
		throw new Error("Invalid or expired token");
	}
}

/**
 * Generate random password for new users
 */
export function generateRandomPassword(length: number = 8): string {
	const charset =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
	let password = "";

	for (let i = 0; i < length; i++) {
		password += charset.charAt(Math.floor(Math.random() * charset.length));
	}

	return password;
}

/**
 * Generate unique ID for different user types
 */
export function generateUniqueId(prefix: string): string {
	const timestamp = Date.now().toString().slice(-6);
	const random = Math.floor(Math.random() * 1000)
		.toString()
		.padStart(3, "0");
	return `${prefix}${timestamp}${random}`;
}

/**
 * Check if user has required role
 */
export function hasRole(
	userRole: UserRole,
	requiredRoles: UserRole[]
): boolean {
	return requiredRoles.includes(userRole);
}

/**
 * Check if user has admin privileges
 */
export function isAdmin(userRole: UserRole): boolean {
	return userRole === "ADMIN";
}

/**
 * Check if user can access student data
 */
export function canAccessStudentData(
	userRole: UserRole,
	studentId: string,
	userId: string
): boolean {
	// Admins and student coordinators can access all student data
	if (userRole === "ADMIN" || userRole === "STUDENT_COORDINATOR") {
		return true;
	}

	// Students can only access their own data
	if (userRole === "STUDENT") {
		return studentId === userId;
	}

	// Teachers can access their students' data (implement class-based check)
	if (userRole === "TEACHER") {
		// TODO: Implement class-based permission check
		return true;
	}

	// Parents can access their children's data (implement parent-child relationship check)
	if (userRole === "PARENT") {
		// TODO: Implement parent-child relationship check
		return true;
	}

	return false;
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
	return input.replace(/[<>]/g, "").trim();
}

/**
 * Validate file upload
 */
export function validateFileUpload(
	file: File,
	allowedTypes: string[],
	maxSize: number
): { valid: boolean; error?: string } {
	// Check file type
	if (!allowedTypes.includes(file.type)) {
		return { valid: false, error: "File type not allowed" };
	}

	// Check file size
	if (file.size > maxSize) {
		return { valid: false, error: "File size exceeds limit" };
	}

	return { valid: true };
}

/**
 * Calculate points for gamification
 */
export function calculatePoints(
	activityType: string,
	performance?: number
): number {
	const pointsMap: Record<string, number> = {
		ATTENDANCE: 5,
		ASSIGNMENT_SUBMIT: 10,
		ASSIGNMENT_GOOD: 20,
		ASSIGNMENT_EXCELLENT: 30,
		MCQ_ATTEMPT: 5,
		MCQ_GOOD: 15,
		MCQ_EXCELLENT: 25,
		EXAM_PASS: 50,
		EXAM_GOOD: 75,
		EXAM_EXCELLENT: 100,
	};

	let basePoints = pointsMap[activityType] || 0;

	// Multiply by performance percentage if provided
	if (performance !== undefined && performance > 0) {
		basePoints = Math.round(basePoints * (performance / 100));
	}

	return basePoints;
}
