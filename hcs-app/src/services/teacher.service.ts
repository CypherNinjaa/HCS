import { apiClient } from "@/lib/api-client";
import {
	Teacher,
	CreateTeacherRequest,
	UpdateTeacherRequest,
	TeacherSearchParams,
	TeacherListResponse,
	TeacherResponse,
	TeacherStatsResponse,
	BulkUpdateTeachersRequest,
	BulkUpdateResponse,
	DepartmentListResponse,
	SubjectListResponse,
	TeacherFormData,
	QualificationType,
} from "@/types/teacher";
import { ApiResponse } from "@/types/auth";

export class TeacherService {
	private readonly baseEndpoint = "/v1/teachers";

	/**
	 * Get dashboard statistics
	 */
	async getDashboardStats(): Promise<TeacherStatsResponse> {
		return apiClient.authenticatedRequest<TeacherStatsResponse>(
			`${this.baseEndpoint}/dashboard/stats`
		);
	}

	/**
	 * Get all teachers with pagination and filtering
	 */
	async getTeachers(
		params: TeacherSearchParams = {}
	): Promise<TeacherListResponse> {
		const searchParams = new URLSearchParams();

		// Add parameters to search params
		if (params.page) searchParams.append("page", params.page.toString());
		if (params.limit) searchParams.append("limit", params.limit.toString());
		if (params.search) searchParams.append("search", params.search);
		if (params.department) searchParams.append("department", params.department);
		if (params.subjects && params.subjects.length > 0)
			searchParams.append("subjects", params.subjects.join(","));
		if (params.qualification)
			searchParams.append("qualification", params.qualification);
		if (params.experience) searchParams.append("experience", params.experience);
		if (params.status) searchParams.append("status", params.status);
		if (params.performanceRating)
			searchParams.append("performanceRating", params.performanceRating);

		const queryString = searchParams.toString();
		const endpoint = queryString
			? `${this.baseEndpoint}?${queryString}`
			: this.baseEndpoint;

		return apiClient.authenticatedRequest<TeacherListResponse>(endpoint);
	}

	/**
	 * Get a specific teacher by ID
	 */
	async getTeacher(id: string): Promise<TeacherResponse> {
		return apiClient.authenticatedRequest<TeacherResponse>(
			`${this.baseEndpoint}/${id}`
		);
	}

	/**
	 * Get teacher by teacher ID (TCH0001)
	 */
	async getTeacherByTeacherId(teacherId: string): Promise<TeacherResponse> {
		return apiClient.authenticatedRequest<TeacherResponse>(
			`${this.baseEndpoint}/teacher-id/${teacherId}`
		);
	}

	/**
	 * Get teacher by email
	 */
	async getTeacherByEmail(email: string): Promise<TeacherResponse> {
		return apiClient.authenticatedRequest<TeacherResponse>(
			`${this.baseEndpoint}/email/${email}`
		);
	}

	/**
	 * Get teachers by department
	 */
	async getTeachersByDepartment(
		department: string
	): Promise<TeacherListResponse> {
		return apiClient.authenticatedRequest<TeacherListResponse>(
			`${this.baseEndpoint}/department/${department}`
		);
	}

	/**
	 * Get teachers by subject
	 */
	async getTeachersBySubject(subject: string): Promise<TeacherListResponse> {
		return apiClient.authenticatedRequest<TeacherListResponse>(
			`${this.baseEndpoint}/subject/${subject}`
		);
	}

