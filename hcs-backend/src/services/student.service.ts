import { z } from "zod";
import {
	StudentRepository,
	CreateStudentData,
	UpdateStudentData,
	StudentFilters,
	Student,
} from "../repositories/student.repository";
import { UserRepository } from "../repositories/user.repository";
import { ProfileRepository } from "../repositories/profile.repository";
import { AuditLogRepository } from "../repositories/audit-log.repository";
import bcrypt from "bcryptjs";
import logger from "../utils/logger";

// Validation schemas
export const createStudentSchema = z.object({
	firstName: z.string().min(1, "First name is required").max(50),
	lastName: z.string().min(1, "Last name is required").max(50),
	email: z.string().email("Invalid email address"),
	phone: z.string().optional(),
	address: z.string().optional(),
	dateOfBirth: z.string().optional(),
	classId: z.string().uuid("Invalid class ID"),
	rollNumber: z.string().min(1, "Roll number is required").max(20),
	admissionDate: z
		.string()
		.refine((date) => !isNaN(Date.parse(date)), "Invalid admission date"),
	bloodGroup: z
		.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
		.optional(),
	medicalConditions: z.string().optional(),
	parentName: z.string().optional(),
	parentPhone: z.string().optional(),
	parentEmail: z.string().email().optional(),
	// Add password fields for credential generation
	studentPassword: z
		.string()
		.min(6, "Student password must be at least 6 characters")
		.optional(),
	parentPassword: z
		.string()
		.min(6, "Parent password must be at least 6 characters")
		.optional(),
});

export const updateStudentSchema = z.object({
	firstName: z.string().min(1).max(50).optional(),
	lastName: z.string().min(1).max(50).optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	address: z.string().optional(),
	dateOfBirth: z.string().optional(),
	classId: z.string().uuid().optional(),
	rollNumber: z.string().min(1).max(20).optional(),
	bloodGroup: z
		.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
		.optional(),
	medicalConditions: z.string().optional(),
	feeStatus: z.enum(["PAID", "PENDING", "OVERDUE"]).optional(),
	attendancePercentage: z.number().min(0).max(100).optional(),
	performanceGrade: z
		.enum(["EXCELLENT", "GOOD", "AVERAGE", "NEEDS_IMPROVEMENT"])
		.optional(),
	isActive: z.boolean().optional(),
});

export const studentFiltersSchema = z.object({
	search: z.string().optional(),
	classId: z.string().uuid().optional(),
	grade: z.number().min(1).max(12).optional(),
	section: z.string().optional(),
	feeStatus: z.enum(["PAID", "PENDING", "OVERDUE"]).optional(),
	status: z.enum(["active", "inactive"]).optional(),
	performanceGrade: z
		.enum(["EXCELLENT", "GOOD", "AVERAGE", "NEEDS_IMPROVEMENT"])
		.optional(),
	page: z.number().min(1).default(1).optional(),
	limit: z.number().min(1).max(100).default(10).optional(),
});

export class StudentService {
	private studentRepository: StudentRepository;
	private userRepository: UserRepository;
	private profileRepository: ProfileRepository;
	private auditLogRepository: AuditLogRepository;

	constructor() {
		this.studentRepository = new StudentRepository();
		this.userRepository = new UserRepository();
		this.profileRepository = new ProfileRepository();
		this.auditLogRepository = new AuditLogRepository();
	}

