export type UserRole =
	| "admin"
	| "coordinator"
	| "teacher"
	| "student"
	| "parent"
	| "librarian"
	| "media_coordinator";
export type UserStatus =
	| "active"
	| "inactive"
	| "suspended"
	| "pending_verification";
export type AuditAction =
	| "create"
	| "read"
	| "update"
	| "delete"
	| "login"
	| "logout"
	| "login_failed"
	| "password_change"
	| "password_reset"
	| "email_verify"
	| "account_lock"
	| "account_unlock"
	| "role_change"
	| "permission_grant"
	| "permission_revoke"
	| "data_export"
	| "data_import"
	| "file_upload"
	| "file_download"
	| "file_delete"
	| "payment_process"
	| "fee_collect"
	| "grade_submit"
	| "attendance_mark"
	| "exam_create"
	| "exam_submit"
	| "announcement_post"
	| "message_send";

export interface User {
	id: string;
	email: string;
	password_hash: string;
	role: UserRole;
	status: UserStatus;
	email_verified: boolean;
	email_verified_at?: Date;
	last_login_at?: Date;
	last_login_ip?: string;
	password_changed_at: Date;
	failed_login_attempts: number;
	locked_until?: Date;
	created_at: Date;
	updated_at: Date;
	deleted_at?: Date;
}

export interface Profile {
	id: string;
	user_id: string;
	first_name: string;
	last_name: string;
	middle_name?: string;
	date_of_birth?: Date;
	gender?: string;
	phone_number?: string;
	phone_verified: boolean;
	address_line1?: string;
	address_line2?: string;
	city?: string;
	state?: string;
	postal_code?: string;
	country: string;
	emergency_contact_name?: string;
	emergency_contact_phone?: string;
	emergency_contact_relation?: string;
	avatar_url?: string;
	bio?: string;
	nationality?: string;
	blood_group?: string;
	created_at: Date;
	updated_at: Date;
	deleted_at?: Date;
}

export interface AuditLog {
	id: string;
	actor_id?: string;
	action: AuditAction;
	entity_type: string;
	entity_id?: string;
	entity_name?: string;
	old_values?: Record<string, any>;
	new_values?: Record<string, any>;
	metadata?: Record<string, any>;
	ip_address?: string;
	user_agent?: string;
	session_id?: string;
	risk_score: number;
	success: boolean;
	error_message?: string;
	execution_time_ms?: number;
	created_at: Date;
}

export interface Session {
	id: string;
	user_id: string;
	token_hash: string;
	refresh_token_hash?: string;
	device_info?: Record<string, any>;
	ip_address?: string;
	user_agent?: string;
	is_active: boolean;
	expires_at: Date;
	refresh_expires_at?: Date;
	last_activity_at: Date;
	created_at: Date;
	revoked_at?: Date;
	revoked_by?: string;
	revoke_reason?: string;
}

export interface CreateUserData {
	email: string;
	password_hash: string;
	role: UserRole;
	status?: UserStatus;
}

export interface UpdateUserData {
	email?: string;
	password_hash?: string;
	role?: UserRole;
	status?: UserStatus;
	email_verified?: boolean;
	email_verified_at?: Date;
	last_login_at?: Date;
	last_login_ip?: string;
	failed_login_attempts?: number;
	locked_until?: Date;
}

export interface CreateProfileData {
	user_id: string;
	first_name: string;
	last_name: string;
	middle_name?: string;
	date_of_birth?: Date;
	gender?: string;
	phone_number?: string;
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

export interface UpdateProfileData {
	first_name?: string;
	last_name?: string;
	middle_name?: string;
	date_of_birth?: Date;
	gender?: string;
	phone_number?: string;
	phone_verified?: boolean;
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

export interface CreateAuditLogData {
	actor_id?: string;
	action: AuditAction;
	entity_type: string;
	entity_id?: string;
	entity_name?: string;
	old_values?: Record<string, any>;
	new_values?: Record<string, any>;
	metadata?: Record<string, any>;
	ip_address?: string;
	user_agent?: string;
	session_id?: string;
	risk_score?: number;
	success?: boolean;
	error_message?: string;
	execution_time_ms?: number;
}

export interface CreateSessionData {
	user_id: string;
	token_hash: string;
	refresh_token_hash?: string;
	device_info?: Record<string, any>;
	ip_address?: string;
	user_agent?: string;
	expires_at: Date;
	refresh_expires_at?: Date;
}

export interface PaginationOptions {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "ASC" | "DESC";
}

export interface PaginationResult<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}
