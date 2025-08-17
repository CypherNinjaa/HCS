/**
 * Teacher Service - Supabase Implementation
 * Handles all teacher-related database operations
 */

import { supabase } from "@/lib/supabase";
import { handleApiError } from "@/lib/error-handler";

export interface Teacher {
	id: string;
	user_id: string;
	first_name: string;
	last_name: string;
	middle_name?: string;
	employee_id?: string;
	department?: string;
	designation?: string;
	subject_specialization?: string[];
	date_of_birth?: string;
	gender?: string;
	phone_number?: string;
	address?: string;
	qualification?: string;
	experience_years?: number;
	joining_date?: string;
	status: "active" | "inactive" | "on_leave" | "terminated";
	created_at: string;
	updated_at: string;
}

export interface CreateTeacherRequest {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	middle_name?: string;
	employee_id?: string;
	department?: string;
	designation?: string;
	subject_specialization?: string[];
	date_of_birth?: string;
	gender?: string;
	phone_number?: string;
	address?: string;
	qualification?: string;
	experience_years?: number;
	joining_date?: string;
}

export interface UpdateTeacherRequest {
	first_name?: string;
	last_name?: string;
	middle_name?: string;
	employee_id?: string;
	department?: string;
	designation?: string;
	subject_specialization?: string[];
	date_of_birth?: string;
	gender?: string;
	phone_number?: string;
	address?: string;
	qualification?: string;
	experience_years?: number;
	joining_date?: string;
	status?: "active" | "inactive" | "on_leave" | "terminated";
}

export interface TeacherFilters {
	search?: string;
	department?: string;
	designation?: string;
	status?: string;
	page?: number;
	limit?: number;
}

export interface TeachersResponse {
	teachers: Teacher[];
	total: number;
	page: number;
	totalPages: number;
}

class TeacherService {
	private readonly tableName = "teachers";

	/**
	 * Get all teachers with optional filtering and pagination
	 */
	async getTeachers(filters: TeacherFilters = {}): Promise<TeachersResponse> {
		try {
			const {
				search,
				department,
				designation,
				status = "active",
				page = 1,
				limit = 20,
			} = filters;

			let query = supabase.from(this.tableName).select("*", { count: "exact" });

			// Apply filters
			if (search) {
				query = query.or(
					`first_name.ilike.%${search}%,last_name.ilike.%${search}%,employee_id.ilike.%${search}%`
				);
			}

			if (department) {
				query = query.eq("department", department);
			}

			if (designation) {
				query = query.eq("designation", designation);
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
				teachers: data || [],
				total: count || 0,
				page,
				totalPages: Math.ceil((count || 0) / limit),
			};
		} catch (error) {
			console.error("Error fetching teachers:", error);
			throw new Error(handleApiError(error));
		}
	}

	/**
	 * Get a specific teacher by ID
	 */
	async getTeacherById(id: string): Promise<Teacher | null> {
		try {
			const { data, error } = await supabase
				.from(this.tableName)
				.select("*")
				.eq("id", id)
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					return null; // Teacher not found
				}
				throw error;
			}

