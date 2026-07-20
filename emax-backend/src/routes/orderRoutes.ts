import { Router } from "express";

import {
  createOrder,
  getOrders,
  getOrder,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
} from "../controllers/orderController";

import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = Router();

/* =====================================================
   CUSTOMER ROUTES
===================================================== */

// Create a new order
router.post("/", protect, createOrder);

// Get logged-in user's orders
router.get("/my-orders", protect, getMyOrders);

// Get a single order
router.get("/:id", protect, getOrder);

// Cancel own order
router.patch("/:id/cancel", protect, cancelOrder);

/* =====================================================
   ADMIN ROUTES
===================================================== */

// Get all orders
router.get(
  "/",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  getOrders
);

// Update order status
router.patch(
  "/:id/status",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  updateOrderStatus
);

// Delete order
router.delete(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  deleteOrder
);

export default router;