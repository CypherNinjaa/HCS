export interface Student {
	id: string;
	userId: string;
	studentId: string;
	admissionNumber: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	dateOfBirth: string;
	classId: string;
	className: string;
	grade: number;
	section: string;
	rollNumber: string;
	admissionDate: string;
	bloodGroup?: string;
	medicalConditions?: string;
	feeStatus: "PAID" | "PENDING" | "OVERDUE";
	attendancePercentage: number;
	performanceGrade: "EXCELLENT" | "GOOD" | "AVERAGE" | "NEEDS_IMPROVEMENT";
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateStudentRequest {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	dateOfBirth: string;
	classId: string;
	rollNumber: string;
	admissionDate: string;
	bloodGroup?: string;
	medicalConditions?: string;
	parentName: string;
	parentPhone: string;
	parentEmail: string;
}

export interface UpdateStudentRequest {
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

export interface StudentSearchParams {
	page?: number;
	limit?: number;
	search?: string;
	classId?: string;
	grade?: number;
	section?: string;
	feeStatus?: "PAID" | "PENDING" | "OVERDUE";
	performanceGrade?: "EXCELLENT" | "GOOD" | "AVERAGE" | "NEEDS_IMPROVEMENT";
	isActive?: boolean;
}

export interface StudentListResponse {
	success: boolean;
	data: Student[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	total: number;
}

export interface StudentResponse {
	success: boolean;
	data: Student;
	message?: string;
}

export interface StudentStatsResponse {
	success: boolean;
	data: {
		total: number;
		active: number;
		newAdmissions: number;
		pendingFees: number;
	};
}

export interface Class {
	id: string;
	name: string;
	grade: number;
	section: string;
	academicYearId: string;
	maxStudents: number;
	currentStudents: number;
	isActive: boolean;
}

export interface ClassListResponse {
	success: boolean;
	data: Class[];
}
