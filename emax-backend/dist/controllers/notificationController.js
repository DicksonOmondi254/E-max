"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.getAllNotifications = exports.markAllAsRead = exports.markAsRead = exports.getUnreadCount = exports.getMyNotifications = exports.createNotification = void 0;
const notificationService_1 = require("../services/notificationService");
/**
 * Create a new notification (Admin/Super Admin)
 */
const createNotification = async (req, res) => {
    try {
        const userId = req.user?.id;
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
        const notification = await notificationService_1.notificationService.createNotification({
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
    }
    catch (e) {
        console.error("Create notification error:", e);
        return res.status(500).json({
            success: false,
            message: "Failed to create notification.",
        });
    }
};
exports.createNotification = createNotification;
/**
 * Get notifications for the authenticated user
 */
const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        const notifications = await notificationService_1.notificationService.getUserNotifications(userId);
        return res.status(200).json({
            success: true,
            data: notifications,
        });
    }
    catch (e) {
        console.error("Get notifications error:", e);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications.",
        });
    }
};
exports.getMyNotifications = getMyNotifications;
/**
 * Get unread notification count
 */
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        const count = await notificationService_1.notificationService.getUnreadCount(userId);
        return res.status(200).json({
            success: true,
            data: { count },
        });
    }
    catch (e) {
        console.error("Get unread count error:", e);
        return res.status(500).json({
            success: false,
            message: "Failed to get unread count.",
        });
    }
};
exports.getUnreadCount = getUnreadCount;
/**
 * Mark a notification as read
 */
const markAsRead = async (req, res) => {
    try {
        const userId = req.user?.id;
        const notificationId = Number(req.params.id);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        if (isNaN(notificationId)) {
            return res.status(400).json({ success: false, message: "Invalid notification ID." });
        }
        await notificationService_1.notificationService.markAsRead(userId, notificationId);
        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
        });
    }
    catch (e) {
        console.error("Mark as read error:", e);
        return res.status(500).json({
            success: false,
            message: "Failed to mark notification as read.",
        });
    }
};
exports.markAsRead = markAsRead;
/**
 * Mark all notifications as read
 */
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        await notificationService_1.notificationService.markAllAsRead(userId);
        return res.status(200).json({
            success: true,
            message: "All notifications marked as read.",
        });
    }
    catch (e) {
        console.error("Mark all as read error:", e);
        return res.status(500).json({
            success: false,
            message: "Failed to mark all as read.",
        });
    }
};
exports.markAllAsRead = markAllAsRead;
/**
 * Get all notifications (Admin view)
 */
const getAllNotifications = async (req, res) => {
    try {
        const notifications = await notificationService_1.notificationService.getAllNotifications();
        return res.status(200).json({
            success: true,
            data: notifications,
        });
    }
    catch (e) {
        console.error("Get all notifications error:", e);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications.",
        });
    }
};
exports.getAllNotifications = getAllNotifications;
/**
 * Delete a notification (Admin)
 */
const deleteNotification = async (req, res) => {
    try {
        const notificationId = Number(req.params.id);
        if (isNaN(notificationId)) {
            return res.status(400).json({ success: false, message: "Invalid notification ID." });
        }
        await notificationService_1.notificationService.deleteNotification(notificationId);
        return res.status(200).json({
            success: true,
            message: "Notification deleted.",
        });
    }
    catch (e) {
        console.error("Delete notification error:", e);
        return res.status(500).json({
            success: false,
            message: "Failed to delete notification.",
        });
    }
};
exports.deleteNotification = deleteNotification;
