import express from "express";
import { StudentService } from "../services/student.service";
import { authenticate } from "../middleware/auth.middleware";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const router = express.Router();
const studentService = new StudentService();

// Helper function to handle async routes
const asyncHandler =
	(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	(req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};

// Apply authentication to all routes
router.use(authenticate);

// Get student statistics (before /:id route to avoid conflicts)
router.get(
	"/dashboard/stats",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const stats = await studentService.getStudentStats();

			res.json({
				success: true,
				data: stats,
			});
		} catch (error) {
			logger.error(
				{ error, userId: req.user?.id },
				"Error fetching student stats"
			);
			res.status(500).json({
				success: false,
				message: "Failed to fetch student statistics",
			});
		}
	})
);

// Get students with filters and pagination
router.get(
	"/",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const filters = {
				search: req.query.search as string,
				classId: req.query.classId as string,
				grade: req.query.grade
					? parseInt(req.query.grade as string)
					: undefined,
				section: req.query.section as string,
				feeStatus: req.query.feeStatus as "PAID" | "PENDING" | "OVERDUE",
				status: req.query.status as "active" | "inactive",
				performanceGrade: req.query.performanceGrade as
					| "EXCELLENT"
					| "GOOD"
					| "AVERAGE"
					| "NEEDS_IMPROVEMENT",
				page: req.query.page ? parseInt(req.query.page as string) : 1,
				limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
			};

			const result = await studentService.getStudents(filters);

			res.json({
				success: true,
				data: result.students,
				pagination: result.pagination,
				total: result.total,
			});
		} catch (error) {
			logger.error({ error, userId: req.user?.id }, "Error fetching students");
			res.status(500).json({
				success: false,
				message: "Failed to fetch students",
			});
		}
	})
);

// Get student by ID
router.get(
	"/:id",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const student = await studentService.getStudentById(id);

			res.json({
				success: true,
				data: student,
			});
		} catch (error) {
			logger.error(
				{ error, studentId: req.params.id, userId: req.user?.id },
				"Error fetching student"
			);

			if (error instanceof Error && error.message === "Student not found") {
				res.status(404).json({
					success: false,
					message: "Student not found",
				});
			} else if (
				error instanceof Error &&
				error.message === "Invalid student ID format"
			) {
				res.status(400).json({
					success: false,
					message: "Invalid student ID format",
				});
			} else {
				res.status(500).json({
					success: false,
					message: "Failed to fetch student",
				});
			}
		}
	})
);

// Create new student
router.post(
	"/",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const studentData = req.body;
			const createdBy = req.user!.id;

			const student = await studentService.createStudent(
				studentData,
				createdBy
			);

			res.status(201).json({
				success: true,
				data: student,
				message: "Student created successfully",
			});
		} catch (error) {
			logger.error({ error, userId: req.user?.id }, "Error creating student");

			if (error instanceof Error) {
				if (error.message.includes("Email address is already in use")) {
					res.status(409).json({
						success: false,
						message: "Email address is already in use",
					});
				} else if (error.message.includes("Roll number is already taken")) {
					res.status(409).json({
						success: false,
						message: "Roll number is already taken in this class",
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
						message: "Failed to create student",
					});
				}
			} else {
				res.status(500).json({
					success: false,
					message: "Failed to create student",
				});
			}
		}
	})
);

// Update student
router.put(
	"/:id",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const updates = req.body;
			const updatedBy = req.user!.id;

			const student = await studentService.updateStudent(
				id,
				updates,
				updatedBy
			);

			res.json({
				success: true,
				data: student,
				message: "Student updated successfully",
			});
		} catch (error) {
			logger.error(
				{ error, studentId: req.params.id, userId: req.user?.id },
				"Error updating student"
			);

			if (error instanceof Error) {
				if (error.message === "Student not found") {
					res.status(404).json({
						success: false,
						message: "Student not found",
					});
				} else if (error.message === "Invalid student ID format") {
					res.status(400).json({
						success: false,
						message: "Invalid student ID format",
					});
				} else if (error.message.includes("Email address is already in use")) {
					res.status(409).json({
						success: false,
						message: "Email address is already in use",
					});
				} else if (error.message.includes("Roll number is already taken")) {
					res.status(409).json({
						success: false,
						message: "Roll number is already taken in this class",
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
						message: "Failed to update student",
					});
				}
			} else {
				res.status(500).json({
					success: false,
					message: "Failed to update student",
				});
			}
		}
	})
);

// Delete student (soft delete)
router.delete(
	"/:id",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const deletedBy = req.user!.id;

			await studentService.deleteStudent(id, deletedBy);

			res.json({
				success: true,
				message: "Student deleted successfully",
			});
		} catch (error) {
			logger.error(
				{ error, studentId: req.params.id, userId: req.user?.id },
				"Error deleting student"
			);

			if (error instanceof Error) {
				if (error.message === "Student not found") {
					res.status(404).json({
						success: false,
						message: "Student not found",
					});
				} else if (error.message === "Invalid student ID format") {
					res.status(400).json({
						success: false,
						message: "Invalid student ID format",
					});
				} else {
					res.status(500).json({
						success: false,
						message: "Failed to delete student",
					});
				}
			} else {
				res.status(500).json({
					success: false,
					message: "Failed to delete student",
				});
			}
		}
	})
);

// Bulk update students
router.patch(
	"/bulk",
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { studentIds, updates } = req.body;
			const updatedBy = req.user!.id;

			if (!Array.isArray(studentIds) || studentIds.length === 0) {
				res.status(400).json({
					success: false,
					message: "Student IDs array is required and cannot be empty",
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

			await studentService.bulkUpdateStudents(studentIds, updates, updatedBy);

			res.json({
				success: true,
				message: `Successfully updated ${studentIds.length} students`,
			});
		} catch (error) {
			logger.error(
				{ error, userId: req.user?.id },
				"Error in bulk student update"
			);

			if (error instanceof Error && error.message.includes("validation")) {
				res.status(400).json({
					success: false,
					message: "Invalid input data",
					details: error.message,
				});
			} else {
				res.status(500).json({
					success: false,
					message: "Failed to update students",
				});
			}
		}
	})
);

export default router;
