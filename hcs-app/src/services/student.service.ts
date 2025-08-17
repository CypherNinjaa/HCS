/**
 * Student Service - Supabase Implementation
 * Handles all student-related database operations
 */

import { supabase } from "@/lib/supabase";
import { handleApiError } from "@/lib/error-handler";

export interface Student {
	id: string;
	user_id: string;
	first_name: string;
	last_name: string;
	middle_name?: string;
	class_id?: string;
	section_id?: string;
	roll_number?: string;
	date_of_birth?: string;
	gender?: string;
	phone_number?: string;
	address?: string;
	parent_id?: string;
	status: "active" | "inactive" | "suspended" | "graduated";
	created_at: string;
	updated_at: string;
}

export interface CreateStudentRequest {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	middle_name?: string;
	class_id?: string;
	section_id?: string;
	roll_number?: string;
	date_of_birth?: string;
	gender?: string;
	phone_number?: string;
	address?: string;
	parent_id?: string;
}

export interface UpdateStudentRequest {
	first_name?: string;
	last_name?: string;
	middle_name?: string;
	class_id?: string;
	section_id?: string;
	roll_number?: string;
	date_of_birth?: string;
	gender?: string;
	phone_number?: string;
	address?: string;
	parent_id?: string;
	status?: "active" | "inactive" | "suspended" | "graduated";
}

export interface StudentFilters {
	search?: string;
	class_id?: string;
	section_id?: string;
	status?: string;
	page?: number;
	limit?: number;
}

export interface StudentsResponse {
	students: Student[];
	total: number;
	page: number;
	totalPages: number;
}

class StudentService {
	private readonly tableName = "students";

	/**
	 * Get all students with optional filtering and pagination
	 */
	async getStudents(filters: StudentFilters = {}): Promise<StudentsResponse> {
		try {
			const {
				search,
				class_id,
				section_id,
				status = "active",
				page = 1,
				limit = 20,
			} = filters;

			let query = supabase.from(this.tableName).select("*", { count: "exact" });

			// Apply filters
			if (search) {
				query = query.or(
					`first_name.ilike.%${search}%,last_name.ilike.%${search}%,roll_number.ilike.%${search}%`
				);
			}

			if (class_id) {
				query = query.eq("class_id", class_id);
			}

			if (section_id) {
				query = query.eq("section_id", section_id);
			}

			if (status) {
				query = query.eq("status", status);
			}

			// Apply pagination
			const from = (page - 1) * limit;
			const to = from + limit - 1;
			query = query.range(from, to);

			// Order by last name, first name
			query = query.order("last_name").order("first_name");

			const { data, error, count } = await query;

			if (error) {
				throw error;
			}

			return {
				students: data || [],
				total: count || 0,
				page,
				totalPages: Math.ceil((count || 0) / limit),
			};
		} catch (error) {
			console.error("Error fetching students:", error);
			throw new Error(handleApiError(error));
		}
	}

	/**
	 * Get a specific student by ID
	 */
	async getStudentById(id: string): Promise<Student | null> {
		try {
			const { data, error } = await supabase
				.from(this.tableName)
				.select("*")
				.eq("id", id)
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					return null; // Student not found
				}
				throw error;
			}

			return data;
		} catch (error) {
			console.error("Error fetching student:", error);
			throw new Error(handleApiError(error));
		}
	}

	/**
	 * Create a new student
	 */
	async createStudent(studentData: CreateStudentRequest): Promise<Student> {
		try {
			// First create user in Supabase Auth
			const { data: authData, error: authError } =
				await supabase.auth.admin.createUser({
					email: studentData.email,
					password: studentData.password,
					email_confirm: true,
					user_metadata: {
						first_name: studentData.first_name,
						last_name: studentData.last_name,
						role: "student",
					},
				});

			if (authError) {
				throw authError;
			}

			if (!authData.user) {
				throw new Error("Failed to create user account");
			}

			// Create student profile
			const { data, error } = await supabase
				.from(this.tableName)
				.insert({
					user_id: authData.user.id,
					first_name: studentData.first_name,
					last_name: studentData.last_name,
					middle_name: studentData.middle_name,
					class_id: studentData.class_id,
					section_id: studentData.section_id,
					roll_number: studentData.roll_number,
					date_of_birth: studentData.date_of_birth,
					gender: studentData.gender,
					phone_number: studentData.phone_number,
					address: studentData.address,
					parent_id: studentData.parent_id,
					status: "active",
				})
				.select()
				.single();

			if (error) {
				// If student creation fails, clean up the auth user
				await supabase.auth.admin.deleteUser(authData.user.id);
				throw error;
			}

			return data;
		} catch (error) {
			console.error("Error creating student:", error);
			throw new Error(handleApiError(error));
		}
	}

	/**
	 * Update a student
	 */
	async updateStudent(
		id: string,
		updates: UpdateStudentRequest
	): Promise<Student> {
		try {
			const { data, error } = await supabase
				.from(this.tableName)
				.update({
					...updates,
					updated_at: new Date().toISOString(),
				})
				.eq("id", id)
				.select()
				.single();

			if (error) {
				throw error;
			}

			return data;
		} catch (error) {
			console.error("Error updating student:", error);
			throw new Error(handleApiError(error));
		}
	}

	/**
	 * Delete a student (soft delete)
	 */
	async deleteStudent(id: string): Promise<void> {
		try {
			const { error } = await supabase
				.from(this.tableName)
				.update({
					status: "inactive",
					updated_at: new Date().toISOString(),
				})
				.eq("id", id);

			if (error) {
				throw error;
			}
		} catch (error) {
			console.error("Error deleting student:", error);
			throw new Error(handleApiError(error));
		}
	}

	/**
	 * Get students by class
	 */
	async getStudentsByClass(classId: string): Promise<Student[]> {
		try {
			const { data, error } = await supabase
				.from(this.tableName)
				.select("*")
				.eq("class_id", classId)
				.eq("status", "active")
				.order("roll_number");

			if (error) {
				throw error;
			}

			return data || [];
		} catch (error) {
			console.error("Error fetching students by class:", error);
			throw new Error(handleApiError(error));
		}
	}

	/**
	 * Get students by parent
	 */
	async getStudentsByParent(parentId: string): Promise<Student[]> {
		try {
			const { data, error } = await supabase
				.from(this.tableName)
				.select("*")
				.eq("parent_id", parentId)
				.eq("status", "active")
				.order("first_name");

			if (error) {
				throw error;
			}

			return data || [];
		} catch (error) {
			console.error("Error fetching students by parent:", error);
			throw new Error(handleApiError(error));
		}
	}

	/**
	 * Bulk update students
	 */
	async bulkUpdateStudents(
		updates: Array<{ id: string; updates: UpdateStudentRequest }>
	): Promise<Student[]> {
		try {
			const promises = updates.map(({ id, updates: studentUpdates }) =>
				this.updateStudent(id, studentUpdates)
			);

			return Promise.all(promises);
		} catch (error) {
			console.error("Error bulk updating students:", error);
			throw new Error(handleApiError(error));
		}
	}
}

export const studentService = new StudentService();
