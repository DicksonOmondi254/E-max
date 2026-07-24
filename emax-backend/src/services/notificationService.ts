import { prisma } from "../config/prisma";
import { NotificationType, NotificationTarget, Role } from "@prisma/client";

export interface CreateNotificationInput {
  title: string;
  message: string;
  type?: NotificationType;
  target: NotificationTarget;
  createdById: number;
}

export interface NotificationFilters {
  userId?: number;
  isRead?: boolean;
}

export const notificationService = {
  /**
   * Create a notification and distribute it to relevant users
   */
  async createNotification(input: CreateNotificationInput) {
    const notification = await prisma.notification.create({
      data: {
        title: input.title,
        message: input.message,
        type: input.type || "INFO",
        target: input.target,
        createdById: input.createdById,
      },
    });

    // Distribute to users based on target role
    let targetUsers: { id: number }[] = [];

    if (input.target === "ALL") {
      targetUsers = await prisma.user.findMany({
        where: { isVerified: true },
        select: { id: true },
      });
    } else if (input.target === "CUSTOMER") {
      targetUsers = await prisma.user.findMany({
        where: { role: "CUSTOMER", isVerified: true },
        select: { id: true },
      });
    } else if (input.target === "SELLER") {
      targetUsers = await prisma.user.findMany({
        where: { role: "SELLER", isVerified: true },
        select: { id: true },
      });
    } else if (input.target === "ADMIN") {
      targetUsers = await prisma.user.findMany({
        where: { OR: [{ role: "ADMIN" }, { role: "SUPER_ADMIN" }], isVerified: true },
        select: { id: true },
      });
    } else if (input.target === "SUPER_ADMIN") {
      targetUsers = await prisma.user.findMany({
        where: { role: "SUPER_ADMIN", isVerified: true },
        select: { id: true },
      });
    }

    // Create UserNotification entries for each target user
    if (targetUsers.length > 0) {
      await prisma.userNotification.createMany({
        data: targetUsers.map((user) => ({
          userId: user.id,
          notificationId: notification.id,
        })),
        skipDuplicates: true,
      });
    }

    return notification;
  },

  /**
   * Get all notifications for a specific user
   */
  async getUserNotifications(userId: number) {
    const userNotifications = await prisma.userNotification.findMany({
      where: { userId },
      include: {
        notification: {
          include: {
            createdBy: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: { notification: { createdAt: "desc" } },
    });

    return userNotifications.map((un: typeof userNotifications[0]) => ({
      id: un.notification.id,
      userNotificationId: un.id,
      title: un.notification.title,
      message: un.notification.message,
      type: un.notification.type,
      target: un.notification.target,
      createdBy: `${un.notification.createdBy.firstName} ${un.notification.createdBy.lastName}`,
      isRead: un.isRead,
      readAt: un.readAt,
      createdAt: un.notification.createdAt,
    }));
  },

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: number) {
    return prisma.userNotification.count({
      where: { userId, isRead: false },
    });
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(userId: number, notificationId: number) {
    return prisma.userNotification.updateMany({
      where: {
        userId,
        notificationId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: number) {
    return prisma.userNotification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  },

  /**
   * Get all notifications (admin view)
   */
  async getAllNotifications() {
    return prisma.notification.findMany({
      include: {
        createdBy: {
          select: { firstName: true, lastName: true, email: true },
        },
        _count: {
          select: { users: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: number) {
    return prisma.notification.delete({
      where: { id: notificationId },
    });
  },
};

