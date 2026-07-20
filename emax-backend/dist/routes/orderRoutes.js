"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
/* =====================================================
   CUSTOMER ROUTES
===================================================== */
// Create a new order
router.post("/", authMiddleware_1.protect, orderController_1.createOrder);
// Get logged-in user's orders
router.get("/my-orders", authMiddleware_1.protect, orderController_1.getMyOrders);
// Get a single order
router.get("/:id", authMiddleware_1.protect, orderController_1.getOrder);
// Cancel own order
router.patch("/:id/cancel", authMiddleware_1.protect, orderController_1.cancelOrder);
/* =====================================================
   ADMIN ROUTES
===================================================== */
// Get all orders
router.get("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), orderController_1.getOrders);
// Update order status
router.patch("/:id/status", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), orderController_1.updateOrderStatus);
// Delete order
router.delete("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), orderController_1.deleteOrder);
exports.default = router;
