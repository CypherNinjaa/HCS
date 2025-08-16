import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { UserRole } from "../types/database";
import logger from "../utils/logger";

// Extend Express Request type to include user data
declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				email: string;
				role: UserRole;
				sessionId: string;
			};
		}
	}
}

export interface AuthenticatedRequest extends Request {
	user: {
		id: string;
		email: string;
		role: UserRole;
		sessionId: string;
	};
}

/**
 * Extract JWT token from Authorization header
 */
const extractToken = (req: Request): string | null => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return null;
	}

	// Check for Bearer token format
	const parts = authHeader.split(" ");
	if (parts.length !== 2 || parts[0] !== "Bearer") {
		return null;
	}

	return parts[1];
};

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const token = extractToken(req);

		if (!token) {
			res.status(401).json({
				error: "Authentication required",
				message: "No valid token provided",
			});
			return;
		}

		// Verify token and get user
		const { user, sessionId } = await authService.verifyAccessToken(token);

		// Attach user data to request
		req.user = {
			id: user.id,
			email: user.email,
			role: user.role,
			sessionId,
		};

		next();
	} catch (error) {
		logger.error({ error, ip: req.ip }, "Authentication failed");

		res.status(401).json({
			error: "Authentication failed",
			message: "Invalid or expired token",
		});
	}
};

/**
 * Middleware to authorize specific roles
 */
export const authorize = (allowedRoles: UserRole[]) => {
	return (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction
	): void => {
		try {
			if (!req.user) {
				res.status(401).json({
					error: "Authentication required",
					message: "User not authenticated",
				});
				return;
			}

			if (!allowedRoles.includes(req.user.role)) {
				logger.warn(
					{
						userId: req.user.id,
						userRole: req.user.role,
						requiredRoles: allowedRoles,
						endpoint: req.path,
					},
					"Authorization failed - insufficient permissions"
				);

				res.status(403).json({
					error: "Access denied",
					message: "Insufficient permissions for this resource",
				});
				return;
			}

			next();
		} catch (error) {
			logger.error(
				{ error, userId: req.user?.id },
				"Authorization check failed"
			);

			res.status(500).json({
				error: "Authorization error",
				message: "Failed to verify permissions",
			});
		}
	};
};

/**
 * Role-based authorization shortcuts
 */
export const authorizeAdmin = authorize(["admin"]);
export const authorizeTeacher = authorize(["teacher", "admin"]);
export const authorizeStudent = authorize(["student", "teacher", "admin"]);
export const authorizeParent = authorize(["parent", "admin"]);
export const authorizeLibrarian = authorize(["librarian", "admin"]);
export const authorizeCoordinator = authorize(["coordinator", "admin"]);
export const authorizeMediaCoordinator = authorize([
	"media_coordinator",
	"admin",
]);

/**
 * Multiple role authorization (user must have one of the specified roles)
 */
export const authorizeMultipleRoles = (allowedRoles: UserRole[]) => {
	return authorize(allowedRoles);
};

/**
 * Resource ownership validation
 * For endpoints where users can only access their own data
 */
export const requireOwnership = (userIdParam: string = "userId") => {
	return (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction
	): void => {
		try {
			if (!req.user) {
				res.status(401).json({
					error: "Authentication required",
					message: "User not authenticated",
				});
				return;
			}

			const resourceUserId = req.params[userIdParam];

			// Admin can access any resource
			if (req.user.role === "admin") {
				next();
				return;
			}

			// User can only access their own resources
			if (req.user.id !== resourceUserId) {
				logger.warn(
					{
						userId: req.user.id,
						requestedUserId: resourceUserId,
						endpoint: req.path,
					},
					"Access denied - user attempted to access another user's resource"
				);

				res.status(403).json({
					error: "Access denied",
					message: "You can only access your own resources",
				});
				return;
			}

			next();
		} catch (error) {
			logger.error(
				{ error, userId: req.user?.id },
				"Ownership validation failed"
			);

			res.status(500).json({
				error: "Authorization error",
				message: "Failed to verify resource ownership",
			});
		}
	};
};

