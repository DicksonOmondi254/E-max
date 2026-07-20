"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Admin/global dashboard stats (kept intact)
router.get("/", authMiddleware_1.protect, dashboardController_1.getDashboardStats);
// Customer dashboard (real data)
router.get("/me/overview", authMiddleware_1.protect, dashboardController_1.getMyDashboardOverview);
router.get("/me/recent-orders", authMiddleware_1.protect, dashboardController_1.getMyRecentOrders);
router.get("/me/wishlist", authMiddleware_1.protect, dashboardController_1.getMyWishlist);
exports.default = router;
