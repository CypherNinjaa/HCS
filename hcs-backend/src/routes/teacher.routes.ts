import express from "express";
import { TeacherService } from "../services/teacher.service";
import { authenticate } from "../middleware/auth.middleware";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const router = express.Router();
const teacherService = new TeacherService();

// Helper function to handle async routes
const asyncHandler =
	(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	(req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};

// Apply authentication to all routes
router.use(authenticate);

// Get teacher statistics (before /:id route to avoid conflicts)
router.get(
	"/dashboard/stats",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const stats = await teacherService.getTeacherStats();

			res.json({
				success: true,
				data: stats,
			});
		} catch (error) {
			logger.error({ error }, "Error fetching teacher stats");
			res.status(500).json({
				success: false,
				message: "Failed to fetch teacher statistics",
			});
		}
	})
);

// Get teachers with filters and pagination
router.get(
	"/",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const filters = {
				search: req.query.search as string,
				department: req.query.department as string,
				subjects: req.query.subjects
					? (req.query.subjects as string).split(",")
					: undefined,
				qualification: req.query.qualification as string,
				experience: req.query.experience as string,
				status: req.query.status as "active" | "inactive",
				performanceRating: req.query.performanceRating as
					| "excellent"
					| "good"
					| "average"
					| "needs_improvement",
				page: req.query.page ? parseInt(req.query.page as string) : 1,
				limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
			};

			const result = await teacherService.getTeachers(filters);

			res.json({
				success: true,
				data: result.teachers,
				pagination: result.pagination,
				total: result.total,
			});
		} catch (error) {
			logger.error({ error }, "Error fetching teachers");
			res.status(500).json({
				success: false,
				message: "Failed to fetch teachers",
			});
		}
	})
);

// Get teacher by ID
router.get(
	"/:id",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const teacher = await teacherService.getTeacherById(id);

			res.json({
				success: true,
				data: teacher,
			});
		} catch (error) {
			logger.error({ error }, "Error fetching teacher");

			if (error instanceof Error && error.message === "Teacher not found") {
				res.status(404).json({
					success: false,
					message: "Teacher not found",
				});
			} else if (
				error instanceof Error &&
				error.message === "Invalid teacher ID format"
			) {
				res.status(400).json({
					success: false,
					message: "Invalid teacher ID format",
				});
			} else {
				res.status(500).json({
					success: false,
					message: "Failed to fetch teacher",
				});
			}
		}
	})
);

// Get teacher by teacher ID (TCH0001)
router.get(
	"/teacher-id/:teacherId",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { teacherId } = req.params;
			const teacher = await teacherService.getTeacherByTeacherId(teacherId);

			res.json({
				success: true,
				data: teacher,
			});
		} catch (error) {
			logger.error({ error }, "Error fetching teacher by teacher ID");

			if (error instanceof Error && error.message === "Teacher not found") {
				res.status(404).json({
					success: false,
					message: "Teacher not found",
				});
			} else {
				res.status(500).json({
					success: false,
					message: "Failed to fetch teacher",
				});
			}
		}
	})
);

// Get teacher by email
router.get(
	"/email/:email",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { email } = req.params;
			const teacher = await teacherService.getTeacherByEmail(email);

			res.json({
				success: true,
				data: teacher,
			});
		} catch (error) {
			logger.error({ error }, "Error fetching teacher by email");

			if (error instanceof Error && error.message === "Teacher not found") {
				res.status(404).json({
					success: false,
					message: "Teacher not found",
				});
			} else if (
				error instanceof Error &&
				error.message === "Valid email is required"
			) {
				res.status(400).json({
					success: false,
					message: "Valid email is required",
				});
			} else {
				res.status(500).json({
					success: false,
					message: "Failed to fetch teacher",
				});
			}
		}
	})
);

// Get teachers by department
router.get(
	"/department/:department",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { department } = req.params;
			const teachers = await teacherService.getTeachersByDepartment(department);

			res.json({
				success: true,
				data: teachers,
			});
		} catch (error) {
			logger.error({ error }, "Error fetching teachers by department");

			if (
				error instanceof Error &&
				error.message === "Department is required"
			) {
				res.status(400).json({
					success: false,
					message: "Department is required",
				});
			} else {
				res.status(500).json({
					success: false,
					message: "Failed to fetch teachers",
				});
			}
		}
	})
);

