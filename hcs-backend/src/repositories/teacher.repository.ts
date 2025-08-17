import { Pool, PoolClient } from "pg";
import { pool } from "../config/database";
import logger from "../utils/logger";

export interface Teacher {
	id: string;
	userId: string;
	teacherId: string;
	department: string;
	subjects: string[];
	qualification: "diploma" | "bachelor" | "master" | "phd";
	experience: number;
	salary: number;
	joiningDate: Date;
	performanceRating: "excellent" | "good" | "average" | "needs_improvement";
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date;
	// User details from join
	email?: string;
	userStatus?: string;
	// Profile details from join
	firstName?: string;
	lastName?: string;
	phone?: string;
	address?: string;
	dateOfBirth?: Date;
	gender?: string;
	profilePicture?: string;
}

export interface CreateTeacherData {
	department: string;
	subjects: string[];
	qualification: "diploma" | "bachelor" | "master" | "phd";
	experience: number;
	salary: number;
	joiningDate: Date;
}

export interface UpdateTeacherData {
	department?: string;
	subjects?: string[];
	qualification?: "diploma" | "bachelor" | "master" | "phd";
	experience?: number;
	salary?: number;
	joiningDate?: Date;
	performanceRating?: "excellent" | "good" | "average" | "needs_improvement";
	isActive?: boolean;
}

export interface TeacherFilters {
	department?: string;
	qualification?: string;
	isActive?: boolean;
	search?: string;
	subjects?: string[];
	performanceRating?: string;
}

