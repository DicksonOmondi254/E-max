import api from "./api";

export interface StoreSettings {
  id: number;
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  currency: string;
  timezone: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  darkMode: boolean;
  paymentMethods: string; // JSON string
  notifications: string;  // JSON string
  metaTitle: string;
  metaDescription: string;
  googleAnalyticsId: string;
  maintenanceMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStoreSettingsPayload {
  storeName?: string;
  tagline?: string;
  supportEmail?: string;
  supportPhone?: string;
  address?: string;
  currency?: string;
  timezone?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  darkMode?: boolean;
  paymentMethods?: string;
  notifications?: string;
  metaTitle?: string;
  metaDescription?: string;
  googleAnalyticsId?: string;
  maintenanceMode?: boolean;
}

export const storeSettingsService = {
  // ── Get Store Settings ──
  async getSettings(): Promise<StoreSettings> {
    const response = await api.get("/store-settings");
    return response.data.data;
  },

  // ── Update Store Settings ──
  async updateSettings(data: UpdateStoreSettingsPayload): Promise<StoreSettings> {
    const response = await api.put("/store-settings", data);
    return response.data.data;
  },
};

