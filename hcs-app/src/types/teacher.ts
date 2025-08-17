export const QUALIFICATION_OPTIONS = [
	{ value: "diploma", label: "Diploma" },
	{ value: "bachelor", label: "Bachelor's Degree" },
	{ value: "master", label: "Master's Degree" },
	{ value: "phd", label: "PhD" },
] as const;

export type QualificationType = "diploma" | "bachelor" | "master" | "phd";

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
