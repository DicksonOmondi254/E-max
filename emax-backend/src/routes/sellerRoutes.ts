import { Router } from "express";
import {
  getSellerStats,
  getSellerProductsList,
  getSellerOrdersList,
  updateOrderStatus,
  getSellerEarningsList,
  getSellerReturnsList,
  getSellerReviewsList,
  getSellerPerformanceData,
  getSellerProfileData,
  updateSellerProfileData,
  createFlashSaleController,
  getSellerFlashSalesController,
  getFlashSaleByIdController,
  deleteFlashSaleController,
  createBulkDiscountController,
  getSellerBulkDiscountsController,
  getBulkDiscountByIdController,
  deleteBulkDiscountController,
  getSellerLocationController,
  updateSellerLocationController,
  checkSellerDeactivationController,
} from "../controllers/sellerDashboardController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = Router();

// All seller routes require authentication and seller/admin role
const sellerAuth = [protect, authorize("SELLER", "ADMIN", "SUPER_ADMIN")];

// Dashboard
router.get("/dashboard", sellerAuth, getSellerStats);

// Products
router.get("/products", sellerAuth, getSellerProductsList);

// Orders
router.get("/orders", sellerAuth, getSellerOrdersList);
router.patch("/orders/:id/status", sellerAuth, updateOrderStatus);

// Earnings / Finance
router.get("/earnings", sellerAuth, getSellerEarningsList);

// Returns
router.get("/returns", sellerAuth, getSellerReturnsList);

// Reviews
router.get("/reviews", sellerAuth, getSellerReviewsList);

// Performance
router.get("/performance", sellerAuth, getSellerPerformanceData);

// Profile / Settings
router.get("/profile", sellerAuth, getSellerProfileData);
router.put("/profile", sellerAuth, updateSellerProfileData);

// Location Management
router.get("/location", sellerAuth, getSellerLocationController);
router.put("/location", sellerAuth, updateSellerLocationController);

// Deactivation Status Check
router.get("/deactivation-status", sellerAuth, checkSellerDeactivationController);

// Flash Sales
router.get("/flash-sales", sellerAuth, getSellerFlashSalesController);
router.post("/flash-sales", sellerAuth, createFlashSaleController);
router.get("/flash-sales/:id", sellerAuth, getFlashSaleByIdController);
router.delete("/flash-sales/:id", sellerAuth, deleteFlashSaleController);

// Bulk Discounts
router.get("/bulk-discounts", sellerAuth, getSellerBulkDiscountsController);
router.post("/bulk-discounts", sellerAuth, createBulkDiscountController);
router.get("/bulk-discounts/:id", sellerAuth, getBulkDiscountByIdController);
router.delete("/bulk-discounts/:id", sellerAuth, deleteBulkDiscountController);

export default router;

