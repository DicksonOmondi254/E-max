"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sellerManagementController_1 = require("../controllers/sellerManagementController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
// All routes require authentication and admin/super_admin role
const adminAuth = [authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN")];
// Stats
router.get("/stats", adminAuth, sellerManagementController_1.getSellerStatsController);
// Locations list for filter dropdown
router.get("/locations", adminAuth, sellerManagementController_1.getLocationsController);
// List sellers
router.get("/", adminAuth, sellerManagementController_1.getAllSellersController);
// Seller detail
router.get("/:id", adminAuth, sellerManagementController_1.getSellerDetailController);
// Update seller status (activate/deactivate)
router.patch("/:id/status", adminAuth, sellerManagementController_1.updateSellerStatusController);
// Admin deactivate seller account with reason
router.post("/:id/deactivate", adminAuth, sellerManagementController_1.deactivateSellerAccountController);
// Update seller trust badges (certification)
router.patch("/:id/trust-badges", adminAuth, sellerManagementController_1.updateSellerTrustBadgesController);
exports.default = router;
