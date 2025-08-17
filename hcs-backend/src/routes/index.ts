import { Router } from "express";
import healthRoutes from "./health";
import authRoutes from "./auth.routes";
import studentRoutes from "./student.routes";
import classRoutes from "./class.routes";

const router = Router();

// Mount routes
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/classes", classRoutes);

export default router;
