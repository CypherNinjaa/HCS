import { Router, Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { authService } from "../services/auth.service";
import { authenticate } from "../middleware/auth.middleware";
import { UserRole } from "../types/database";
import logger from "../utils/logger";

const router = Router();

// Validation schemas
const registerSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	role: z.enum([
		"student",
		"parent",
		"teacher",
		"librarian",
		"coordinator",
		"media_coordinator",
		"admin",
	] as const),
	firstName: z
		.string()
		.min(1, "First name is required")
		.max(50, "First name too long"),
	lastName: z
		.string()
		.min(1, "Last name is required")
		.max(50, "Last name too long"),
	middleName: z.string().max(50, "Middle name too long").optional(),
	phoneNumber: z
		.string()
		.regex(/^\+?[\d\s-()]{10,15}$/, "Invalid phone number format")
		.optional(),
});

const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});

const changePasswordSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

const refreshTokenSchema = z.object({
	refreshToken: z.string().min(1, "Refresh token is required"),
});

/**
 * Helper function to extract auth context from request
 */
const getAuthContext = (req: Request) => ({
	ipAddress: req.ip || req.socket.remoteAddress,
	userAgent: req.get("User-Agent"),
	deviceInfo: {
		ip: req.ip,
		forwarded: req.get("X-Forwarded-For"),
		real_ip: req.get("X-Real-IP"),
	},
});

/**
 * Helper function to handle async route errors
 */
const asyncHandler =
	(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
	(req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};

/**
 * POST /auth/register
 * Register a new user account
 */
router.post(
	"/register",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			// Validate request body
			const validatedData = registerSchema.parse(req.body);

			// Get auth context
			const authContext = getAuthContext(req);

			// Register user
			const result = await authService.register(validatedData, authContext);

			logger.info(
				{
					userId: result.user.id,
					email: result.user.email,
					role: result.user.role,
				},
				"User registered successfully"
			);

			res.status(201).json({
				success: true,
				message: "User registered successfully",
				data: {
					user: result.user,
					accessToken: result.accessToken,
					refreshToken: result.refreshToken,
					expiresAt: result.expiresAt,
				},
			});
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					success: false,
					error: "Validation failed",
					message: "Invalid input data",
					details: error.issues,
				});
			}

			logger.error({ error }, "Registration failed");

			res.status(400).json({
				success: false,
				error: "Registration failed",
				message: (error as Error).message,
			});
		}
	})
);

/**
 * POST /auth/login
 * Authenticate user and create session
 */
router.post(
	"/login",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			// Validate request body
			const validatedData = loginSchema.parse(req.body);

			// Get auth context
			const authContext = getAuthContext(req);

			// Authenticate user
			const result = await authService.login(validatedData, authContext);

			logger.info(
				{
					userId: result.user.id,
					email: result.user.email,
					role: result.user.role,
				},
				"User logged in successfully"
			);

			res.status(200).json({
				success: true,
				message: "Login successful",
				data: {
					user: result.user,
					accessToken: result.accessToken,
					refreshToken: result.refreshToken,
					expiresAt: result.expiresAt,
				},
			});
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					success: false,
					error: "Validation failed",
					message: "Invalid input data",
					details: error.issues,
				});
			}

			logger.error({ error, email: req.body?.email }, "Login failed");

			res.status(401).json({
				success: false,
				error: "Authentication failed",
				message: (error as Error).message,
			});
		}
	})
);

/**
 * POST /auth/logout
 * Logout user and revoke session
 */
router.post(
	"/logout",
	authenticate,
	asyncHandler(async (req: Request, res: Response) => {
		try {
			// Extract token from Authorization header
			const authHeader = req.headers.authorization;
			const token = authHeader?.split(" ")[1];

			if (!token) {
				return res.status(400).json({
					success: false,
					error: "Logout failed",
					message: "No token provided",
				});
			}

			// Get auth context
			const authContext = getAuthContext(req);

			// Create token hash for logout
			const crypto = require("crypto");
			const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

			// Logout user
			await authService.logout(tokenHash, req.user?.id, authContext);

			logger.info({ userId: req.user?.id }, "User logged out successfully");

			res.status(200).json({
				success: true,
				message: "Logout successful",
			});
		} catch (error) {
			logger.error({ error, userId: req.user?.id }, "Logout failed");

			res.status(500).json({
				success: false,
				error: "Logout failed",
				message: "Failed to logout user",
			});
		}
	})
);

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
router.post(
	"/refresh",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			// Validate request body
			const validatedData = refreshTokenSchema.parse(req.body);

			// Get auth context
			const authContext = getAuthContext(req);

			// Refresh token
			const result = await authService.refreshToken(
				validatedData.refreshToken,
				authContext
			);

			logger.info(
				{
					userId: result.user.id,
				},
				"Token refreshed successfully"
			);

			res.status(200).json({
				success: true,
				message: "Token refreshed successfully",
				data: {
					user: result.user,
					accessToken: result.accessToken,
					refreshToken: result.refreshToken,
					expiresAt: result.expiresAt,
				},
			});
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					success: false,
					error: "Validation failed",
					message: "Invalid input data",
					details: error.issues,
				});
			}

			logger.error({ error }, "Token refresh failed");

			res.status(401).json({
				success: false,
				error: "Token refresh failed",
				message: (error as Error).message,
			});
		}
	})
);