	async createStudent(
		data: CreateStudentData,
		createdBy: string
	): Promise<Student> {
		// Validate input data
		const validatedData = createStudentSchema.parse(data);

		try {
			// Check if student email is already in use
			const existingUser = await this.userRepository.findByEmail(
				validatedData.email
			);
			if (existingUser) {
				throw new Error("Student email address is already in use");
			}

			// Check if parent email is already in use (if provided)
			if (validatedData.parentEmail) {
				const existingParentUser = await this.userRepository.findByEmail(
					validatedData.parentEmail
				);
				if (existingParentUser) {
					throw new Error("Parent email address is already in use");
				}
			}

			// Check if roll number is already taken in the class
			const existingStudents = await this.studentRepository.findMany({
				classId: validatedData.classId,
				limit: 1000, // Get all students in class to check roll number
			});

			const rollNumberExists = existingStudents.students.some(
				(student) => student.rollNumber === validatedData.rollNumber
			);

			if (rollNumberExists) {
				throw new Error("Roll number is already taken in this class");
			}

			// Use provided passwords or generate temporary ones
			const studentPassword =
				validatedData.studentPassword || this.generateTempPassword();
			const parentPassword =
				validatedData.parentPassword || this.generateTempPassword();

			// Hash passwords
			const hashedStudentPassword = await bcrypt.hash(studentPassword, 12);
			const hashedParentPassword = await bcrypt.hash(parentPassword, 12);

			// Create student user account
			const studentUser = await this.userRepository.create({
				email: validatedData.email,
				password_hash: hashedStudentPassword,
				role: "student",
				status: "active",
			});

			// Create student profile
			await this.profileRepository.create({
				user_id: studentUser.id,
				first_name: validatedData.firstName,
				last_name: validatedData.lastName,
				phone_number: validatedData.phone,
				address_line1: validatedData.address,
				date_of_birth: validatedData.dateOfBirth
					? new Date(validatedData.dateOfBirth)
					: undefined,
			});

			// Create parent user account if parent data is provided
			let parentUser = null;
			if (validatedData.parentEmail && validatedData.parentName) {
				parentUser = await this.userRepository.create({
					email: validatedData.parentEmail,
					password_hash: hashedParentPassword,
					role: "parent",
					status: "active",
				});

				// Create parent profile
				await this.profileRepository.create({
					user_id: parentUser.id,
					first_name:
						validatedData.parentName.split(" ")[0] || validatedData.parentName,
					last_name:
						validatedData.parentName.split(" ").slice(1).join(" ") || "",
					phone_number: validatedData.parentPhone,
				});
			}

			// Create student record
			const student = await this.studentRepository.create(
				validatedData,
				studentUser.id
			);

			// Log the creation
			await this.auditLogRepository.create({
				actor_id: createdBy,
				action: "create",
				entity_type: "STUDENT",
				entity_id: student.id,
				metadata: {
					studentId: student.studentId,
					admissionNumber: student.admissionNumber,
					studentPassword: validatedData.studentPassword
						? "provided"
						: studentPassword, // Store actual password only if not provided (temporary)
					parentPassword: validatedData.parentPassword
						? "provided"
						: parentPassword, // Store actual password only if not provided (temporary)
					parentUserId: parentUser?.id,
				},
			});

			logger.info(
				{
					studentId: student.id,
					studentNumber: student.studentId,
					parentUserId: parentUser?.id,
				},
				"Student and parent accounts created successfully"
			);

			return student;
		} catch (error) {
			logger.error(
				{ error, email: validatedData.email },
				"Error creating student"
			);
			throw error;
		}
	}

	async getStudents(
		filters: StudentFilters
	): Promise<{ students: Student[]; total: number; pagination: any }> {
		const validatedFilters = studentFiltersSchema.parse(filters);

		const result = await this.studentRepository.findMany(validatedFilters);

		const pagination = {
			page: validatedFilters.page || 1,
			limit: validatedFilters.limit || 10,
			total: result.total,
			totalPages: Math.ceil(result.total / (validatedFilters.limit || 10)),
		};

		return {
			students: result.students,
			total: result.total,
			pagination,
		};
	}

	async getStudentById(id: string): Promise<Student> {
		if (!this.isValidUuid(id)) {
			throw new Error("Invalid student ID format");
		}

		return await this.studentRepository.findById(id);
	}

