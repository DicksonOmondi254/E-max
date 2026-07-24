import { Router } from "express";
import {
  createNotification,
  getAllNotifications,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = Router();

// ─── Admin routes (create & manage notifications) ───

// Create a new notification (admin/super admin)
router.post(
  "/",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  createNotification
);

// Get all notifications (admin view with delivery stats)
router.get(
  "/",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  getAllNotifications
);

// Delete a notification (admin/super admin)
router.delete(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  deleteNotification
);

// ─── User routes (receive notifications) ───

// Get my notifications (for any authenticated user)
router.get(
  "/me",
  protect,
  getMyNotifications
);

// Mark single notification as read
router.patch(
  "/:id/read",
  protect,
  markAsRead
);

// Mark all notifications as read
router.patch(
  "/read-all",
  protect,
  markAllAsRead
);

export default router;

