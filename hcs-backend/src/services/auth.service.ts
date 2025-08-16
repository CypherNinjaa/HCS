import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
	userRepository,
	profileRepository,
	sessionRepository,
	auditLogRepository,
} from "../repositories";
import {
	User,
	UserRole,
	CreateUserData,
	CreateProfileData,
	CreateSessionData,
	CreateAuditLogData,
} from "../types/database";
import { env } from "../config/env";
import logger from "../utils/logger";

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterData {
	email: string;
	password: string;
	role: UserRole;
	firstName: string;
	lastName: string;
	middleName?: string;
	phoneNumber?: string;
}

export interface AuthResult {
	user: Omit<User, "password_hash">;
	accessToken: string;
	refreshToken?: string;
	expiresAt: Date;
}

export interface JWTPayload {
	userId: string;
	email: string;
	role: UserRole;
	sessionId: string;
	iat?: number;
	exp?: number;
}

export interface RefreshTokenPayload {
	userId: string;
	sessionId: string;
	type: "refresh";
	iat?: number;
	exp?: number;
}

export interface AuthContext {
	ipAddress?: string;
	userAgent?: string;
	deviceInfo?: Record<string, any>;
}

export class AuthService {
	private readonly saltRounds = 12;
	private readonly jwtSecret = env.JWT_SECRET;
	private readonly accessTokenExpiry = "15m"; // 15 minutes
	private readonly refreshTokenExpiry = "7d"; // 7 days