// Get teachers by subject
router.get(
	"/subject/:subject",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { subject } = req.params;
			const teachers = await teacherService.getTeachersBySubject(subject);

			res.json({
				success: true,
				data: teachers,
			});
		} catch (error) {
			logger.error({ error }, "Error fetching teachers by subject");

			if (error instanceof Error && error.message === "Subject is required") {
				res.status(400).json({
					success: false,
					message: "Subject is required",
				});
			} else {
				res.status(500).json({
					success: false,
					message: "Failed to fetch teachers",
				});
			}
		}
	})
);

// Create new teacher
router.post(
	"/",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const teacherData = req.body;
			const createdBy = req.user!.id;

			const teacher = await teacherService.createTeacher(
				teacherData,
				createdBy
			);

			res.status(201).json({
				success: true,
				data: teacher,
				message: "Teacher created successfully",
			});
		} catch (error) {
			logger.error({ error }, "Error creating teacher");

			if (error instanceof Error) {
				if (error.message.includes("Email address is already in use")) {
					res.status(409).json({
						success: false,
						message: "Email address is already in use",
					});
				} else if (error.message.includes("validation")) {
					res.status(400).json({
						success: false,
						message: "Invalid input data",
						details: error.message,
					});
				} else {
					res.status(500).json({
						success: false,
						message: "Failed to create teacher",
					});
				}
			} else {
				res.status(500).json({
					success: false,
					message: "Failed to create teacher",
				});
			}
		}
	})
);

// Update teacher
router.put(
	"/:id",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const updates = req.body;
			const updatedBy = req.user!.id;

			const teacher = await teacherService.updateTeacher(
				id,
				updates,
				updatedBy
			);

			res.json({
				success: true,
				data: teacher,
				message: "Teacher updated successfully",
			});
		} catch (error) {
			logger.error({ error }, "Error updating teacher");

			if (error instanceof Error) {
				if (error.message === "Teacher not found") {
					res.status(404).json({
						success: false,
						message: "Teacher not found",
					});
				} else if (error.message === "Invalid teacher ID format") {
					res.status(400).json({
						success: false,
						message: "Invalid teacher ID format",
					});
				} else if (error.message.includes("Email address is already in use")) {
					res.status(409).json({
						success: false,
						message: "Email address is already in use",
					});
				} else if (error.message.includes("validation")) {
					res.status(400).json({
						success: false,
						message: "Invalid input data",
						details: error.message,
					});
				} else {
					res.status(500).json({
						success: false,
						message: "Failed to update teacher",
					});
				}
			} else {
				res.status(500).json({
					success: false,
					message: "Failed to update teacher",
				});
			}
		}
	})
);

// Delete teacher (soft delete)
router.delete(
	"/:id",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const deletedBy = req.user!.id;

			await teacherService.deleteTeacher(id, deletedBy);

			res.json({
				success: true,
				message: "Teacher deleted successfully",
			});
		} catch (error) {
			logger.error({ error }, "Error deleting teacher");

			if (error instanceof Error) {
				if (error.message === "Teacher not found") {
					res.status(404).json({
						success: false,
						message: "Teacher not found",
					});
				} else if (error.message === "Invalid teacher ID format") {
					res.status(400).json({
						success: false,
						message: "Invalid teacher ID format",
					});
				} else {
					res.status(500).json({
						success: false,
						message: "Failed to delete teacher",
					});
				}
			} else {
				res.status(500).json({
					success: false,
					message: "Failed to delete teacher",
				});
			}
		}
	})
);

// Bulk update teachers
router.patch(
	"/bulk",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { teacherIds, updates } = req.body;
			const updatedBy = req.user!.id;

			if (!Array.isArray(teacherIds) || teacherIds.length === 0) {
				res.status(400).json({
					success: false,
					message: "Teacher IDs array is required and cannot be empty",
				});
				return;
			}

			if (!updates || Object.keys(updates).length === 0) {
				res.status(400).json({
					success: false,
					message: "Updates object is required and cannot be empty",
				});
				return;
			}

			await teacherService.bulkUpdateTeachers(teacherIds, updates, updatedBy);

			res.json({
				success: true,
				message: `Successfully updated ${teacherIds.length} teachers`,
			});
		} catch (error) {
			logger.error({ error }, "Error in bulk teacher update");

			if (error instanceof Error && error.message.includes("validation")) {
				res.status(400).json({
					success: false,
					message: "Invalid input data",
					details: error.message,
				});
			} else {
				res.status(500).json({
					success: false,
					message: "Failed to update teachers",
				});
			}
		}
	})
);

export default router;
