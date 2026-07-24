import api from "./api";

export interface NotificationData {
  id: number;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
  target: "ALL" | "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";
  createdById: number;
  createdBy?: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
  // User-specific fields
  isRead?: boolean;
  readAt?: string | null;
  // Admin stats
  _count?: {
    users: number;
  };
}

export interface CreateNotificationPayload {
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
  target: "ALL" | "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";
}

export const notificationService = {
  // Admin: Create a new notification
  async create(payload: CreateNotificationPayload): Promise<NotificationData> {
    const response = await api.post("/notifications", payload);
    return response.data.data;
  },

  // Admin: Get all notifications
  async getAll(): Promise<NotificationData[]> {
    const response = await api.get("/notifications");
    return response.data.data;
  },

  // Admin: Delete a notification
  async delete(id: number): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },

  // User: Get my notifications
  async getMyNotifications(): Promise<NotificationData[]> {
    const response = await api.get("/notifications/me");
    return response.data.data;
  },

  // User: Mark as read
  async markAsRead(id: number): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  // User: Mark all as read
  async markAllAsRead(): Promise<void> {
    await api.patch("/notifications/read-all");
  },
};

