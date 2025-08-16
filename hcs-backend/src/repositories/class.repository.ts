import pool from "../config/database";
import logger from "../utils/logger";
import { Pool } from "pg";

export interface Class {
	id: string;
	name: string;
	grade: number;
	academic_year_id: string;
	section: string;
	capacity: number;
	current_strength: number;
	class_teacher_id?: string;
	room_number?: string;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	deleted_at?: Date | null;
}

export interface CreateClassInput {
	name: string;
	grade: number;
	academic_year_id: string;
	section: string;
	capacity: number;
	class_teacher_id?: string;
	room_number?: string;
}
export interface UpdateClassInput {
	name?: string;
	grade?: number;
	section?: string;
	capacity?: number;
	class_teacher_id?: string | null;
	room_number?: string | null;
	is_active?: boolean;
}

export interface ClassFilter {
	academic_year_id?: string;
	name?: string;
	grade?: number;
	section?: string;
	is_active?: boolean;
	search?: string;
}

export interface ClassListOptions {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "ASC" | "DESC";
	filters?: ClassFilter;
}

export class ClassRepository {
	private db: Pool;

	constructor() {
		this.db = pool;
	}

	async create(
		classData: CreateClassInput,
		auditUserId: string
	): Promise<Class> {
		const query = `
      INSERT INTO classes (
        name, grade, academic_year_id, section, capacity, 
        class_teacher_id, room_number, current_strength,
        is_active, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, 0, true, NOW(), NOW()
      ) RETURNING *
    `;

		const values = [
			classData.name,
			classData.grade,
			classData.academic_year_id,
			classData.section,
			classData.capacity,
			classData.class_teacher_id || null,
			classData.room_number || null,
		];
		try {
			const result = await this.db.query(query, values);

			if (result.rows.length === 0) {
				throw new Error("Failed to create class");
			}

			const createdClass = result.rows[0];

			// Log audit trail
			await this.logAuditTrail(
				createdClass.id,
				"CREATE",
				null,
				createdClass,
				auditUserId
			);

			logger.info(
				{
					classId: createdClass.id,
					name: createdClass.name,
					section: createdClass.section,
					auditUserId,
				},
				"Class created successfully"
			);

			return createdClass;
		} catch (error) {
			logger.error({ error, classData, auditUserId }, "Error creating class");
			throw error;
		}
	}

	async findById(id: string): Promise<Class | null> {
		const query = `
      SELECT c.*, ay.year as academic_year_name, ay.year as academic_year
      FROM classes c
      LEFT JOIN academic_years ay ON c.academic_year_id = ay.id
      WHERE c.id = $1 AND c.deleted_at IS NULL
    `;
		try {
			const result = await this.db.query(query, [id]);
			return result.rows.length > 0 ? result.rows[0] : null;
		} catch (error) {
			logger.error({ error, id }, "Error finding class by ID");
			throw error;
		}
	}

