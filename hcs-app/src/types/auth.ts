// Frontend types that match backend API responses
export interface User {
	id: string;
	email: string;
	role:
		| "admin"
		| "coordinator"
		| "teacher"
		| "student"
		| "parent"
		| "librarian"
		| "media_coordinator";
	status: "active" | "inactive" | "suspended" | "pending_verification";
	email_verified: boolean;
	email_verified_at: string | null;
	last_login_at: string | null;
	created_at: string;
	updated_at: string;
}

export interface Profile {
	id: string;
	user_id: string;
	first_name: string;
	last_name: string;
	middle_name?: string;
	date_of_birth?: string;
	gender?: string;
	phone_number?: string;
	phone_verified: boolean;
	address_line1?: string;
	address_line2?: string;
	city?: string;
	state?: string;
	postal_code?: string;
	country?: string;
	emergency_contact_name?: string;
	emergency_contact_phone?: string;
	emergency_contact_relation?: string;
	avatar_url?: string;
	bio?: string;
	nationality?: string;
	blood_group?: string;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
	expiresAt: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	role: User["role"];
	firstName: string;
	lastName: string;
	middleName?: string;
}

export interface LoginResponse {
	success: true;
	message: string;
	data: {
		user: User;
		accessToken: string;
		refreshToken: string;
		expiresAt: string;
	};
}

export interface RegisterResponse {
	success: true;
	message: string;
	data: {
		user: User;
		accessToken: string;
		refreshToken: string;
		expiresAt: string;
	};
}

export interface ApiError {
	success: false;
	error: string;
	message: string;
	details?: Record<string, unknown> | string | null;
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	message?: string;
	data?: T;
	error?: string;
	details?: Record<string, unknown> | string | null;
}

export interface UserWithProfile extends User {
	profile?: Profile;
}
