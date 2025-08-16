import { Router, Request, Response } from "express";
import { ClassService } from "../services/class.service";
import { authenticate } from "../middleware/auth.middleware";
import logger from "../utils/logger";

const router = Router();
const classService = new ClassService();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @route GET /api/v1/classes
 * @desc Get all classes with pagination and filtering
 * @access Private (Admin, Teacher, Coordinator)
 */
router.get("/", async (req: Request, res: Response) => {
	try {
		const {
			page,
			limit,
			sortBy,
			sortOrder,
			academic_year_id,
			name,
			grade,
			section,
			is_active,
			search,
		} = req.query;

		const options = {
			page: page ? parseInt(page as string) : undefined,
			limit: limit ? parseInt(limit as string) : undefined,
			sortBy: sortBy as string,
			sortOrder: sortOrder as "ASC" | "DESC",
			academic_year_id: academic_year_id as string,
			name: name as string,
			grade: grade ? parseInt(grade as string) : undefined,
			section: section as string,
			is_active:
				is_active === "true" ? true : is_active === "false" ? false : undefined,
			search: search as string,
		};
		const result = await classService.getAllClasses(options);

		logger.info(
			{
				userId: req.user?.id,
				options,
				resultCount: result.classes.length,
			},
			"Classes retrieved successfully"
		);

		res.json({
			success: true,
			message: "Classes retrieved successfully",
			data: result.classes,
			pagination: result.pagination,
		});
	} catch (error) {
		logger.error({ error, userId: req.user?.id }, "Error retrieving classes");
		res.status(500).json({
			success: false,
			message: "Failed to retrieve classes",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

/**
 * @route GET /api/v1/classes/stats
 * @desc Get class statistics
 * @access Private (Admin, Coordinator)
 */
router.get("/stats", async (req: Request, res: Response) => {
	try {
		// Check if user has admin or coordinator role
		if (!req.user || !["admin", "coordinator"].includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: "Access denied. Admin or Coordinator role required.",
			});
		}

		const stats = await classService.getClassStats();

		logger.info(
			{ userId: req.user.id, stats },
			"Class statistics retrieved successfully"
		);

		res.json({
			success: true,
			message: "Class statistics retrieved successfully",
			data: stats,
		});
	} catch (error) {
		logger.error(
			{ error, userId: req.user?.id },
			"Error retrieving class statistics"
		);
		res.status(500).json({
			success: false,
			message: "Failed to retrieve class statistics",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

/**
 * @route GET /api/v1/classes/academic-year/:academicYearId
 * @desc Get classes by academic year
 * @access Private (Admin, Teacher, Coordinator)
 */
router.get(
	"/academic-year/:academicYearId",
	async (req: Request, res: Response) => {
		try {
			const { academicYearId } = req.params;

			const classes = await classService.getClassesByAcademicYear(
				academicYearId
			);

			logger.info(
				{
					userId: req.user?.id,
					academicYearId,
					classCount: classes.length,
				},
				"Classes by academic year retrieved successfully"
			);

			res.json({
				success: true,
				message: "Classes retrieved successfully",
				data: classes,
			});
		} catch (error) {
			logger.error(
				{ error, userId: req.user?.id },
				"Error retrieving classes by academic year"
			);
			res.status(400).json({
				success: false,
				message: "Failed to retrieve classes",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

/**
 * @route GET /api/v1/classes/:id
 * @desc Get class by ID
 * @access Private (Admin, Teacher, Coordinator)
 */
router.get("/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const classData = await classService.getClassById(id);

		if (!classData) {
			return res.status(404).json({
				success: false,
				message: "Class not found",
			});
		}

		logger.info(
			{ userId: req.user?.id, classId: id },
			"Class retrieved successfully"
		);

		res.json({
			success: true,
			message: "Class retrieved successfully",
			data: classData,
		});
	} catch (error) {
		logger.error({ error, userId: req.user?.id }, "Error retrieving class");
		res.status(400).json({
			success: false,
			message: "Failed to retrieve class",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

/**
 * @route GET /api/v1/classes/:id/capacity
 * @desc Check class capacity and availability
 * @access Private (Admin, Coordinator)
 */
router.get("/:id/capacity", async (req: Request, res: Response) => {
	try {
		// Check if user has admin or coordinator role
		if (!req.user || !["admin", "coordinator"].includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: "Access denied. Admin or Coordinator role required.",
			});
		}

		const { id } = req.params;

		const capacityInfo = await classService.checkClassCapacity(id);

		logger.info(
			{ userId: req.user.id, classId: id, capacityInfo },
			"Class capacity information retrieved successfully"
		);

		res.json({
			success: true,
			message: "Class capacity information retrieved successfully",
			data: capacityInfo,
		});
	} catch (error) {
		logger.error(
			{ error, userId: req.user?.id },
			"Error retrieving class capacity"
		);
		res.status(400).json({
			success: false,
			message: "Failed to retrieve class capacity",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

/**
 * @route POST /api/v1/classes
 * @desc Create a new class
 * @access Private (Admin, Coordinator)
 */
router.post("/", async (req: Request, res: Response) => {
	try {
		// Check if user has admin or coordinator role
		if (!req.user || !["admin", "coordinator"].includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: "Access denied. Admin or Coordinator role required.",
			});
		}

		const classData = req.body;
		const userId = req.user.id;

		const newClass = await classService.createClass(classData, userId);

		logger.info({ userId, classId: newClass.id }, "Class created successfully");

		res.status(201).json({
			success: true,
			message: "Class created successfully",
			data: newClass,
		});
	} catch (error) {
		logger.error({ error, userId: req.user?.id }, "Error creating class");
		res.status(400).json({
			success: false,
			message: "Failed to create class",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

/**
 * @route PUT /api/v1/classes/:id
 * @desc Update a class
 * @access Private (Admin, Coordinator)
 */
router.put("/:id", async (req: Request, res: Response) => {
	try {
		// Check if user has admin or coordinator role
		if (!req.user || !["admin", "coordinator"].includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: "Access denied. Admin or Coordinator role required.",
			});
		}

		const { id } = req.params;
		const updates = req.body;
		const userId = req.user.id;

		const updatedClass = await classService.updateClass(id, updates, userId);

		if (!updatedClass) {
			return res.status(404).json({
				success: false,
				message: "Class not found",
			});
		}

		logger.info({ userId, classId: id }, "Class updated successfully");

		res.json({
			success: true,
			message: "Class updated successfully",
			data: updatedClass,
		});
	} catch (error) {
		logger.error({ error, userId: req.user?.id }, "Error updating class");
		res.status(400).json({
			success: false,
			message: "Failed to update class",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

/**
 * @route DELETE /api/v1/classes/:id
 * @desc Delete a class (soft delete)
 * @access Private (Admin)
 */
router.delete("/:id", async (req: Request, res: Response) => {
	try {
		// Check if user has admin role
		if (!req.user || req.user.role !== "admin") {
			return res.status(403).json({
				success: false,
				message: "Access denied. Admin role required.",
			});
		}

		const { id } = req.params;
		const userId = req.user.id;

		const result = await classService.deleteClass(id, userId);

		if (!result) {
			return res.status(404).json({
				success: false,
				message: "Class not found",
			});
		}

		logger.info({ userId, classId: id }, "Class deleted successfully");

		res.json({
			success: true,
			message: "Class deleted successfully",
		});
	} catch (error) {
		logger.error({ error, userId: req.user?.id }, "Error deleting class");
		res.status(400).json({
			success: false,
			message: "Failed to delete class",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

export default router;
