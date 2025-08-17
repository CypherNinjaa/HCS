import { z } from "zod";
import {
	TeacherRepository,
	CreateTeacherData,
	UpdateTeacherData,
	TeacherFilters,
	Teacher,
} from "../repositories/teacher.repository";
import { UserRepository } from "../repositories/user.repository";
import { ProfileRepository } from "../repositories/profile.repository";
import { AuditLogRepository } from "../repositories/audit-log.repository";
import bcrypt from "bcryptjs";
import logger from "../utils/logger";

// Validation schemas
export const createTeacherSchema = z.object({
	firstName: z.string().min(1, "First name is required").max(50),
	lastName: z.string().min(1, "Last name is required").max(50),
	email: z.string().email("Invalid email address"),
	phone: z.string().optional(),
	address: z.string().optional(),
	dateOfBirth: z.string().optional(),
	joiningDate: z
		.string()
		.refine((date) => !isNaN(Date.parse(date)), "Invalid joining date"),
	qualification: z.enum(["diploma", "bachelor", "master", "phd"]),
	experience: z.number().min(0, "Experience cannot be negative"),
	subjects: z.array(z.string()).min(1, "At least one subject is required"),
	department: z.string().min(1, "Department is required").max(100),
	designation: z.string().optional(),
	salary: z.number().min(0, "Salary cannot be negative").optional(),
	// Add password field for credential generation
	teacherPassword: z
		.string()
		.min(6, "Teacher password must be at least 6 characters")
		.optional(),
});

export const updateTeacherSchema = z.object({
	firstName: z.string().min(1).max(50).optional(),
	lastName: z.string().min(1).max(50).optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	address: z.string().optional(),
	dateOfBirth: z.string().optional(),
	qualification: z.enum(["diploma", "bachelor", "master", "phd"]).optional(),
	experience: z.number().min(0).optional(),
	subjects: z.array(z.string()).min(1).optional(),
	department: z.string().min(1).max(100).optional(),
	designation: z.string().optional(),
	salary: z.number().min(0).optional(),
	attendancePercentage: z.number().min(0).max(100).optional(),
	performanceRating: z
		.enum(["excellent", "good", "average", "needs_improvement"])
		.optional(),
	isActive: z.boolean().optional(),
});

export const teacherFiltersSchema = z.object({
	search: z.string().optional(),
	department: z.string().optional(),
	subjects: z.array(z.string()).optional(),
	qualification: z.enum(["diploma", "bachelor", "master", "phd"]).optional(),
	experience: z.string().optional(),
	status: z.enum(["active", "inactive"]).optional(),
	performanceRating: z
		.enum(["excellent", "good", "average", "needs_improvement"])
		.optional(),
	page: z.number().min(1).default(1).optional(),
	limit: z.number().min(1).max(100).default(10).optional(),
});

export class TeacherService {
	private teacherRepository: TeacherRepository;
	private userRepository: UserRepository;
	private profileRepository: ProfileRepository;
	private auditLogRepository: AuditLogRepository;

	constructor() {
		this.teacherRepository = new TeacherRepository();
		this.userRepository = new UserRepository();
		this.profileRepository = new ProfileRepository();
		this.auditLogRepository = new AuditLogRepository();
	}

	async createTeacher(data: any, createdBy: string): Promise<Teacher> {
		// Validate input data
		const validatedData = createTeacherSchema.parse(data);

		try {
			// Check if teacher email is already in use
			const existingUser = await this.userRepository.findByEmail(
				validatedData.email
			);
			if (existingUser) {
				throw new Error("Teacher email address is already in use");
			}

			// Use provided password or generate temporary one
			const teacherPassword =
				validatedData.teacherPassword || this.generateTempPassword();

			// Hash password
			const hashedTeacherPassword = await bcrypt.hash(teacherPassword, 12);

			// Create teacher user account
			const teacherUser = await this.userRepository.create({
				email: validatedData.email,
				password_hash: hashedTeacherPassword,
				role: "teacher",
				status: "active",
			});

			// Create teacher profile
			await this.profileRepository.create({
				user_id: teacherUser.id,
				first_name: validatedData.firstName,
				last_name: validatedData.lastName,
				phone_number: validatedData.phone,
				address_line1: validatedData.address,
				date_of_birth: validatedData.dateOfBirth
					? new Date(validatedData.dateOfBirth)
					: undefined,
			});

			// Create teacher record - match repository interface
			const teacherData: CreateTeacherData = {
				department: validatedData.department,
				subjects: validatedData.subjects,
				qualification: validatedData.qualification,
				experience: validatedData.experience,
				salary: validatedData.salary || 0, // Default to 0 if not provided
				joiningDate: new Date(validatedData.joiningDate),
			};

			const teacher = await this.teacherRepository.create(
				teacherData,
				teacherUser.id
			);

			// Log the creation
			await this.auditLogRepository.create({
				actor_id: createdBy,
				action: "create",
				entity_type: "TEACHER",
				entity_id: teacher.id,
				metadata: {
					teacherId: teacher.teacherId,
					teacherPassword: validatedData.teacherPassword
						? "provided"
						: teacherPassword, // Store actual password only if not provided (temporary)
				},
			});

			logger.info(
				{
					teacherId: teacher.id,
					teacherNumber: teacher.teacherId,
				},
				"Teacher account created successfully"
			);

			return teacher;
		} catch (error) {
			logger.error({ error }, "Error creating teacher");
			throw error;
		}
	}

