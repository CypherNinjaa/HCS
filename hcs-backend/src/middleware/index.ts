// Middleware exports for clean imports
export {
	authenticate,
	authorize,
	authorizeAdmin,
	authorizeTeacher,
	authorizeStudent,
	authorizeParent,
	authorizeLibrarian,
	authorizeCoordinator,
	authorizeMediaCoordinator,
	authorizeMultipleRoles,
	requireOwnership,
	requireParentChildRelation,
	requireTeacherClassAssignment,
	optionalAuthentication,
	checkRateLimit,
} from "./auth.middleware";

// Re-export types for convenience
export type { AuthenticatedRequest } from "./auth.middleware";
