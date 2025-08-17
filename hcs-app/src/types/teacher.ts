export const QUALIFICATION_OPTIONS = [
	{ value: "B.Ed", label: "Bachelor of Education" },
	{ value: "M.Ed", label: "Master of Education" },
	{ value: "B.A", label: "Bachelor of Arts" },
	{ value: "M.A", label: "Master of Arts" },
	{ value: "B.Sc", label: "Bachelor of Science" },
	{ value: "M.Sc", label: "Master of Science" },
	{ value: "B.Com", label: "Bachelor of Commerce" },
	{ value: "M.Com", label: "Master of Commerce" },
	{ value: "B.Tech", label: "Bachelor of Technology" },
	{ value: "M.Tech", label: "Master of Technology" },
	{ value: "Ph.D", label: "Doctor of Philosophy" },
	{ value: "Diploma", label: "Diploma" },
	{ value: "Other", label: "Other" },
] as const;

export type QualificationType =
	| "B.Ed"
	| "M.Ed"
	| "B.A"
	| "M.A"
	| "B.Sc"
	| "M.Sc"
	| "B.Com"
	| "M.Com"
	| "B.Tech"
	| "M.Tech"
	| "Ph.D"
	| "Diploma"
	| "Other";

export interface Teacher {
	id: string;
	userId: string;
	teacherId: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	address?: string;
	dateOfBirth?: string;
	joiningDate: string;
	qualification: QualificationType;
	experience?: string;
	subjects: string[];
	department?: string;
	designation?: string;
	salary?: string;
	emergencyContact?: string;
	bloodGroup?: string;
	status: "active" | "inactive" | "on_leave";
	attendancePercentage?: number;
	performanceRating?: "excellent" | "good" | "average" | "needs_improvement";
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTeacherRequest {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	address?: string;
	dateOfBirth?: string;
	joiningDate: string;
	qualification: QualificationType;
	experience: number;
	subjects: string[];
	department: string;
	designation?: string;
	salary?: number;
	emergencyContact?: string;
	bloodGroup?: string;
	// Add credential field
	teacherPassword?: string;
}

export interface UpdateTeacherRequest {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	address?: string;
	dateOfBirth?: string;
	qualification?: QualificationType;
	experience?: number;
	subjects?: string[];
	department?: string;
	designation?: string;
	salary?: number;
	emergencyContact?: string;
	bloodGroup?: string;
	status?: "active" | "inactive" | "on_leave";
	attendancePercentage?: number;
	performanceRating?: "excellent" | "good" | "average" | "needs_improvement";
	isActive?: boolean;
}

export interface TeacherSearchParams {
	page?: number;
	limit?: number;
	search?: string;
	department?: string;
	subjects?: string[];
	qualification?: string;
	experience?: string;
	status?: "active" | "inactive";
	performanceRating?: "excellent" | "good" | "average" | "needs_improvement";
}

export interface TeacherListResponse {
	success: boolean;
	data: Teacher[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	total: number;
}

export interface TeacherResponse {
	success: boolean;
	data: Teacher;
	message?: string;
}

export interface TeacherStatsResponse {
	success: boolean;
	data: {
		total: number;
		active: number;
		newHires: number;
		byDepartment: Record<string, number>;
	};
}

export interface BulkUpdateTeachersRequest {
	teacherIds: string[];
	updates: UpdateTeacherRequest;
}

export interface BulkUpdateResponse {
	success: boolean;
	message: string;
}

export interface Department {
	id: string;
	name: string;
	description?: string;
	isActive: boolean;
}

export interface Subject {
	id: string;
	name: string;
	code: string;
	department: string;
	isActive: boolean;
}

export interface DepartmentListResponse {
	success: boolean;
	data: Department[];
}

export interface SubjectListResponse {
	success: boolean;
	data: Subject[];
}

// Form validation types
export interface TeacherFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	dateOfBirth: string;
	joiningDate: string;
	qualification: QualificationType | "";
	experience: string;
	subjects: string[];
	department: string;
	designation: string;
	salary: string;
	emergencyContact: string;
	bloodGroup: string;
	teacherPassword: string;
}

export interface TeacherFormErrors {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	address?: string;
	dateOfBirth?: string;
	joiningDate?: string;
	qualification?: string;
	experience?: string;
	subjects?: string;
	department?: string;
	designation?: string;
	salary?: string;
	emergencyContact?: string;
	bloodGroup?: string;
	teacherPassword?: string;
	general?: string;
}

// Blood group options
export const BLOOD_GROUPS = [
	"A+",
	"A-",
	"B+",
	"B-",
	"AB+",
	"AB-",
	"O+",
	"O-",
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

// Performance rating options
export const PERFORMANCE_RATINGS = [
	{ value: "excellent", label: "Excellent" },
	{ value: "good", label: "Good" },
	{ value: "average", label: "Average" },
	{ value: "needs_improvement", label: "Needs Improvement" },
] as const;

// Status options
export const TEACHER_STATUS_OPTIONS = [
	{ value: "active", label: "Active" },
	{ value: "inactive", label: "Inactive" },
	{ value: "on_leave", label: "On Leave" },
] as const;

// Common subjects list (can be expanded)
export const COMMON_SUBJECTS = [
	"Mathematics",
	"Physics",
	"Chemistry",
	"Biology",
	"English",
	"Hindi",
	"Social Studies",
	"History",
	"Geography",
	"Computer Science",
	"Physical Education",
	"Art",
	"Music",
	"Economics",
	"Political Science",
	"Psychology",
	"Sanskrit",
	"French",
	"Spanish",
] as const;

// Common departments list
export const COMMON_DEPARTMENTS = [
	"Science",
	"Mathematics",
	"English",
	"Social Studies",
	"Languages",
	"Physical Education",
	"Arts",
	"Computer Science",
	"Administration",
] as const;
