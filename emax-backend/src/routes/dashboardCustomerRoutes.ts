import { Router } from "express";

import {
  getMyDashboardOverview,
  getMyRecentOrders,
  getMyWishlist,
  removeMyWishlistItem,
  getMyNotifications,
  getMyAddresses,
  getMyPaymentMethods,
  getMySettings,
} from "../controllers/customerDashboardController";

import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = Router();

// All customer dashboard endpoints require CUSTOMER role
router.get("/overview", protect, authorize("CUSTOMER"), getMyDashboardOverview);
router.get("/recent-orders", protect, authorize("CUSTOMER"), getMyRecentOrders);
router.get("/wishlist", protect, authorize("CUSTOMER"), getMyWishlist);
router.delete("/wishlist/:productId", protect, authorize("CUSTOMER"), removeMyWishlistItem);

// Real-time notifications from user data
router.get("/notifications", protect, authorize("CUSTOMER"), getMyNotifications);

// Scaffolded customer features (empty states for now)
router.get("/addresses", protect, authorize("CUSTOMER"), getMyAddresses);
router.get("/payment-methods", protect, authorize("CUSTOMER"), getMyPaymentMethods);
router.get("/settings", protect, authorize("CUSTOMER"), getMySettings);

export default router;