	async getTeachers(
		filters: any
	): Promise<{ teachers: Teacher[]; total: number; pagination: any }> {
		const validatedFilters = teacherFiltersSchema.parse(filters);

		// Convert validated filters to repository format
		const repositoryFilters: TeacherFilters = {
			department: validatedFilters.department,
			qualification: validatedFilters.qualification,
			search: validatedFilters.search,
			subjects: validatedFilters.subjects,
			performanceRating: validatedFilters.performanceRating,
			isActive:
				validatedFilters.status === "active"
					? true
					: validatedFilters.status === "inactive"
					? false
					: undefined,
		};

		const page = validatedFilters.page || 1;
		const limit = validatedFilters.limit || 10;

		const result = await this.teacherRepository.findAll(
			page,
			limit,
			repositoryFilters
		);

		const pagination = {
			page: page,
			limit: limit,
			total: result.total,
			totalPages: Math.ceil(result.total / limit),
		};

		return {
			teachers: result.teachers,
			total: result.total,
			pagination,
		};
	}

	async getTeacherById(id: string): Promise<Teacher> {
		if (!this.isValidUuid(id)) {
			throw new Error("Invalid teacher ID format");
		}

		const teacher = await this.teacherRepository.findById(id);
		if (!teacher) {
			throw new Error("Teacher not found");
		}

		return teacher;
	}

	async getTeacherByTeacherId(teacherId: string): Promise<Teacher> {
		if (!teacherId || teacherId.trim() === "") {
			throw new Error("Teacher ID is required");
		}

		const teacher = await this.teacherRepository.findByTeacherId(teacherId);
		if (!teacher) {
			throw new Error("Teacher not found");
		}

		return teacher;
	}

	async getTeacherByEmail(email: string): Promise<Teacher> {
		if (!email || !this.isValidEmail(email)) {
			throw new Error("Valid email is required");
		}

		const teacher = await this.teacherRepository.findByEmail(email);
		if (!teacher) {
			throw new Error("Teacher not found");
		}

		return teacher;
	}

	async updateTeacher(
		id: string,
		updates: UpdateTeacherData,
		updatedBy: string
	): Promise<Teacher> {
		if (!this.isValidUuid(id)) {
			throw new Error("Invalid teacher ID format");
		}

		// Validate update data
		const validatedUpdates = updateTeacherSchema.parse(updates);

		try {
			// Get current teacher data for comparison
			const currentTeacher = await this.teacherRepository.findById(id);
			if (!currentTeacher) {
				throw new Error("Teacher not found");
			}

			// Check if email is being changed and if it's already in use
			if (
				validatedUpdates.email &&
				validatedUpdates.email !== currentTeacher.email
			) {
				const existingUser = await this.userRepository.findByEmail(
					validatedUpdates.email
				);
				if (existingUser) {
					throw new Error("Email address is already in use");
				}
			}

			// Convert updates to repository format
			const repositoryUpdates: UpdateTeacherData = {};
			if (validatedUpdates.department)
				repositoryUpdates.department = validatedUpdates.department;
			if (validatedUpdates.qualification)
				repositoryUpdates.qualification = validatedUpdates.qualification;
			if (validatedUpdates.subjects)
				repositoryUpdates.subjects = validatedUpdates.subjects;
			if (validatedUpdates.experience !== undefined)
				repositoryUpdates.experience = validatedUpdates.experience;
			if (validatedUpdates.salary !== undefined)
				repositoryUpdates.salary = validatedUpdates.salary;
			if (validatedUpdates.performanceRating)
				repositoryUpdates.performanceRating =
					validatedUpdates.performanceRating;
			if (validatedUpdates.isActive !== undefined)
				repositoryUpdates.isActive = validatedUpdates.isActive;

			// Update teacher
			const updatedTeacher = await this.teacherRepository.update(
				id,
				repositoryUpdates
			);

			if (!updatedTeacher) {
				throw new Error("Failed to update teacher");
			}

			// Log the update
			await this.auditLogRepository.create({
				actor_id: updatedBy,
				action: "update",
				entity_type: "TEACHER",
				entity_id: id,
				old_values: {
					email: currentTeacher.email,
					department: currentTeacher.department,
					subjects: currentTeacher.subjects,
					salary: currentTeacher.salary,
					isActive: currentTeacher.isActive,
				},
				new_values: validatedUpdates,
			});

			logger.info({ teacherId: id }, "Teacher updated successfully");

			return updatedTeacher;
		} catch (error) {
			logger.error({ error }, "Error updating teacher");
			throw error;
		}
	}

