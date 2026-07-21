"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerDashboardController_1 = require("../controllers/customerDashboardController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Customer dashboard endpoints
router.get("/overview", authMiddleware_1.protect, customerDashboardController_1.getMyDashboardOverview);
router.get("/recent-orders", authMiddleware_1.protect, customerDashboardController_1.getMyRecentOrders);
router.get("/wishlist", authMiddleware_1.protect, customerDashboardController_1.getMyWishlist);
// Scaffolded customer features (empty states for now)
router.get("/addresses", authMiddleware_1.protect, customerDashboardController_1.getMyAddresses);
router.get("/payment-methods", authMiddleware_1.protect, customerDashboardController_1.getMyPaymentMethods);
router.get("/settings", authMiddleware_1.protect, customerDashboardController_1.getMySettings);
exports.default = router;
