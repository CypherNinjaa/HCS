import { apiClient } from "@/lib/api-client";
import {
	Student,
	CreateStudentRequest,
	UpdateStudentRequest,
	StudentSearchParams,
	StudentListResponse,
	StudentResponse,
	StudentStatsResponse,
	ClassListResponse,
} from "@/types/student";
import { ApiResponse } from "@/types/auth";

export class StudentService {
	private readonly baseEndpoint = "/v1/students";

	/**
	 * Get dashboard statistics
	 */
	async getDashboardStats(): Promise<StudentStatsResponse> {
		return apiClient.authenticatedRequest<StudentStatsResponse>(
			`${this.baseEndpoint}/dashboard/stats`
		);
	}

	/**
	 * Get all students with pagination and filtering
	 */
	async getStudents(
		params: StudentSearchParams = {}
	): Promise<StudentListResponse> {
		const searchParams = new URLSearchParams();

		// Add parameters to search params
		if (params.page) searchParams.append("page", params.page.toString());
		if (params.limit) searchParams.append("limit", params.limit.toString());
		if (params.search) searchParams.append("search", params.search);
		if (params.classId) searchParams.append("classId", params.classId);
		if (params.grade) searchParams.append("grade", params.grade.toString());
		if (params.section) searchParams.append("section", params.section);
		if (params.feeStatus) searchParams.append("feeStatus", params.feeStatus);
		if (params.performanceGrade)
			searchParams.append("performanceGrade", params.performanceGrade);
		if (params.isActive !== undefined)
			searchParams.append("isActive", params.isActive.toString());

		const queryString = searchParams.toString();
		const endpoint = queryString
			? `${this.baseEndpoint}?${queryString}`
			: this.baseEndpoint;

		return apiClient.authenticatedRequest<StudentListResponse>(endpoint);
	}

	/**
	 * Get a specific student by ID
	 */
	async getStudent(id: string): Promise<StudentResponse> {
		return apiClient.authenticatedRequest<StudentResponse>(
			`${this.baseEndpoint}/${id}`
		);
	}

	/**
	 * Create a new student
	 */
	async createStudent(data: CreateStudentRequest): Promise<StudentResponse> {
		return apiClient.authenticatedRequest<StudentResponse>(this.baseEndpoint, {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	/**
	 * Update an existing student
	 */
	async updateStudent(
		id: string,
		data: UpdateStudentRequest
	): Promise<StudentResponse> {
		return apiClient.authenticatedRequest<StudentResponse>(
			`${this.baseEndpoint}/${id}`,
			{
				method: "PUT",
				body: JSON.stringify(data),
			}
		);
	}

	/**
	 * Delete a student (soft delete)
	 */
	async deleteStudent(id: string): Promise<ApiResponse<null>> {
		return apiClient.authenticatedRequest<ApiResponse<null>>(
			`${this.baseEndpoint}/${id}`,
			{
				method: "DELETE",
			}
		);
	}

	/**
	 * Bulk operations on students
	 */
	async bulkUpdateStudents(
		studentIds: string[],
		action: "activate" | "deactivate" | "promote" | "demote",
		data?: Record<string, unknown>
	): Promise<ApiResponse<null>> {
		return apiClient.authenticatedRequest<ApiResponse<null>>(
			`${this.baseEndpoint}/bulk`,
			{
				method: "PATCH",
				body: JSON.stringify({
					studentIds,
					action,
					...data,
				}),
			}
		);
	}

	/**
	 * Export students data
	 */
	async exportStudents(params: StudentSearchParams = {}): Promise<Blob> {
		const searchParams = new URLSearchParams();

		// Add parameters to search params
		if (params.search) searchParams.append("search", params.search);
		if (params.classId) searchParams.append("classId", params.classId);
		if (params.grade) searchParams.append("grade", params.grade.toString());
		if (params.section) searchParams.append("section", params.section);
		if (params.feeStatus) searchParams.append("feeStatus", params.feeStatus);
		if (params.performanceGrade)
			searchParams.append("performanceGrade", params.performanceGrade);
		if (params.isActive !== undefined)
			searchParams.append("isActive", params.isActive.toString());

		const queryString = searchParams.toString();
		const endpoint = queryString
			? `${this.baseEndpoint}/export?${queryString}`
			: `${this.baseEndpoint}/export`;

		const response = await apiClient.authenticatedRequest<Response>(endpoint, {
			headers: {
				Accept: "text/csv",
			},
		});

		return response.blob();
	}

	/**
	 * Get available classes for student assignment
	 */
	async getClasses(): Promise<ClassListResponse> {
		return apiClient.authenticatedRequest<ClassListResponse>("/v1/classes");
	}
}

// Create singleton instance
export const studentService = new StudentService();

// Helper functions for formatting
export const formatStudentName = (student: Student): string => {
	return `${student.firstName} ${student.lastName}`;
};

export const formatClassName = (student: Student): string => {
	return `Class ${student.grade}-${student.section}`;
};

export const formatFeeStatus = (status: string): string => {
	switch (status) {
		case "PAID":
			return "Paid";
		case "PENDING":
			return "Pending";
		case "OVERDUE":
			return "Overdue";
		default:
			return status;
	}
};

export const formatPerformanceGrade = (grade: string): string => {
	switch (grade) {
		case "EXCELLENT":
			return "Excellent";
		case "GOOD":
			return "Good";
		case "AVERAGE":
			return "Average";
		case "NEEDS_IMPROVEMENT":
			return "Needs Improvement";
		default:
			return grade;
	}
};

export const getStatusColor = (status: boolean): string => {
	return status
		? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
		: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
};

export const getFeeStatusColor = (status: string): string => {
	switch (status) {
		case "PAID":
			return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300";
		case "PENDING":
			return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
		case "OVERDUE":
			return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
		default:
			return "bg-muted text-muted-foreground";
	}
};

export const getPerformanceColor = (performance: string): string => {
	switch (performance) {
		case "EXCELLENT":
			return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300";
		case "GOOD":
			return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
		case "AVERAGE":
			return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
		case "NEEDS_IMPROVEMENT":
			return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
		default:
			return "bg-muted text-muted-foreground";
	}
};