			return data;
		} catch (error) {
			console.error("Error fetching teacher:", error);
			throw new Error(handleApiError(error));
		}
	}

	/**
	 * Create a new teacher
	 */
	async createTeacher(teacherData: CreateTeacherRequest): Promise<Teacher> {
		try {
			// First create user in Supabase Auth
			const { data: authData, error: authError } =
				await supabase.auth.admin.createUser({
					email: teacherData.email,
					password: teacherData.password,
					email_confirm: true,
					user_metadata: {
						first_name: teacherData.first_name,
						last_name: teacherData.last_name,
						role: "teacher",
					},
				});

			if (authError) {
				throw authError;
			}

			if (!authData.user) {
				throw new Error("Failed to create user account");
			}

			// Create teacher profile
			const { data, error } = await supabase
				.from(this.tableName)
				.insert({
					user_id: authData.user.id,
					first_name: teacherData.first_name,
					last_name: teacherData.last_name,
					middle_name: teacherData.middle_name,
					employee_id: teacherData.employee_id,
					department: teacherData.department,
					designation: teacherData.designation,
					subject_specialization: teacherData.subject_specialization,
					date_of_birth: teacherData.date_of_birth,
					gender: teacherData.gender,
					phone_number: teacherData.phone_number,
					address: teacherData.address,
					qualification: teacherData.qualification,
					experience_years: teacherData.experience_years,
					joining_date: teacherData.joining_date,
					status: "active",
				})
				.select()
				.single();

			if (error) {
				// If teacher creation fails, clean up the auth user
				await supabase.auth.admin.deleteUser(authData.user.id);
				throw error;
			}

			return data;
		} catch (error) {
			console.error("Error creating teacher:", error);
			throw new Error(handleApiError(error));
		}
	}

	/**
	 * Update a teacher
	 */
	async updateTeacher(
		id: string,
		updates: UpdateTeacherRequest
	): Promise<Teacher> {
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
			console.error("Error updating teacher:", error);
			throw new Error(handleApiError(error));
		}
	}

	/**
	 * Delete a teacher (soft delete)
	 */
	async deleteTeacher(id: string): Promise<void> {
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
			console.error("Error deleting teacher:", error);
			throw new Error(handleApiError(error));
		}
	}

	/**
	 * Get teachers by department
	 */
	async getTeachersByDepartment(department: string): Promise<Teacher[]> {
		try {
			const { data, error } = await supabase
				.from(this.tableName)
				.select("*")
				.eq("department", department)
				.eq("status", "active")
				.order("first_name");

			if (error) {
				throw error;
			}

			return data || [];
		} catch (error) {
			console.error("Error fetching teachers by department:", error);
			throw new Error(handleApiError(error));
		}
	}

	/**
	 * Get teachers by subject specialization
	 */
	async getTeachersBySubject(subject: string): Promise<Teacher[]> {
		try {
			const { data, error } = await supabase
				.from(this.tableName)
				.select("*")
				.contains("subject_specialization", [subject])
				.eq("status", "active")
				.order("first_name");

			if (error) {
				throw error;
			}

			return data || [];
		} catch (error) {
			console.error("Error fetching teachers by subject:", error);
			throw new Error(handleApiError(error));
		}
	}

	/**
	 * Bulk update teachers
	 */
	async bulkUpdateTeachers(
		updates: Array<{ id: string; updates: UpdateTeacherRequest }>
	): Promise<Teacher[]> {
		try {
			const promises = updates.map(({ id, updates: teacherUpdates }) =>
				this.updateTeacher(id, teacherUpdates)
			);

			return Promise.all(promises);
		} catch (error) {
			console.error("Error bulk updating teachers:", error);
			throw new Error(handleApiError(error));
		}
	}

	/**
	 * Get teacher statistics
	 */
	async getTeacherStats(): Promise<{
		total: number;
		active: number;
		inactive: number;
		onLeave: number;
		byDepartment: Record<string, number>;
	}> {
		try {
			const { data, error } = await supabase
				.from(this.tableName)
				.select("status, department");

			if (error) {
				throw error;
			}

			const stats = {
				total: data?.length || 0,
				active: 0,
				inactive: 0,
				onLeave: 0,
				byDepartment: {} as Record<string, number>,
			};

			data?.forEach((teacher) => {
				switch (teacher.status) {
					case "active":
						stats.active++;
						break;
					case "inactive":
						stats.inactive++;
						break;
					case "on_leave":
						stats.onLeave++;
						break;
				}

				if (teacher.department) {
					stats.byDepartment[teacher.department] =
						(stats.byDepartment[teacher.department] || 0) + 1;
				}
			});

			return stats;
		} catch (error) {
			console.error("Error fetching teacher stats:", error);
			throw new Error(handleApiError(error));
		}
	}
}

export const teacherService = new TeacherService();