	/**
	 * Validate password strength
	 */
	private validatePassword(password: string): {
		isValid: boolean;
		errors: string[];
	} {
		const errors: string[] = [];

		if (password.length < 8) {
			errors.push("Password must be at least 8 characters long");
		}

		if (!/[A-Z]/.test(password)) {
			errors.push("Password must contain at least one uppercase letter");
		}

		if (!/[a-z]/.test(password)) {
			errors.push("Password must contain at least one lowercase letter");
		}

		if (!/\d/.test(password)) {
			errors.push("Password must contain at least one number");
		}

		if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
			errors.push("Password must contain at least one special character");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	/**
	 * Hash password using bcrypt
	 */
	private async hashPassword(password: string): Promise<string> {
		try {
			return await bcrypt.hash(password, this.saltRounds);
		} catch (error) {
			logger.error({ error }, "Failed to hash password");
			throw new Error("Password hashing failed");
		}
	}

	/**
	 * Verify password against hash
	 */
	private async verifyPassword(
		password: string,
		hash: string
	): Promise<boolean> {
		try {
			return await bcrypt.compare(password, hash);
		} catch (error) {
			logger.error({ error }, "Failed to verify password");
			throw new Error("Password verification failed");
		}
	}

	/**
	 * Generate JWT access token
	 */
	private generateAccessToken(payload: JWTPayload): string {
		return jwt.sign(payload, this.jwtSecret, {
			expiresIn: this.accessTokenExpiry,
			issuer: "hcs-backend",
			audience: "hcs-frontend",
		});
	}

	/**
	 * Generate JWT refresh token
	 */
	private generateRefreshToken(payload: RefreshTokenPayload): string {
		return jwt.sign(payload, this.jwtSecret, {
			expiresIn: this.refreshTokenExpiry,
			issuer: "hcs-backend",
			audience: "hcs-frontend",
		});
	}

	/**
	 * Verify JWT token
	 */
	private verifyToken<T = JWTPayload>(token: string): T {
		try {
			return jwt.verify(token, this.jwtSecret, {
				issuer: "hcs-backend",
				audience: "hcs-frontend",
			}) as T;
		} catch (error) {
			logger.error({ error }, "JWT verification failed");
			throw new Error("Invalid token");
		}
	}

	/**
	 * Generate token hash for storage
	 */
	private generateTokenHash(token: string): string {
		return crypto.createHash("sha256").update(token).digest("hex");
	}

	/**
	 * Calculate token expiration date
	 */
	private getTokenExpirationDate(expiryString: string): Date {
		const now = new Date();
		const match = expiryString.match(/^(\d+)([mhd])$/);

		if (!match) {
			throw new Error("Invalid expiry format");
		}

		const value = parseInt(match[1]);
		const unit = match[2];

		switch (unit) {
			case "m":
				return new Date(now.getTime() + value * 60 * 1000);
			case "h":
				return new Date(now.getTime() + value * 60 * 60 * 1000);
			case "d":
				return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
			default:
				throw new Error("Invalid time unit");
		}
	}

	/**
	 * Log authentication event
	 */
	private async logAuthEvent(
		auditData: Omit<CreateAuditLogData, "entity_type">,
		context?: AuthContext
	): Promise<void> {
		try {
			await auditLogRepository.create({
				...auditData,
				entity_type: "authentication",
				ip_address: context?.ipAddress,
				user_agent: context?.userAgent,
				metadata: {
					...auditData.metadata,
					device_info: context?.deviceInfo,
				},
			});
		} catch (error) {
			logger.error({ error }, "Failed to log auth event");
			// Don't throw - logging failure shouldn't break auth flow
		}
	}

	/**
	 * Register a new user
	 */
	async register(
		registerData: RegisterData,
		context?: AuthContext
	): Promise<AuthResult> {
		const startTime = Date.now();

		try {
			// Validate password strength
			const passwordValidation = this.validatePassword(registerData.password);
			if (!passwordValidation.isValid) {
				throw new Error(
					`Password validation failed: ${passwordValidation.errors.join(", ")}`
				);
			}

			// Check if email already exists
			const existingUser = await userRepository.findByEmail(registerData.email);
			if (existingUser) {
				throw new Error("Email already registered");
			}

			// Hash password
			const passwordHash = await this.hashPassword(registerData.password);

			// Create user
			const userData: CreateUserData = {
				email: registerData.email,
				password_hash: passwordHash,
				role: registerData.role,
				status: "pending_verification",
			};

			const user = await userRepository.create(userData);

			// Create profile
			const profileData: CreateProfileData = {
				user_id: user.id,
				first_name: registerData.firstName,
				last_name: registerData.lastName,
				middle_name: registerData.middleName,
				phone_number: registerData.phoneNumber,
			};

			await profileRepository.create(profileData);

			// Generate tokens
			const sessionId = crypto.randomUUID();
			const accessToken = this.generateAccessToken({
				userId: user.id,
				email: user.email,
				role: user.role,
				sessionId,
			});

			const refreshToken = this.generateRefreshToken({
				userId: user.id,
				sessionId,
				type: "refresh",
			});

			// Create session
			const sessionData: CreateSessionData = {
				user_id: user.id,
				token_hash: this.generateTokenHash(accessToken),
				refresh_token_hash: this.generateTokenHash(refreshToken),
				device_info: context?.deviceInfo,
				ip_address: context?.ipAddress,
				user_agent: context?.userAgent,
				expires_at: this.getTokenExpirationDate(this.accessTokenExpiry),
				refresh_expires_at: this.getTokenExpirationDate(
					this.refreshTokenExpiry
				),
			};

			await sessionRepository.create(sessionData);

			// Log successful registration
			await this.logAuthEvent(
				{
					actor_id: user.id,
					action: "create",
					entity_id: user.id,
					entity_name: `${registerData.firstName} ${registerData.lastName}`,
					new_values: {
						email: user.email,
						role: user.role,
						status: user.status,
					},
					success: true,
					execution_time_ms: Date.now() - startTime,
				},
				context
			);

			// Return user without password hash
			const { password_hash, ...userWithoutPassword } = user;

			return {
				user: userWithoutPassword,
				accessToken,
				refreshToken,
				expiresAt: sessionData.expires_at,
			};
		} catch (error) {
			// Log failed registration
			await this.logAuthEvent(
				{
					action: "create",
					entity_name: registerData.email,
					metadata: {
						email: registerData.email,
						role: registerData.role,
					},
					success: false,
					error_message: (error as Error).message,
					execution_time_ms: Date.now() - startTime,
					risk_score: 30,
				},
				context
			);

			logger.error(
				{ error, email: registerData.email },
				"User registration failed"
			);
			throw error;
		}
	}

	/**
	 * Authenticate user login
	 */
	async login(
		credentials: LoginCredentials,
		context?: AuthContext
	): Promise<AuthResult> {
		const startTime = Date.now();

		try {
			// Find user by email
			const user = await userRepository.findByEmail(credentials.email);
			if (!user) {
				throw new Error("Invalid email or password");
			}

			// Check if account is locked
			const isLocked = await userRepository.isAccountLocked(user.id);
			if (isLocked) {
				throw new Error(
					"Account is temporarily locked due to failed login attempts"
				);
			}

			// Verify password
			const isPasswordValid = await this.verifyPassword(
				credentials.password,
				user.password_hash
			);
			if (!isPasswordValid) {
				// Update failed login tracking
				await userRepository.updateLoginTracking(
					user.id,
					context?.ipAddress || "",
					false
				);

				throw new Error("Invalid email or password");
			}

			// Check account status
			if (user.status === "suspended") {
				throw new Error("Account is suspended");
			}

			if (user.status === "inactive") {
				throw new Error("Account is inactive");
			}

			// Update successful login tracking
			await userRepository.updateLoginTracking(
				user.id,
				context?.ipAddress || "",
				true
			);

			// Revoke other sessions if needed (optional - for single session per user)
			// await sessionRepository.revokeAllByUserId(user.id, 'new_login');

			// Generate tokens
			const sessionId = crypto.randomUUID();
			const accessToken = this.generateAccessToken({
				userId: user.id,
				email: user.email,
				role: user.role,
				sessionId,
			});

			const refreshToken = this.generateRefreshToken({
				userId: user.id,
				sessionId,
				type: "refresh",
			});

			// Create session
			const sessionData: CreateSessionData = {
				user_id: user.id,
				token_hash: this.generateTokenHash(accessToken),
				refresh_token_hash: this.generateTokenHash(refreshToken),
				device_info: context?.deviceInfo,
				ip_address: context?.ipAddress,
				user_agent: context?.userAgent,
				expires_at: this.getTokenExpirationDate(this.accessTokenExpiry),
				refresh_expires_at: this.getTokenExpirationDate(
					this.refreshTokenExpiry
				),
			};

			await sessionRepository.create(sessionData);

			// Log successful login
			await this.logAuthEvent(
				{
					actor_id: user.id,
					action: "login",
					entity_id: user.id,
					entity_name: user.email,
					success: true,
					execution_time_ms: Date.now() - startTime,
				},
				context
			);

			// Return user without password hash
			const { password_hash, ...userWithoutPassword } = user;

			return {
				user: userWithoutPassword,
				accessToken,
				refreshToken,
				expiresAt: sessionData.expires_at,
			};
		} catch (error) {
			// Log failed login
			await this.logAuthEvent(
				{
					action: "login_failed",
					entity_name: credentials.email,
					metadata: {
						email: credentials.email,
					},
					success: false,
					error_message: (error as Error).message,
					execution_time_ms: Date.now() - startTime,
					risk_score: 60,
				},
				context
			);

			logger.error({ error, email: credentials.email }, "User login failed");
			throw error;
		}
	}

	/**
	 * Logout user (revoke session)
	 */
	async logout(
		tokenHash: string,
		userId?: string,
		context?: AuthContext
	): Promise<void> {
		const startTime = Date.now();

		try {
			const revoked = await sessionRepository.revokeByTokenHash(
				tokenHash,
				"logout",
				userId
			);

			if (revoked) {
				// Log successful logout
				await this.logAuthEvent(
					{
						actor_id: userId,
						action: "logout",
						entity_id: userId,
						success: true,
						execution_time_ms: Date.now() - startTime,
					},
					context
				);

				logger.info({ userId }, "User logged out successfully");
			}
		} catch (error) {
			logger.error({ error, userId }, "Logout failed");
			throw error;
		}
	}

	/**
	 * Refresh access token
	 */
	async refreshToken(
		refreshTokenString: string,
		context?: AuthContext
	): Promise<AuthResult> {
		try {
			// Verify refresh token
			const refreshPayload =
				this.verifyToken<RefreshTokenPayload>(refreshTokenString);

			if (refreshPayload.type !== "refresh") {
				throw new Error("Invalid refresh token");
			}

			// Find active session
			const refreshTokenHash = this.generateTokenHash(refreshTokenString);
			const session = await sessionRepository.findByRefreshTokenHash(
				refreshTokenHash
			);

			if (!session) {
				throw new Error("Refresh token not found or expired");
			}

			// Get user
			const user = await userRepository.findById(session.user_id);
			if (!user) {
				throw new Error("User not found");
			}

			// Check account status
			if (user.status !== "active") {
				throw new Error("Account is not active");
			}

			// Generate new access token
			const newAccessToken = this.generateAccessToken({
				userId: user.id,
				email: user.email,
				role: user.role,
				sessionId: session.id,
			});

			// Update session with new token hash
			const newTokenHash = this.generateTokenHash(newAccessToken);
			await sessionRepository.revokeById(session.id, "token_refresh");

			// Create new session
			const newSessionData: CreateSessionData = {
				user_id: user.id,
				token_hash: newTokenHash,
				refresh_token_hash: refreshTokenHash,
				device_info: context?.deviceInfo || session.device_info,
				ip_address: context?.ipAddress || session.ip_address,
				user_agent: context?.userAgent || session.user_agent,
				expires_at: this.getTokenExpirationDate(this.accessTokenExpiry),
				refresh_expires_at: session.refresh_expires_at,
			};

			await sessionRepository.create(newSessionData);

			// Return user without password hash
			const { password_hash, ...userWithoutPassword } = user;

			return {
				user: userWithoutPassword,
				accessToken: newAccessToken,
				refreshToken: refreshTokenString, // Keep same refresh token
				expiresAt: newSessionData.expires_at,
			};
		} catch (error) {
			logger.error({ error }, "Token refresh failed");
			throw error;
		}
	}

	/**
	 * Verify access token and get user session
	 */
	async verifyAccessToken(token: string): Promise<{
		user: Omit<User, "password_hash">;
		sessionId: string;
	}> {
		try {
			// Verify JWT token
			const payload = this.verifyToken<JWTPayload>(token);

			// Check if session is still active
			const tokenHash = this.generateTokenHash(token);
			const session = await sessionRepository.findByTokenHash(tokenHash);

			if (!session) {
				throw new Error("Session not found or expired");
			}

			// Get user
			const user = await userRepository.findById(payload.userId);
			if (!user) {
				throw new Error("User not found");
			}

			// Check account status
			if (user.status !== "active" && user.status !== "pending_verification") {
				throw new Error("Account is not active");
			}

			// Update session activity
			await sessionRepository.updateActivity(session.id);

			// Return user without password hash
			const { password_hash, ...userWithoutPassword } = user;

			return {
				user: userWithoutPassword,
				sessionId: session.id,
			};
		} catch (error) {
			logger.error({ error }, "Token verification failed");
			throw error;
		}
	}

	/**
	 * Change user password
	 */
	async changePassword(
		userId: string,
		currentPassword: string,
		newPassword: string,
		context?: AuthContext
	): Promise<void> {
		const startTime = Date.now();

		try {
			// Get user
			const user = await userRepository.findById(userId);
			if (!user) {
				throw new Error("User not found");
			}

			// Verify current password
			const isCurrentPasswordValid = await this.verifyPassword(
				currentPassword,
				user.password_hash
			);
			if (!isCurrentPasswordValid) {
				throw new Error("Current password is incorrect");
			}

			// Validate new password
			const passwordValidation = this.validatePassword(newPassword);
			if (!passwordValidation.isValid) {
				throw new Error(
					`New password validation failed: ${passwordValidation.errors.join(
						", "
					)}`
				);
			}

			// Hash new password
			const newPasswordHash = await this.hashPassword(newPassword);

			// Update password
			await userRepository.updateById(userId, {
				password_hash: newPasswordHash,
			});

			// Revoke all other sessions (force re-login)
			await sessionRepository.revokeAllByUserId(userId, "password_change");

			// Log password change
			await this.logAuthEvent(
				{
					actor_id: userId,
					action: "password_change",
					entity_id: userId,
					entity_name: user.email,
					success: true,
					execution_time_ms: Date.now() - startTime,
				},
				context
			);

			logger.info({ userId }, "Password changed successfully");
		} catch (error) {
			// Log failed password change
			await this.logAuthEvent(
				{
					actor_id: userId,
					action: "password_change",
					entity_id: userId,
					success: false,
					error_message: (error as Error).message,
					execution_time_ms: Date.now() - startTime,
					risk_score: 40,
				},
				context
			);

			logger.error({ error, userId }, "Password change failed");
			throw error;
		}
	}

	/**
	 * Clean up expired sessions (maintenance task)
	 */
	async cleanupExpiredSessions(): Promise<number> {
		try {
			const cleanedCount = await sessionRepository.cleanupExpiredSessions();
			logger.info({ cleanedCount }, "Expired sessions cleaned up");
			return cleanedCount;
		} catch (error) {
			logger.error({ error }, "Failed to cleanup expired sessions");
			throw error;
		}
	}
}

export const authService = new AuthService();