export interface PaginatedTeachers {
	teachers: Teacher[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface TeacherStats {
	total: number;
	active: number;
	inactive: number;
	byDepartment: { [key: string]: number };
	byQualification: { [key: string]: number };
	averageExperience: number;
	averageSalary: number;
}

export interface TeacherRow {
	id: string;
	user_id: string;
	teacher_id: string;
	department: string;
	subjects: string[];
	qualification: string;
	experience: number;
	salary: number;
	joining_date: Date;
	performance_rating: string;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	deleted_at?: Date;
}

export class TeacherRepository {
	private pool: Pool;

	constructor() {
		this.pool = pool;
	}

	/**
	 * Create a new teacher record
	 */
	async create(
		data: CreateTeacherData,
		userId: string,
		client?: PoolClient
	): Promise<Teacher> {
		const useClient = client || this.pool;

		try {
			// Generate teacher ID using the database function
			const teacherIdResult = await useClient.query(
				`SELECT generate_teacher_id() as teacher_id`
			);
			const teacherId = teacherIdResult.rows[0].teacher_id;

			const query = `
				INSERT INTO teachers (
					user_id, teacher_id, department, subjects, qualification, 
					experience, salary, joining_date, performance_rating, is_active
				) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
				RETURNING *
			`;

			const values = [
				userId,
				teacherId,
				data.department,
				data.subjects, // PostgreSQL array type
				data.qualification,
				data.experience,
				data.salary,
				data.joiningDate,
				"average", // Default performance rating
				true, // Active by default
			];

			const result = await useClient.query(query, values);
			const teacherRecord = result.rows[0];

			// Get the complete teacher data by joining with users and profiles
			const completeTeacher = client
				? await this.findById(teacherRecord.id, client)
				: await this.findById(teacherRecord.id);
			if (!completeTeacher) {
				throw new Error("Failed to retrieve created teacher");
			}

			logger.info(
				{ teacherId: teacherRecord.id },
				"Teacher created successfully"
			);
			return completeTeacher;
		} catch (error) {
			logger.error({ error }, "Error creating teacher");
			throw error;
		}
	}

	/**
	 * Get teacher by ID
	 */
	async findById(id: string, client?: PoolClient): Promise<Teacher | null> {
		const useClient = client || this.pool;

		try {
			const query = `
				SELECT 
					t.*,
					u.email as user_email,
					u.status as user_status,
					p.first_name,
					p.last_name,
					p.phone_number as phone,
					p.address_line1 as address,
					p.date_of_birth,
					p.gender,
					p.avatar_url as profile_picture
				FROM teachers t
				LEFT JOIN users u ON t.user_id = u.id
				LEFT JOIN profiles p ON t.user_id = p.user_id
				WHERE t.id = $1 AND t.deleted_at IS NULL
			`;

			const result = await useClient.query(query, [id]);

			if (result.rows.length === 0) {
				return null;
			}

			return this.mapToTeacher(result.rows[0]);
		} catch (error) {
			logger.error({ error, teacherId: id }, "Error finding teacher by ID");
			throw error;
		}
	}

	/**
	 * Get teacher by user ID
	 */
	async findByUserId(userId: string): Promise<Teacher | null> {
		try {
			const query = `
				SELECT 
					t.*,
					u.email as user_email,
					u.status as user_status,
					p.first_name,
					p.last_name,
					p.phone_number as phone,
					p.address_line1 as address,
					p.date_of_birth,
					p.gender,
					p.avatar_url as profile_picture
				FROM teachers t
				LEFT JOIN users u ON t.user_id = u.id
				LEFT JOIN profiles p ON t.user_id = p.user_id
				WHERE t.user_id = $1 AND t.deleted_at IS NULL
			`;

			const result = await this.pool.query(query, [userId]);

			if (result.rows.length === 0) {
				return null;
			}

			return this.mapToTeacher(result.rows[0]);
		} catch (error) {
			logger.error({ error, userId }, "Error finding teacher by user ID");
			throw error;
		}
	}

	/**
	 * Get teacher by teacher ID
	 */
	async findByTeacherId(teacherId: string): Promise<Teacher | null> {
		try {
			const query = `
				SELECT 
					t.*,
					u.email as user_email,
					u.status as user_status,
					p.first_name,
					p.last_name,
					p.phone_number as phone,
					p.address_line1 as address,
					p.date_of_birth,
					p.gender,
					p.avatar_url as profile_picture
				FROM teachers t
				LEFT JOIN users u ON t.user_id = u.id
				LEFT JOIN profiles p ON t.user_id = p.user_id
				WHERE t.teacher_id = $1 AND t.deleted_at IS NULL
			`;

			const result = await this.pool.query(query, [teacherId]);

			if (result.rows.length === 0) {
				return null;
			}

			return this.mapToTeacher(result.rows[0]);
		} catch (error) {
			logger.error({ error, teacherId }, "Error finding teacher by teacher ID");
			throw error;
		}
	}

	/**
	 * Get all teachers with pagination and filters
	 */
	async findAll(
		page: number = 1,
		limit: number = 10,
		filters: TeacherFilters = {}
	): Promise<PaginatedTeachers> {
		try {
			const offset = (page - 1) * limit;
			let whereConditions = ["t.deleted_at IS NULL"];
			let queryParams: any[] = [];
			let paramIndex = 1;

			// Build where conditions based on filters
			if (filters.department) {
				whereConditions.push(`t.department = $${paramIndex}`);
				queryParams.push(filters.department);
				paramIndex++;
			}

			if (filters.qualification) {
				whereConditions.push(`t.qualification = $${paramIndex}`);
				queryParams.push(filters.qualification);
				paramIndex++;
			}

			if (filters.isActive !== undefined) {
				whereConditions.push(`t.is_active = $${paramIndex}`);
				queryParams.push(filters.isActive);
				paramIndex++;
			}

			if (filters.performanceRating) {
				whereConditions.push(`t.performance_rating = $${paramIndex}`);
				queryParams.push(filters.performanceRating);
				paramIndex++;
			}

			if (filters.subjects && filters.subjects.length > 0) {
				whereConditions.push(`t.subjects && $${paramIndex}`);
				queryParams.push(filters.subjects);
				paramIndex++;
			}

			if (filters.search) {
				whereConditions.push(`(
					t.teacher_id ILIKE $${paramIndex} OR
					t.department ILIKE $${paramIndex} OR
					p.first_name ILIKE $${paramIndex} OR
					p.last_name ILIKE $${paramIndex} OR
					u.email ILIKE $${paramIndex}
				)`);
				queryParams.push(`%${filters.search}%`);
				paramIndex++;
			}

			const whereClause = whereConditions.join(" AND ");

			// Count total records
			const countQuery = `
				SELECT COUNT(DISTINCT t.id) as total
				FROM teachers t
				LEFT JOIN users u ON t.user_id = u.id
				LEFT JOIN profiles p ON t.user_id = p.user_id
				WHERE ${whereClause}
			`;

			const countResult = await this.pool.query(countQuery, queryParams);
			const total = parseInt(countResult.rows[0].total);

			// Get paginated data
			const dataQuery = `
				SELECT 
					t.*,
					u.email as user_email,
					u.status as user_status,
					p.first_name,
					p.last_name,
					p.phone_number as phone,
					p.address_line1 as address,
					p.date_of_birth,
					p.gender,
					p.avatar_url as profile_picture
				FROM teachers t
				LEFT JOIN users u ON t.user_id = u.id
				LEFT JOIN profiles p ON t.user_id = p.user_id
				WHERE ${whereClause}
				ORDER BY t.created_at DESC
				LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
			`;

			queryParams.push(limit, offset);
			const dataResult = await this.pool.query(dataQuery, queryParams);

			const teachers = dataResult.rows.map((row) => this.mapToTeacher(row));

			return {
				teachers,
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			};
		} catch (error) {
			logger.error({ error }, "Error finding all teachers");
			throw error;
		}
	}

	/**
	 * Update teacher
	 */
	async update(id: string, data: UpdateTeacherData): Promise<Teacher | null> {
		try {
			const updateFields: string[] = [];
			const values: any[] = [];
			let paramIndex = 1;

			if (data.department !== undefined) {
				updateFields.push(`department = $${paramIndex}`);
				values.push(data.department);
				paramIndex++;
			}

			if (data.subjects !== undefined) {
				updateFields.push(`subjects = $${paramIndex}`);
				values.push(data.subjects);
				paramIndex++;
			}

			if (data.qualification !== undefined) {
				updateFields.push(`qualification = $${paramIndex}`);
				values.push(data.qualification);
				paramIndex++;
			}

			if (data.experience !== undefined) {
				updateFields.push(`experience = $${paramIndex}`);
				values.push(data.experience);
				paramIndex++;
			}

			if (data.salary !== undefined) {
				updateFields.push(`salary = $${paramIndex}`);
				values.push(data.salary);
				paramIndex++;
			}

			if (data.joiningDate !== undefined) {
				updateFields.push(`joining_date = $${paramIndex}`);
				values.push(data.joiningDate);
				paramIndex++;
			}

			if (data.performanceRating !== undefined) {
				updateFields.push(`performance_rating = $${paramIndex}`);
				values.push(data.performanceRating);
				paramIndex++;
			}

			if (data.isActive !== undefined) {
				updateFields.push(`is_active = $${paramIndex}`);
				values.push(data.isActive);
				paramIndex++;
			}

			if (updateFields.length === 0) {
				throw new Error("No fields to update");
			}

			updateFields.push(`updated_at = NOW()`);
			values.push(id);

			const query = `
				UPDATE teachers 
				SET ${updateFields.join(", ")}
				WHERE id = $${paramIndex} AND deleted_at IS NULL
				RETURNING *
			`;

			const result = await this.pool.query(query, values);

			if (result.rows.length === 0) {
				return null;
			}

			// Get complete teacher data
			return this.findById(id);
		} catch (error) {
			logger.error({ error, teacherId: id }, "Error updating teacher");
			throw error;
		}
	}

	/**
	 * Soft delete teacher
	 */
	async delete(id: string): Promise<boolean> {
		try {
			const query = `
				UPDATE teachers 
				SET deleted_at = NOW(), updated_at = NOW()
				WHERE id = $1 AND deleted_at IS NULL
				RETURNING id
			`;

			const result = await this.pool.query(query, [id]);
			return result.rows.length > 0;
		} catch (error) {
			logger.error({ error, teacherId: id }, "Error deleting teacher");
			throw error;
		}
	}

	/**
	 * Get teacher statistics
	 */
	async getStats(): Promise<TeacherStats> {
		try {
			const queries = {
				total:
					"SELECT COUNT(*) as count FROM teachers WHERE deleted_at IS NULL",
				active:
					"SELECT COUNT(*) as count FROM teachers WHERE deleted_at IS NULL AND is_active = true",
				inactive:
					"SELECT COUNT(*) as count FROM teachers WHERE deleted_at IS NULL AND is_active = false",
				byDepartment:
					"SELECT department, COUNT(*) as count FROM teachers WHERE deleted_at IS NULL GROUP BY department",
				byQualification:
					"SELECT qualification, COUNT(*) as count FROM teachers WHERE deleted_at IS NULL GROUP BY qualification",
				averageExperience:
					"SELECT AVG(experience) as avg FROM teachers WHERE deleted_at IS NULL",
				averageSalary:
					"SELECT AVG(salary) as avg FROM teachers WHERE deleted_at IS NULL",
			};

			const [
				totalResult,
				activeResult,
				inactiveResult,
				departmentResult,
				qualificationResult,
				experienceResult,
				salaryResult,
			] = await Promise.all([
				this.pool.query(queries.total),
				this.pool.query(queries.active),
				this.pool.query(queries.inactive),
				this.pool.query(queries.byDepartment),
				this.pool.query(queries.byQualification),
				this.pool.query(queries.averageExperience),
				this.pool.query(queries.averageSalary),
			]);

			const byDepartment: { [key: string]: number } = {};
			departmentResult.rows.forEach((row) => {
				byDepartment[row.department] = parseInt(row.count);
			});

			const byQualification: { [key: string]: number } = {};
			qualificationResult.rows.forEach((row) => {
				byQualification[row.qualification] = parseInt(row.count);
			});

			return {
				total: parseInt(totalResult.rows[0].count),
				active: parseInt(activeResult.rows[0].count),
				inactive: parseInt(inactiveResult.rows[0].count),
				byDepartment,
				byQualification,
				averageExperience: parseFloat(experienceResult.rows[0].avg) || 0,
				averageSalary: parseFloat(salaryResult.rows[0].avg) || 0,
			};
		} catch (error) {
			logger.error({ error }, "Error getting teacher stats");
			throw error;
		}
	}

	/**
	 * Check if teacher ID already exists
	 */
	async existsByTeacherId(teacherId: string): Promise<boolean> {
		try {
			const query =
				"SELECT 1 FROM teachers WHERE teacher_id = $1 AND deleted_at IS NULL";
			const result = await this.pool.query(query, [teacherId]);
			return result.rows.length > 0;
		} catch (error) {
			logger.error({ error, teacherId }, "Error checking teacher ID existence");
			throw error;
		}
	}

	/**
	 * Get teachers by department
	 */
	async findByDepartment(department: string): Promise<Teacher[]> {
		try {
			const query = `
				SELECT 
					t.*,
					u.email as user_email,
					u.status as user_status,
					p.first_name,
					p.last_name,
					p.phone_number as phone,
					p.address_line1 as address,
					p.date_of_birth,
					p.gender,
					p.avatar_url as profile_picture
				FROM teachers t
				LEFT JOIN users u ON t.user_id = u.id
				LEFT JOIN profiles p ON t.user_id = p.user_id
				WHERE t.department = $1 AND t.deleted_at IS NULL AND t.is_active = true
				ORDER BY p.first_name, p.last_name
			`;

			const result = await this.pool.query(query, [department]);
			return result.rows.map((row) => this.mapToTeacher(row));
		} catch (error) {
			logger.error(
				{ error, department },
				"Error finding teachers by department"
			);
			throw error;
		}
	}

	/**
	 * Get teachers by subject
	 */
	async findBySubject(subject: string): Promise<Teacher[]> {
		try {
			const query = `
				SELECT 
					t.*,
					u.email as user_email,
					u.status as user_status,
					p.first_name,
					p.last_name,
					p.phone_number as phone,
					p.address_line1 as address,
					p.date_of_birth,
					p.gender,
					p.avatar_url as profile_picture
				FROM teachers t
				LEFT JOIN users u ON t.user_id = u.id
				LEFT JOIN profiles p ON t.user_id = p.user_id
				WHERE $1 = ANY(t.subjects) AND t.deleted_at IS NULL AND t.is_active = true
				ORDER BY p.first_name, p.last_name
			`;

			const result = await this.pool.query(query, [subject]);
			return result.rows.map((row) => this.mapToTeacher(row));
		} catch (error) {
			logger.error({ error, subject }, "Error finding teachers by subject");
			throw error;
		}
	}

	/**
	 * Get teacher by email (through user table)
	 */
	async findByEmail(email: string): Promise<Teacher | null> {
		try {
			const query = `
				SELECT 
					t.*,
					u.email as user_email,
					u.status as user_status,
					p.first_name,
					p.last_name,
					p.phone_number as phone,
					p.address_line1 as address,
					p.date_of_birth,
					p.gender,
					p.avatar_url as profile_picture
				FROM teachers t
				LEFT JOIN users u ON t.user_id = u.id
				LEFT JOIN profiles p ON t.user_id = p.user_id
				WHERE u.email = $1 AND t.deleted_at IS NULL
			`;

			const result = await this.pool.query(query, [email]);

			if (result.rows.length === 0) {
				return null;
			}

			return this.mapToTeacher(result.rows[0]);
		} catch (error) {
			logger.error({ error, email }, "Error finding teacher by email");
			throw error;
		}
	}

	/**
	 * Find multiple teachers (alias for findAll)
	 */
	async findMany(
		page: number = 1,
		limit: number = 10,
		filters: TeacherFilters = {}
	): Promise<PaginatedTeachers> {
		return this.findAll(page, limit, filters);
	}

	/**
	 * Update user ID for a teacher (for user reassignment)
	 */
	async updateUserId(teacherId: string, newUserId: string): Promise<boolean> {
		try {
			const query = `
				UPDATE teachers 
				SET user_id = $1, updated_at = NOW()
				WHERE id = $2 AND deleted_at IS NULL
				RETURNING id
			`;

			const result = await this.pool.query(query, [newUserId, teacherId]);
			return result.rows.length > 0;
		} catch (error) {
			logger.error(
				{ error, teacherId, newUserId },
				"Error updating teacher user ID"
			);
			throw error;
		}
	}

	/**
	 * Map database row to Teacher object
	 */
	private mapToTeacher(row: any): Teacher {
		return {
			id: row.id,
			userId: row.user_id,
			teacherId: row.teacher_id,
			department: row.department,
			subjects: row.subjects || [],
			qualification: row.qualification,
			experience: row.experience,
			salary: row.salary,
			joiningDate: row.joining_date,
			performanceRating: row.performance_rating,
			isActive: row.is_active,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
			deletedAt: row.deleted_at,
			// User details
			email: row.user_email,
			userStatus: row.user_status,
			// Profile details
			firstName: row.first_name,
			lastName: row.last_name,
			phone: row.phone,
			address: row.address,
			dateOfBirth: row.date_of_birth,
			gender: row.gender,
			profilePicture: row.profile_picture,
		};
	}
}

export default TeacherRepository;
