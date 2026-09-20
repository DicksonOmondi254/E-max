"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sellerDashboardController_1 = require("../controllers/sellerDashboardController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
// All seller routes require authentication and seller/admin role
const sellerAuth = [authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("SELLER", "ADMIN", "SUPER_ADMIN")];
// Dashboard
router.get("/dashboard", sellerAuth, sellerDashboardController_1.getSellerStats);
// Products
router.get("/products", sellerAuth, sellerDashboardController_1.getSellerProductsList);
// Orders
router.get("/orders", sellerAuth, sellerDashboardController_1.getSellerOrdersList);
router.patch("/orders/:id/status", sellerAuth, sellerDashboardController_1.updateOrderStatus);
// Earnings / Finance
router.get("/earnings", sellerAuth, sellerDashboardController_1.getSellerEarningsList);
// Returns
router.get("/returns", sellerAuth, sellerDashboardController_1.getSellerReturnsList);
// Reviews
router.get("/reviews", sellerAuth, sellerDashboardController_1.getSellerReviewsList);
// Performance
router.get("/performance", sellerAuth, sellerDashboardController_1.getSellerPerformanceData);
// Profile / Settings
router.get("/profile", sellerAuth, sellerDashboardController_1.getSellerProfileData);
router.put("/profile", sellerAuth, sellerDashboardController_1.updateSellerProfileData);
// Location Management
router.get("/location", sellerAuth, sellerDashboardController_1.getSellerLocationController);
router.put("/location", sellerAuth, sellerDashboardController_1.updateSellerLocationController);
// Deactivation Status Check
router.get("/deactivation-status", sellerAuth, sellerDashboardController_1.checkSellerDeactivationController);
// Flash Sales
router.get("/flash-sales", sellerAuth, sellerDashboardController_1.getSellerFlashSalesController);
router.post("/flash-sales", sellerAuth, sellerDashboardController_1.createFlashSaleController);
router.get("/flash-sales/:id", sellerAuth, sellerDashboardController_1.getFlashSaleByIdController);
router.delete("/flash-sales/:id", sellerAuth, sellerDashboardController_1.deleteFlashSaleController);
// Bulk Discounts
router.get("/bulk-discounts", sellerAuth, sellerDashboardController_1.getSellerBulkDiscountsController);
router.post("/bulk-discounts", sellerAuth, sellerDashboardController_1.createBulkDiscountController);
router.get("/bulk-discounts/:id", sellerAuth, sellerDashboardController_1.getBulkDiscountByIdController);
router.delete("/bulk-discounts/:id", sellerAuth, sellerDashboardController_1.deleteBulkDiscountController);
exports.default = router;