/**
 * Parent-child relationship validation
 * For endpoints where parents can access their child's data
 */
export const requireParentChildRelation = (
	studentIdParam: string = "studentId"
) => {
	return async (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			if (!req.user) {
				res.status(401).json({
					error: "Authentication required",
					message: "User not authenticated",
				});
				return;
			}

			const studentId = req.params[studentIdParam];

			// Admin and teachers can access any student data
			if (["admin", "teacher", "coordinator"].includes(req.user.role)) {
				next();
				return;
			}

			// For parents, validate parent-child relationship
			if (req.user.role === "parent") {
				// TODO: Implement parent-child relationship validation
				// This would require a parent_children table or relationship in profiles
				// For now, we'll allow access but log it for implementation
				logger.info(
					{
						parentId: req.user.id,
						studentId,
						endpoint: req.path,
					},
					"Parent-child relationship validation needed - implement parent_children table"
				);

				next();
				return;
			}

			// Students can only access their own data
			if (req.user.role === "student" && req.user.id !== studentId) {
				res.status(403).json({
					error: "Access denied",
					message: "Students can only access their own data",
				});
				return;
			}

			next();
		} catch (error) {
			logger.error(
				{ error, userId: req.user?.id },
				"Parent-child relation validation failed"
			);

			res.status(500).json({
				error: "Authorization error",
				message: "Failed to verify parent-child relationship",
			});
		}
	};
};

/**
 * Teacher-class assignment validation
 * For endpoints where teachers can only access their assigned classes
 */
export const requireTeacherClassAssignment = (
	classIdParam: string = "classId"
) => {
	return async (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			if (!req.user) {
				res.status(401).json({
					error: "Authentication required",
					message: "User not authenticated",
				});
				return;
			}

			const classId = req.params[classIdParam];

			// Admin and coordinators can access any class
			if (["admin", "coordinator"].includes(req.user.role)) {
				next();
				return;
			}

			// For teachers, validate class assignment
			if (req.user.role === "teacher") {
				// TODO: Implement teacher-class assignment validation
				// This would require a teacher_class_assignments table
				// For now, we'll allow access but log it for implementation
				logger.info(
					{
						teacherId: req.user.id,
						classId,
						endpoint: req.path,
					},
					"Teacher-class assignment validation needed - implement teacher_class_assignments table"
				);

				next();
				return;
			}

			res.status(403).json({
				error: "Access denied",
				message: "Unauthorized access to class resources",
			});
		} catch (error) {
			logger.error(
				{ error, userId: req.user?.id },
				"Teacher-class assignment validation failed"
			);

			res.status(500).json({
				error: "Authorization error",
				message: "Failed to verify teacher-class assignment",
			});
		}
	};
};

/**
 * Optional authentication - set user if token is valid but don't require it
 */
export const optionalAuthentication = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const token = extractToken(req);

		if (token) {
			try {
				const { user, sessionId } = await authService.verifyAccessToken(token);

				req.user = {
					id: user.id,
					email: user.email,
					role: user.role,
					sessionId,
				};
			} catch (error) {
				// Token invalid but don't fail the request
				logger.debug(
					{ error },
					"Optional authentication failed - continuing without user"
				);
			}
		}

		next();
	} catch (error) {
		logger.error({ error }, "Optional authentication middleware error");
		next(); // Continue without authentication
	}
};

/**
 * Rate limiting check (placeholder for future implementation)
 */
export const checkRateLimit = (requestsPerMinute: number = 60) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		// TODO: Implement rate limiting using Redis or in-memory store
		// For now, just continue
		logger.debug(
			{
				ip: req.ip,
				endpoint: req.path,
				rateLimit: requestsPerMinute,
			},
			"Rate limiting check - implement Redis-based rate limiting"
		);

		next();
	};
};