/**
 * GET /auth/me
 * Get current user information
 */
router.get(
	"/me",
	authenticate,
	asyncHandler(async (req: Request, res: Response) => {
		try {
			res.status(200).json({
				success: true,
				message: "User information retrieved successfully",
				data: {
					user: {
						id: req.user?.id,
						email: req.user?.email,
						role: req.user?.role,
					},
				},
			});
		} catch (error) {
			logger.error({ error, userId: req.user?.id }, "Failed to get user info");

			res.status(500).json({
				success: false,
				error: "Failed to get user information",
				message: "Internal server error",
			});
		}
	})
);

/**
 * POST /auth/change-password
 * Change user password
 */
router.post(
	"/change-password",
	authenticate,
	asyncHandler(async (req: Request, res: Response) => {
		try {
			if (!req.user) {
				return res.status(401).json({
					success: false,
					error: "Authentication required",
					message: "User not authenticated",
				});
			}

			// Validate request body
			const validatedData = changePasswordSchema.parse(req.body);

			// Get auth context
			const authContext = getAuthContext(req);

			// Change password
			await authService.changePassword(
				req.user.id,
				validatedData.currentPassword,
				validatedData.newPassword,
				authContext
			);

			logger.info({ userId: req.user.id }, "Password changed successfully");

			res.status(200).json({
				success: true,
				message: "Password changed successfully",
			});
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					success: false,
					error: "Validation failed",
					message: "Invalid input data",
					details: error.issues,
				});
			}

			logger.error({ error, userId: req.user?.id }, "Password change failed");

			res.status(400).json({
				success: false,
				error: "Password change failed",
				message: (error as Error).message,
			});
		}
	})
);

/**
 * POST /auth/verify-token
 * Verify if access token is valid (for client-side checks)
 */
router.post(
	"/verify-token",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { token } = req.body;

			if (!token) {
				return res.status(400).json({
					success: false,
					error: "Validation failed",
					message: "Token is required",
				});
			}

			// Verify token
			const result = await authService.verifyAccessToken(token);

			res.status(200).json({
				success: true,
				message: "Token is valid",
				data: {
					user: result.user,
					sessionId: result.sessionId,
				},
			});
		} catch (error) {
			res.status(401).json({
				success: false,
				error: "Token verification failed",
				message: "Invalid or expired token",
			});
		}
	})
);

/**
 * GET /auth/sessions
 * Get user's active sessions (for security dashboard)
 */
router.get(
	"/sessions",
	authenticate,
	asyncHandler(async (req: Request, res: Response) => {
		try {
			// TODO: Implement session listing in sessionRepository
			// const sessions = await sessionRepository.findActiveByUserId(req.user.id);

			logger.info(
				{ userId: req.user?.id },
				"Sessions endpoint called - implement session listing"
			);

			res.status(200).json({
				success: true,
				message: "Active sessions retrieved",
				data: {
					sessions: [],
					note: "Session listing implementation pending",
				},
			});
		} catch (error) {
			logger.error(
				{ error, userId: req.user?.id },
				"Failed to get user sessions"
			);

			res.status(500).json({
				success: false,
				error: "Failed to get sessions",
				message: "Internal server error",
			});
		}
	})
);

/**
 * DELETE /auth/sessions/:sessionId
 * Revoke a specific session
 */
router.delete(
	"/sessions/:sessionId",
	authenticate,
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { sessionId } = req.params;

			// TODO: Implement session revocation with ownership check
			logger.info(
				{
					userId: req.user?.id,
					sessionId,
				},
				"Session revocation endpoint called - implement session ownership validation"
			);

			res.status(200).json({
				success: true,
				message: "Session revoked successfully",
				note: "Session revocation implementation pending",
			});
		} catch (error) {
			logger.error({ error, userId: req.user?.id }, "Failed to revoke session");

			res.status(500).json({
				success: false,
				error: "Failed to revoke session",
				message: "Internal server error",
			});
		}
	})
);

export default router;
