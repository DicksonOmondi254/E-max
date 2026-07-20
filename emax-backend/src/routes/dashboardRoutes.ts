import { Router } from "express";

import {
  getDashboardStats,
  getMyDashboardOverview,
  getMyRecentOrders,
  getMyWishlist,
} from "../controllers/dashboardController";

import { protect } from "../middlewares/authMiddleware";

const router = Router();

// Admin/global dashboard stats (kept intact)
router.get("/", protect, getDashboardStats);

// Customer dashboard (real data)
router.get(
  "/me/overview",
  protect,
  getMyDashboardOverview
);

router.get(
  "/me/recent-orders",
  protect,
  getMyRecentOrders
);

router.get(
  "/me/wishlist",
  protect,
  getMyWishlist
);

export default router;
