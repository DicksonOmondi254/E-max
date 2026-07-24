"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
// ─── Admin routes (create & manage notifications) ───
// Create a new notification (admin/super admin)
router.post("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), notificationController_1.createNotification);
// Get all notifications (admin view with delivery stats)
router.get("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), notificationController_1.getAllNotifications);
// Delete a notification (admin/super admin)
router.delete("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), notificationController_1.deleteNotification);
// ─── User routes (receive notifications) ───
// Get my notifications (for any authenticated user)
router.get("/me", authMiddleware_1.protect, notificationController_1.getMyNotifications);
// Mark single notification as read
router.patch("/:id/read", authMiddleware_1.protect, notificationController_1.markAsRead);
// Mark all notifications as read
router.patch("/read-all", authMiddleware_1.protect, notificationController_1.markAllAsRead);
exports.default = router;