	/**
	 * Create a new teacher
	 */
	async createTeacher(data: CreateTeacherRequest): Promise<TeacherResponse> {
		return apiClient.authenticatedRequest<TeacherResponse>(this.baseEndpoint, {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	/**
	 * Update an existing teacher
	 */
	async updateTeacher(
		id: string,
		data: UpdateTeacherRequest
	): Promise<TeacherResponse> {
		return apiClient.authenticatedRequest<TeacherResponse>(
			`${this.baseEndpoint}/${id}`,
			{
				method: "PUT",
				body: JSON.stringify(data),
			}
		);
	}

	/**
	 * Delete a teacher (soft delete)
	 */
	async deleteTeacher(id: string): Promise<ApiResponse<null>> {
		return apiClient.authenticatedRequest<ApiResponse<null>>(
			`${this.baseEndpoint}/${id}`,
			{
				method: "DELETE",
			}
		);
	}

	/**
	 * Bulk update teachers
	 */
	async bulkUpdateTeachers(
		data: BulkUpdateTeachersRequest
	): Promise<BulkUpdateResponse> {
		return apiClient.authenticatedRequest<BulkUpdateResponse>(
			`${this.baseEndpoint}/bulk`,
			{
				method: "PATCH",
				body: JSON.stringify(data),
			}
		);
	}

	/**
	 * Export teachers data
	 */
	async exportTeachers(params: TeacherSearchParams = {}): Promise<Blob> {
		const searchParams = new URLSearchParams();

		// Add parameters to search params
		if (params.search) searchParams.append("search", params.search);
		if (params.department) searchParams.append("department", params.department);
		if (params.subjects && params.subjects.length > 0)
			searchParams.append("subjects", params.subjects.join(","));
		if (params.qualification)
			searchParams.append("qualification", params.qualification);
		if (params.experience) searchParams.append("experience", params.experience);
		if (params.status) searchParams.append("status", params.status);
		if (params.performanceRating)
			searchParams.append("performanceRating", params.performanceRating);

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
	 * Get available departments
	 */
	async getDepartments(): Promise<DepartmentListResponse> {
		return apiClient.authenticatedRequest<DepartmentListResponse>(
			"/v1/departments"
		);
	}

	/**
	 * Get available subjects
	 */
	async getSubjects(): Promise<SubjectListResponse> {
		return apiClient.authenticatedRequest<SubjectListResponse>("/v1/subjects");
	}
}

// Create singleton instance
export const teacherService = new TeacherService();

// Helper functions for formatting
export const formatTeacherName = (teacher: Teacher): string => {
	return `${teacher.firstName} ${teacher.lastName}`;
};

export const formatTeacherSubjects = (subjects: string[]): string => {
	if (subjects.length === 0) return "No subjects assigned";
	if (subjects.length <= 2) return subjects.join(", ");
	return `${subjects.slice(0, 2).join(", ")} +${subjects.length - 2} more`;
};

export const formatTeacherExperience = (experience?: string): string => {
	if (!experience) return "Not specified";
	const years = parseInt(experience);
	if (isNaN(years)) return experience;
	return years === 1 ? "1 year" : `${years} years`;
};

export const formatSalary = (salary?: string): string => {
	if (!salary) return "Not specified";
	const amount = parseFloat(salary);
	if (isNaN(amount)) return salary;
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0,
	}).format(amount);
};

export const formatStatus = (status: string): string => {
	switch (status) {
		case "active":
			return "Active";
		case "inactive":
			return "Inactive";
		case "on_leave":
			return "On Leave";
		default:
			return status;
	}
};

export const formatPerformanceRating = (rating?: string): string => {
	if (!rating) return "Not rated";
	switch (rating) {
		case "excellent":
			return "Excellent";
		case "good":
			return "Good";
		case "average":
			return "Average";
		case "needs_improvement":
			return "Needs Improvement";
		default:
			return rating;
	}
};

export const getStatusColor = (status: string): string => {
	switch (status) {
		case "active":
			return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300";
		case "inactive":
			return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
		case "on_leave":
			return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
		default:
			return "bg-muted text-muted-foreground";
	}
};

export const getPerformanceColor = (rating?: string): string => {
	if (!rating) return "bg-muted text-muted-foreground";
	switch (rating) {
		case "excellent":
			return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300";
		case "good":
			return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
		case "average":
			return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
		case "needs_improvement":
			return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
		default:
			return "bg-muted text-muted-foreground";
	}
};

export const getActiveStatusColor = (isActive: boolean): string => {
	return isActive
		? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
		: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
};

// Validation helpers
export const validateTeacherData = (data: CreateTeacherRequest): string[] => {
	const errors: string[] = [];

	if (!data.firstName?.trim()) errors.push("First name is required");
	if (!data.lastName?.trim()) errors.push("Last name is required");
	if (!data.email?.trim()) errors.push("Email is required");
	if (!data.joiningDate) errors.push("Joining date is required");
	if (!data.qualification?.trim()) errors.push("Qualification is required");
	if (!data.department?.trim()) errors.push("Department is required");
	if (!data.subjects || data.subjects.length === 0)
		errors.push("At least one subject is required");

	// Email validation
	if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
		errors.push("Invalid email format");
	}

	// Experience validation
	if (data.experience && data.experience < 0) {
		errors.push("Experience cannot be negative");
	}

	// Salary validation
	if (data.salary && data.salary < 0) {
		errors.push("Salary cannot be negative");
	}

	return errors;
};

// Data transformation helpers
export const transformTeacherForApi = (
	formData: TeacherFormData
): CreateTeacherRequest => {
	return {
		firstName: formData.firstName?.trim(),
		lastName: formData.lastName?.trim(),
		email: formData.email?.trim().toLowerCase(),
		phone: formData.phone?.trim(),
		address: formData.address?.trim(),
		dateOfBirth: formData.dateOfBirth,
		joiningDate: formData.joiningDate,
		qualification: formData.qualification?.trim() as QualificationType,
		experience: formData.experience ? parseInt(formData.experience) : 0,
		subjects: formData.subjects || [],
		department: formData.department?.trim(),
		designation: formData.designation?.trim(),
		salary: formData.salary ? parseFloat(formData.salary) : undefined,
		emergencyContact: formData.emergencyContact?.trim(),
		bloodGroup: formData.bloodGroup,
		teacherPassword: formData.teacherPassword?.trim(),
	};
};