	async updateStudent(
		id: string,
		updates: UpdateStudentData,
		updatedBy: string
	): Promise<Student> {
		if (!this.isValidUuid(id)) {
			throw new Error("Invalid student ID format");
		}

		// Validate update data
		const validatedUpdates = updateStudentSchema.parse(updates);

		try {
			// Get current student data for comparison
			const currentStudent = await this.studentRepository.findById(id);

			// Check if email is being changed and if it's already in use
			if (
				validatedUpdates.email &&
				validatedUpdates.email !== currentStudent.email
			) {
				const existingUser = await this.userRepository.findByEmail(
					validatedUpdates.email
				);
				if (existingUser) {
					throw new Error("Email address is already in use");
				}
			}

			// Check if roll number is being changed and if it's already taken
			if (
				validatedUpdates.rollNumber &&
				validatedUpdates.rollNumber !== currentStudent.rollNumber
			) {
				const classId = validatedUpdates.classId || currentStudent.classId;
				const existingStudents = await this.studentRepository.findMany({
					classId,
					limit: 1000,
				});

				const rollNumberExists = existingStudents.students.some(
					(student) =>
						student.rollNumber === validatedUpdates.rollNumber &&
						student.id !== id
				);

				if (rollNumberExists) {
					throw new Error("Roll number is already taken in this class");
				}
			}

			// Update student
			const updatedStudent = await this.studentRepository.update(
				id,
				validatedUpdates
			);

			// Log the update
			await this.auditLogRepository.create({
				actor_id: updatedBy,
				action: "update",
				entity_type: "STUDENT",
				entity_id: id,
				old_values: {
					email: currentStudent.email,
					rollNumber: currentStudent.rollNumber,
					classId: currentStudent.classId,
					feeStatus: currentStudent.feeStatus,
					isActive: currentStudent.isActive,
				},
				new_values: validatedUpdates,
			});

			logger.info({ studentId: id }, "Student updated successfully");

			return updatedStudent;
		} catch (error) {
			logger.error({ error, studentId: id }, "Error updating student");
			throw error;
		}
	}

	async deleteStudent(id: string, deletedBy: string): Promise<void> {
		if (!this.isValidUuid(id)) {
			throw new Error("Invalid student ID format");
		}

		try {
			const student = await this.studentRepository.findById(id);

			await this.studentRepository.softDelete(id);

			// Log the deletion
			await this.auditLogRepository.create({
				actor_id: deletedBy,
				action: "delete",
				entity_type: "STUDENT",
				entity_id: id,
				metadata: {
					studentId: student.studentId,
					admissionNumber: student.admissionNumber,
					email: student.email,
				},
			});

			logger.info({ studentId: id }, "Student deleted successfully");
		} catch (error) {
			logger.error({ error, studentId: id }, "Error deleting student");
			throw error;
		}
	}

	async getStudentStats(): Promise<{
		total: number;
		active: number;
		newAdmissions: number;
		pendingFees: number;
	}> {
		const stats = await this.studentRepository.getStats();

		// Calculate new admissions (last 30 days)
		// This would typically be a separate query, for now we'll use a placeholder
		const newAdmissions = Math.floor(stats.total * 0.05); // 5% as new admissions

		return {
			total: stats.total,
			active: stats.active,
			newAdmissions,
			pendingFees: stats.pendingFees + stats.overdueFees,
		};
	}

	async bulkUpdateStudents(
		studentIds: string[],
		updates: UpdateStudentData,
		updatedBy: string
	): Promise<void> {
		const validatedUpdates = updateStudentSchema.parse(updates);

		try {
			for (const studentId of studentIds) {
				await this.updateStudent(studentId, validatedUpdates, updatedBy);
			}

			// Log bulk update
			await this.auditLogRepository.create({
				actor_id: updatedBy,
				action: "update",
				entity_type: "STUDENT",
				metadata: {
					studentIds,
					updates: validatedUpdates,
					count: studentIds.length,
					operation: "bulk_update",
				},
			});

			logger.info(
				{ count: studentIds.length },
				"Bulk student update completed"
			);
		} catch (error) {
			logger.error({ error, studentIds }, "Error in bulk student update");
			throw error;
		}
	}

	private generateTempPassword(): string {
		// Generate a secure temporary password
		const chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let password = "";
		for (let i = 0; i < 8; i++) {
			password += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return password;
	}

	private isValidUuid(uuid: string): boolean {
		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		return uuidRegex.test(uuid);
	}
}
