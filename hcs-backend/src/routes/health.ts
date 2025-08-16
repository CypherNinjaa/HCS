import { Router, Request, Response } from "express";
import { pool } from "../config/database";
import logger from "../utils/logger";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
	try {
		// Test database connection
		const dbResult = await pool.query("SELECT NOW() as current_time");
		const currentTime = dbResult.rows[0].current_time;

		const healthData = {
			status: "ok",
			timestamp: new Date().toISOString(),
			database: {
				status: "connected",
				currentTime: currentTime,
			},
			environment: process.env.NODE_ENV || "development",
			uptime: process.uptime(),
		};

		logger.info({ healthData }, "Health check successful");

		res.status(200).json({
			data: healthData,
			error: null,
			pagination: null,
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		logger.error({ error: errorMessage }, "Health check failed");

		res.status(500).json({
			data: null,
			error: {
				code: "HEALTH_CHECK_FAILED",
				message: "Health check failed",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			pagination: null,
		});
	}
});

export default router;
