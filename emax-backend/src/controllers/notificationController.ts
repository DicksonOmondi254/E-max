import { Request, Response } from "express";
import { notificationService } from "../services/notificationService";

/**
 * Create a new notification (Admin/Super Admin)
 */
export const createNotification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const { title, message, type, target } = req.body;

    if (!title || !message || !target) {
      return res.status(400).json({
        success: false,
        message: "Title, message, and target are required.",
      });
    }

    const notification = await notificationService.createNotification({
      title,
      message,
      type,
      target,
      createdById: userId,
    });

    return res.status(201).json({
      success: true,
      data: notification,
      message: "Notification created and sent to users.",
    });
  } catch (e) {
    console.error("Create notification error:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to create notification.",
    });
  }
};

/**
 * Get notifications for the authenticated user
 */
export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const notifications = await notificationService.getUserNotifications(userId);

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (e) {
    console.error("Get notifications error:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const count = await notificationService.getUnreadCount(userId);

    return res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (e) {
    console.error("Get unread count error:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to get unread count.",
    });
  }
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const notificationId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    if (isNaN(notificationId)) {
      return res.status(400).json({ success: false, message: "Invalid notification ID." });
    }

    await notificationService.markAsRead(userId, notificationId);

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
    });
  } catch (e) {
    console.error("Mark as read error:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read.",
    });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    await notificationService.markAllAsRead(userId);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
    });
  } catch (e) {
    console.error("Mark all as read error:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to mark all as read.",
    });
  }
};

/**
 * Get all notifications (Admin view)
 */
export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await notificationService.getAllNotifications();

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (e) {
    console.error("Get all notifications error:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

/**
 * Delete a notification (Admin)
 */
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const notificationId = Number(req.params.id);

    if (isNaN(notificationId)) {
      return res.status(400).json({ success: false, message: "Invalid notification ID." });
    }

    await notificationService.deleteNotification(notificationId);

    return res.status(200).json({
      success: true,
      message: "Notification deleted.",
    });
  } catch (e) {
    console.error("Delete notification error:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification.",
    });
  }
};
