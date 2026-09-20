import { Router } from "express";
import {
  getSellerStatsController,
  getAllSellersController,
  getSellerDetailController,
  updateSellerStatusController,
  getLocationsController,
  updateSellerTrustBadgesController,
  deactivateSellerAccountController,
} from "../controllers/sellerManagementController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = Router();

// All routes require authentication and admin/super_admin role
const adminAuth = [protect, authorize("ADMIN", "SUPER_ADMIN")];

// Stats
router.get("/stats", adminAuth, getSellerStatsController);

// Locations list for filter dropdown
router.get("/locations", adminAuth, getLocationsController);

// List sellers
router.get("/", adminAuth, getAllSellersController);

// Seller detail
router.get("/:id", adminAuth, getSellerDetailController);

// Update seller status (activate/deactivate)
router.patch("/:id/status", adminAuth, updateSellerStatusController);

// Admin deactivate seller account with reason
router.post("/:id/deactivate", adminAuth, deactivateSellerAccountController);

// Update seller trust badges (certification)
router.patch("/:id/trust-badges", adminAuth, updateSellerTrustBadgesController);

export default router;
