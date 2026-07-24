import api from "./api";

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  notifications: string;
  language: string;
  currency: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  notifications?: string;
  language?: string;
  currency?: string;
  timezone?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const customerProfileService = {
  // ── Get Current User Profile ──
  async getProfile(): Promise<UserProfile> {
    const response = await api.get("/profile");
    return response.data.data;
  },

  // ── Update Profile ──
  async updateProfile(data: UpdateProfilePayload): Promise<UserProfile> {
    const response = await api.put("/profile", data);
    return response.data.data;
  },

  // ── Change Password ──
  async changePassword(data: ChangePasswordPayload): Promise<{ message: string }> {
    const response = await api.put("/profile/change-password", data);
    return response.data;
  },
};

