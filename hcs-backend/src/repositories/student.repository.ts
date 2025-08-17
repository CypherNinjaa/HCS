import { Pool, PoolClient } from "pg";
import { pool } from "../config/database";
import logger from "../utils/logger";

export interface CreateStudentData {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	address?: string;
	dateOfBirth?: string;
	classId: string;
	rollNumber: string;
	admissionDate: string;
	bloodGroup?: string;
	medicalConditions?: string;
	parentName?: string;
	parentPhone?: string;
	parentEmail?: string;
}

export interface UpdateStudentData {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	address?: string;
	dateOfBirth?: string;
	classId?: string;
	rollNumber?: string;
	bloodGroup?: string;
	medicalConditions?: string;
	feeStatus?: "PAID" | "PENDING" | "OVERDUE";
	attendancePercentage?: number;
	performanceGrade?: "EXCELLENT" | "GOOD" | "AVERAGE" | "NEEDS_IMPROVEMENT";
	isActive?: boolean;
}

export interface StudentFilters {
	search?: string;
	classId?: string;
	grade?: number;
	section?: string;
	feeStatus?: string;
	status?: string;
	performanceGrade?: string;
	page?: number;
	limit?: number;
}

export interface Student {
	id: string;
	userId: string;
	studentId: string;
	admissionNumber: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	address?: string;
	dateOfBirth?: string;
	classId: string;
	className: string;
	grade: number;
	section: string;
	rollNumber: string;
	admissionDate: string;
	bloodGroup?: string;
	medicalConditions?: string;
	feeStatus: string;
	attendancePercentage: number;
	performanceGrade: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export class StudentRepository {
	private pool: Pool;

	constructor() {
		this.pool = pool;
	}

	async create(
		studentData: CreateStudentData,
		userId: string
	): Promise<Student> {
		const client = await this.pool.connect();
		try {
			await client.query("BEGIN");

			// Generate student ID and admission number
			const studentIdResult = await client.query(
				"SELECT generate_student_id() as student_id"
			);
			const admissionNumberResult = await client.query(
				"SELECT generate_admission_number() as admission_number"
			);

			const studentId = studentIdResult.rows[0].student_id;
			const admissionNumber = admissionNumberResult.rows[0].admission_number;

			// Insert student record
			const studentQuery = `
        INSERT INTO students (
          user_id, student_id, admission_number, class_id, roll_number, 
          admission_date, blood_group, medical_conditions
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

			const studentResult = await client.query(studentQuery, [
				userId,
				studentId,
				admissionNumber,
				studentData.classId,
				studentData.rollNumber,
				studentData.admissionDate,
				studentData.bloodGroup || null,
				studentData.medicalConditions || null,
			]);

			await client.query("COMMIT");

			// Return the created student with joined data
			return await this.findById(studentResult.rows[0].id);
		} catch (error) {
			await client.query("ROLLBACK");
			logger.error({ error }, "Error creating student");
			throw error;
		} finally {
			client.release();
		}
	}

	async findById(id: string): Promise<Student> {
		const query = `
      SELECT 
        s.*,
        p.first_name,
        p.last_name,
        u.email,
        p.phone_number as phone,
        p.address_line1 as address,
        p.date_of_birth,
        c.name as class_name,
        c.grade,
        c.section
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN profiles p ON u.id = p.user_id
      JOIN classes c ON s.class_id = c.id
      WHERE s.id = $1 AND s.deleted_at IS NULL
    `;

		const result = await this.pool.query(query, [id]);

		if (result.rows.length === 0) {
			throw new Error("Student not found");
		}

		return this.mapRowToStudent(result.rows[0]);
	}

	async findMany(
		filters: StudentFilters = {}
	): Promise<{ students: Student[]; total: number }> {
		const {
			search = "",
			classId,
			grade,
			section,
			feeStatus,
			status,
			performanceGrade,
			page = 1,
			limit = 10,
		} = filters;

		const offset = (page - 1) * limit;
		const conditions: string[] = ["s.deleted_at IS NULL"];
		const params: any[] = [];
		let paramCount = 0;

		// Build WHERE conditions dynamically
		if (search) {
			paramCount++;
			conditions.push(`(
        p.first_name ILIKE $${paramCount} OR 
        p.last_name ILIKE $${paramCount} OR 
        s.student_id ILIKE $${paramCount} OR 
        u.email ILIKE $${paramCount}
      )`);
			params.push(`%${search}%`);
		}

		if (classId) {
			paramCount++;
			conditions.push(`s.class_id = $${paramCount}`);
			params.push(classId);
		}

		if (grade) {
			paramCount++;
			conditions.push(`c.grade = $${paramCount}`);
			params.push(grade);
		}

		if (section) {
			paramCount++;
			conditions.push(`c.section = $${paramCount}`);
			params.push(section);
		}

		if (feeStatus) {
			paramCount++;
			conditions.push(`s.fee_status = $${paramCount}`);
			params.push(feeStatus.toUpperCase());
		}

		if (status) {
			paramCount++;
			conditions.push(`s.is_active = $${paramCount}`);
			params.push(status === "active");
		}

		if (performanceGrade) {
			paramCount++;
			conditions.push(`s.performance_grade = $${paramCount}`);
			params.push(performanceGrade.toUpperCase());
		}

		const whereClause =
			conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

		// Get total count
		const countQuery = `
      SELECT COUNT(*) as total
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN profiles p ON u.id = p.user_id
      JOIN classes c ON s.class_id = c.id
      ${whereClause}
    `;

		const countResult = await this.pool.query(countQuery, params);
		const total = parseInt(countResult.rows[0].total);

		// Get paginated results
		const dataQuery = `
      SELECT 
        s.*,
        p.first_name,
        p.last_name,
        u.email,
        p.phone_number as phone,
        p.address_line1 as address,
        p.date_of_birth,
        c.name as class_name,
        c.grade,
        c.section
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN profiles p ON u.id = p.user_id
      JOIN classes c ON s.class_id = c.id
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

		params.push(limit, offset);
		const dataResult = await this.pool.query(dataQuery, params);

		const students = dataResult.rows.map((row) => this.mapRowToStudent(row));

		return { students, total };
	}

	async update(id: string, updates: UpdateStudentData): Promise<Student> {
		const client = await this.pool.connect();
		try {
			await client.query("BEGIN");

			// Build dynamic update query for students table
			const studentUpdates: string[] = [];
			const studentParams: any[] = [];
			let studentParamCount = 0;

			const studentFields = {
				classId: "class_id",
				rollNumber: "roll_number",
				bloodGroup: "blood_group",
				medicalConditions: "medical_conditions",
				feeStatus: "fee_status",
				attendancePercentage: "attendance_percentage",
				performanceGrade: "performance_grade",
				isActive: "is_active",
			};

			for (const [key, dbField] of Object.entries(studentFields)) {
				if (updates[key as keyof UpdateStudentData] !== undefined) {
					studentParamCount++;
					studentUpdates.push(`${dbField} = $${studentParamCount}`);
					studentParams.push(updates[key as keyof UpdateStudentData]);
				}
			}

			if (studentUpdates.length > 0) {
				studentParamCount++;
				const studentQuery = `
          UPDATE students 
          SET ${studentUpdates.join(", ")}
          WHERE id = $${studentParamCount} AND deleted_at IS NULL
        `;
				studentParams.push(id);
				await client.query(studentQuery, studentParams);
			}

			// Build dynamic update query for profiles table
			const profileUpdates: string[] = [];
			const profileParams: any[] = [];
			let profileParamCount = 0;

			const profileFields = {
				firstName: "first_name",
				lastName: "last_name",
				phone: "phone_number",
				address: "address_line1",
				dateOfBirth: "date_of_birth",
			};

			for (const [key, dbField] of Object.entries(profileFields)) {
				if (updates[key as keyof UpdateStudentData] !== undefined) {
					profileParamCount++;
					profileUpdates.push(`${dbField} = $${profileParamCount}`);
					profileParams.push(updates[key as keyof UpdateStudentData]);
				}
			}

			if (profileUpdates.length > 0) {
				profileParamCount++;
				const profileQuery = `
          UPDATE profiles 
          SET ${profileUpdates.join(", ")}
          WHERE user_id = (SELECT user_id FROM students WHERE id = $${profileParamCount})
        `;
				profileParams.push(id);
				await client.query(profileQuery, profileParams);
			}

			// Update email in users table if provided
			if (updates.email) {
				const emailQuery = `
          UPDATE users 
          SET email = $1, updated_at = CURRENT_TIMESTAMP
          WHERE id = (SELECT user_id FROM students WHERE id = $2)
        `;
				await client.query(emailQuery, [updates.email, id]);
			}

			await client.query("COMMIT");

			return await this.findById(id);
		} catch (error) {
			await client.query("ROLLBACK");
			logger.error({ error }, "Error updating student");
			throw error;
		} finally {
			client.release();
		}
	}

	async softDelete(id: string): Promise<void> {
		const query = `
      UPDATE students 
      SET deleted_at = CURRENT_TIMESTAMP, is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
    `;

		const result = await this.pool.query(query, [id]);

		if (result.rowCount === 0) {
			throw new Error("Student not found or already deleted");
		}
	}

	async getStats(): Promise<{
		total: number;
		active: number;
		inactive: number;
		pendingFees: number;
		paidFees: number;
		overdueFees: number;
	}> {
		const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active,
        COUNT(CASE WHEN is_active = false THEN 1 END) as inactive,
        COUNT(CASE WHEN fee_status = 'PENDING' THEN 1 END) as pending_fees,
        COUNT(CASE WHEN fee_status = 'PAID' THEN 1 END) as paid_fees,
        COUNT(CASE WHEN fee_status = 'OVERDUE' THEN 1 END) as overdue_fees
      FROM students 
      WHERE deleted_at IS NULL
    `;

		const result = await this.pool.query(query);
		const row = result.rows[0];

		return {
			total: parseInt(row.total),
			active: parseInt(row.active),
			inactive: parseInt(row.inactive),
			pendingFees: parseInt(row.pending_fees),
			paidFees: parseInt(row.paid_fees),
			overdueFees: parseInt(row.overdue_fees),
		};
	}

	private mapRowToStudent(row: any): Student {
		return {
			id: row.id,
			userId: row.user_id,
			studentId: row.student_id,
			admissionNumber: row.admission_number,
			firstName: row.first_name,
			lastName: row.last_name,
			email: row.email,
			phone: row.phone,
			address: row.address,
			dateOfBirth: row.date_of_birth,
			classId: row.class_id,
			className: row.class_name,
			grade: row.grade,
			section: row.section,
			rollNumber: row.roll_number,
			admissionDate: row.admission_date,
			bloodGroup: row.blood_group,
			medicalConditions: row.medical_conditions,
			feeStatus: row.fee_status,
			attendancePercentage: parseFloat(row.attendance_percentage) || 0,
			performanceGrade: row.performance_grade,
			isActive: row.is_active,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
		};
	}
}
