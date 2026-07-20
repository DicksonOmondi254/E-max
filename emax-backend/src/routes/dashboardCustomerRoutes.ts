import { Router } from "express";

import {
  getMyDashboardOverview,
  getMyRecentOrders,
  getMyWishlist,
  getMyAddresses,
  getMyPaymentMethods,
  getMySettings,
} from "../controllers/customerDashboardController";

import { protect } from "../middlewares/authMiddleware";

const router = Router();

// Customer dashboard endpoints
router.get("/overview", protect, getMyDashboardOverview);
router.get("/recent-orders", protect, getMyRecentOrders);
router.get("/wishlist", protect, getMyWishlist);

// Scaffolded customer features (empty states for now)
router.get("/addresses", protect, getMyAddresses);
router.get("/payment-methods", protect, getMyPaymentMethods);
router.get("/settings", protect, getMySettings);

export default router;