	async findAll(options: ClassListOptions = {}): Promise<{
		classes: Class[];
		pagination: {
			total: number;
			page: number;
			limit: number;
			totalPages: number;
		};
	}> {
		const {
			page = 1,
			limit = 10,
			sortBy = "name",
			sortOrder = "ASC",
			filters = {},
		} = options;

		const offset = (page - 1) * limit;
		let whereConditions = ["c.deleted_at IS NULL"];
		let queryParams: any[] = [];
		let paramIndex = 1;

		// Build WHERE conditions based on filters
		if (filters.academic_year_id) {
			whereConditions.push(`c.academic_year_id = $${paramIndex}`);
			queryParams.push(filters.academic_year_id);
			paramIndex++;
		}

		if (filters.name) {
			whereConditions.push(`c.name ILIKE $${paramIndex}`);
			queryParams.push(`%${filters.name}%`);
			paramIndex++;
		}

		if (filters.grade) {
			whereConditions.push(`c.grade = $${paramIndex}`);
			queryParams.push(filters.grade);
			paramIndex++;
		}

		if (filters.section) {
			whereConditions.push(`c.section ILIKE $${paramIndex}`);
			queryParams.push(`%${filters.section}%`);
			paramIndex++;
		}
		if (filters.is_active !== undefined) {
			whereConditions.push(`c.is_active = $${paramIndex}`);
			queryParams.push(filters.is_active);
			paramIndex++;
		}

		if (filters.search) {
			whereConditions.push(`(
        c.name ILIKE $${paramIndex} OR 
        c.section ILIKE $${paramIndex} OR 
        c.room_number ILIKE $${paramIndex} OR
        c.grade::text ILIKE $${paramIndex}
      )`);
			queryParams.push(`%${filters.search}%`);
			paramIndex++;
		}
		const whereClause = whereConditions.join(" AND ");

		// Count query
		const countQuery = `
      SELECT COUNT(*) as total
      FROM classes c
      WHERE ${whereClause}
    `;

		// Data query
		const dataQuery = `
      SELECT 
        c.*,
        ay.year as academic_year_name,
        ay.year as academic_year,
        COUNT(s.id) as current_enrolled
      FROM classes c
      LEFT JOIN academic_years ay ON c.academic_year_id = ay.id
      LEFT JOIN students s ON c.id = s.class_id AND s.deleted_at IS NULL
      WHERE ${whereClause}
      GROUP BY c.id, ay.year
      ORDER BY c.${sortBy} ${sortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
		queryParams.push(limit, offset);

		try {
			const [countResult, dataResult] = await Promise.all([
				this.db.query(countQuery, queryParams.slice(0, -2)),
				this.db.query(dataQuery, queryParams),
			]);

			const total = parseInt(countResult.rows[0].total);
			const totalPages = Math.ceil(total / limit);

			return {
				classes: dataResult.rows,
				pagination: {
					total,
					page,
					limit,
					totalPages,
				},
			};
		} catch (error) {
			logger.error({ error, options }, "Error finding all classes");
			throw error;
		}
	}

	async update(
		id: string,
		updates: UpdateClassInput,
		auditUserId: string
	): Promise<Class | null> {
		// First get the current class data for audit
		const currentClass = await this.findById(id);
		if (!currentClass) {
			return null;
		}

		const updateFields: string[] = [];
		const values: any[] = [];
		let paramIndex = 1;

		// Build dynamic update query
		Object.entries(updates).forEach(([key, value]) => {
			if (value !== undefined) {
				updateFields.push(`${key} = $${paramIndex}`);
				values.push(value);
				paramIndex++;
			}
		});

		if (updateFields.length === 0) {
			return currentClass;
		}

		updateFields.push(`updated_at = NOW()`);
		values.push(id); // for WHERE clause

		const query = `
      UPDATE classes 
      SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING *
    `;

		try {
			const result = await this.db.query(query, values);

			if (result.rows.length === 0) {
				return null;
			}

			const updatedClass = result.rows[0];

			// Log audit trail
			await this.logAuditTrail(
				id,
				"UPDATE",
				currentClass,
				updatedClass,
				auditUserId
			);

			logger.info(
				{
					classId: id,
					updates,
					auditUserId,
				},
				"Class updated successfully"
			);

			return updatedClass;
		} catch (error) {
			logger.error({ error, id, updates, auditUserId }, "Error updating class");
			throw error;
		}
	}

	async delete(id: string, auditUserId: string): Promise<boolean> {
		// First get the current class data for audit
		const currentClass = await this.findById(id);
		if (!currentClass) {
			return false;
		}

		const query = `
      UPDATE classes 
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id
    `;

		try {
			const result = await this.db.query(query, [id]);

			if (result.rows.length === 0) {
				return false;
			}

			// Log audit trail
			await this.logAuditTrail(
				id,
				"DELETE",
				currentClass,
				{ ...currentClass, deleted_at: new Date() },
				auditUserId
			);

			logger.info(
				{
					classId: id,
					auditUserId,
				},
				"Class deleted successfully"
			);

			return true;
		} catch (error) {
			logger.error({ error, id, auditUserId }, "Error deleting class");
			throw error;
		}
	}

	async getStats(): Promise<{
		total: number;
		active: number;
		inactive: number;
		byAcademicYear: Array<{ academic_year: string; count: number }>;
	}> {
		const queries = [
			// Total classes
			`SELECT COUNT(*) as total FROM classes WHERE deleted_at IS NULL`,

			// Active classes
			`SELECT COUNT(*) as active FROM classes WHERE is_active = true AND deleted_at IS NULL`,

			// Inactive classes
			`SELECT COUNT(*) as inactive FROM classes WHERE is_active = false AND deleted_at IS NULL`,

			// Classes by academic year
			`SELECT 
        ay.year as academic_year,
        COUNT(c.id) as count
      FROM academic_years ay
      LEFT JOIN classes c ON ay.id = c.academic_year_id AND c.deleted_at IS NULL
      GROUP BY ay.id, ay.year
      ORDER BY ay.year DESC`,
		];

		try {
			const results = await Promise.all(
				queries.map((query) => this.db.query(query))
			);

			return {
				total: parseInt(results[0].rows[0].total),
				active: parseInt(results[1].rows[0].active),
				inactive: parseInt(results[2].rows[0].inactive),
				byAcademicYear: results[3].rows,
			};
		} catch (error) {
			logger.error({ error }, "Error getting class stats");
			throw error;
		}
	}

	private async logAuditTrail(
		classId: string,
		action: "CREATE" | "UPDATE" | "DELETE",
		oldData: any,
		newData: any,
		userId: string
	): Promise<void> {
		const query = `
      INSERT INTO audit_logs (
        entity_type, entity_id, action, old_data, new_data, 
        user_id, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `;

		const values = [
			"class",
			classId,
			action,
			oldData ? JSON.stringify(oldData) : null,
			newData ? JSON.stringify(newData) : null,
			userId,
		];

		try {
			await this.db.query(query, values);
		} catch (error) {
			logger.error(
				{ error, classId, action, userId },
				"Error logging audit trail"
			);
			// Don't throw here as audit logging shouldn't fail the main operation
		}
	}
}
