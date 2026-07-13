import { Router } from "express";

import { getDashboardStats } from "../controllers/dashboardController";

import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", protect, getDashboardStats);

export default router;