	async deleteTeacher(id: string, deletedBy: string): Promise<void> {
		if (!this.isValidUuid(id)) {
			throw new Error("Invalid teacher ID format");
		}

		try {
			const teacher = await this.teacherRepository.findById(id);
			if (!teacher) {
				throw new Error("Teacher not found");
			}

			await this.teacherRepository.delete(id);

			// Log the deletion
			await this.auditLogRepository.create({
				actor_id: deletedBy,
				action: "delete",
				entity_type: "TEACHER",
				entity_id: id,
				metadata: {
					teacherId: teacher.teacherId,
					email: teacher.email,
					department: teacher.department,
				},
			});

			logger.info({ teacherId: id }, "Teacher deleted successfully");
		} catch (error) {
			logger.error({ error }, "Error deleting teacher");
			throw error;
		}
	}

	async getTeacherStats(): Promise<{
		total: number;
		active: number;
		newHires: number;
		byDepartment: Record<string, number>;
	}> {
		const stats = await this.teacherRepository.getStats();

		// Calculate new hires (last 30 days)
		// This would typically be a separate query, for now we'll use a placeholder
		const newHires = Math.floor(stats.total * 0.03); // 3% as new hires

		return {
			total: stats.total,
			active: stats.active,
			newHires,
			byDepartment: {}, // Will need to implement department stats in repository
		};
	}

	async bulkUpdateTeachers(
		teacherIds: string[],
		updates: UpdateTeacherData,
		updatedBy: string
	): Promise<void> {
		const validatedUpdates = updateTeacherSchema.parse(updates);

		try {
			for (const teacherId of teacherIds) {
				await this.updateTeacher(teacherId, validatedUpdates, updatedBy);
			}

			// Log bulk update
			await this.auditLogRepository.create({
				actor_id: updatedBy,
				action: "update",
				entity_type: "TEACHER",
				metadata: {
					teacherIds,
					updates: validatedUpdates,
					count: teacherIds.length,
					operation: "bulk_update",
				},
			});

			logger.info(
				{ count: teacherIds.length },
				"Bulk teacher update completed"
			);
		} catch (error) {
			logger.error({ error }, "Error in bulk teacher update");
			throw error;
		}
	}

	async getTeachersByDepartment(department: string): Promise<Teacher[]> {
		if (!department || department.trim() === "") {
			throw new Error("Department is required");
		}

		const result = await this.teacherRepository.findAll(1, 1000, {
			department: department.trim(),
			isActive: true,
		});

		return result.teachers;
	}

	async getTeachersBySubject(subject: string): Promise<Teacher[]> {
		if (!subject || subject.trim() === "") {
			throw new Error("Subject is required");
		}

		const result = await this.teacherRepository.findAll(1, 1000, {
			subjects: [subject.trim()],
			isActive: true,
		});

		return result.teachers;
	}

	async updateTeacherUserId(
		teacherId: string,
		userId: string,
		updatedBy: string
	): Promise<void> {
		if (!this.isValidUuid(teacherId)) {
			throw new Error("Invalid teacher ID format");
		}

		if (!this.isValidUuid(userId)) {
			throw new Error("Invalid user ID format");
		}

		try {
			await this.teacherRepository.updateUserId(teacherId, userId);

			// Log the user ID update
			await this.auditLogRepository.create({
				actor_id: updatedBy,
				action: "update",
				entity_type: "TEACHER",
				entity_id: teacherId,
				metadata: {
					operation: "update_user_id",
					newUserId: userId,
				},
			});

			logger.info(
				{ teacherId, userId },
				"Teacher user ID updated successfully"
			);
		} catch (error) {
			logger.error({ error }, "Error updating teacher user ID");
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

	private isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
}
