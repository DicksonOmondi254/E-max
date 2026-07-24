import { Router } from "express";

import {
  getDashboardStats,
} from "../controllers/dashboardController";

import { protect } from "../middlewares/authMiddleware";

const router = Router();

// Admin/global dashboard stats (kept intact)
router.get("/", protect, getDashboardStats);

export default router;
