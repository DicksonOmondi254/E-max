import api from "./api";

export interface ShippingZone {
  id: number;
  name: string;
  regions: string;
  fee: number;
  estimatedDays: string;
  zoneType: "LOCAL" | "REGIONAL" | "INTERNATIONAL";
  status: "ACTIVE" | "INACTIVE";
  freeThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingSettings {
  id: number;
  defaultFee: number;
  freeThreshold: number;
}

export interface CreateShippingZonePayload {
  name: string;
  regions: string;
  fee: number;
  estimatedDays: string;
  zoneType?: "LOCAL" | "REGIONAL" | "INTERNATIONAL";
  status?: "ACTIVE" | "INACTIVE";
  freeThreshold?: number;
}

export interface UpdateShippingZonePayload {
  name?: string;
  regions?: string;
  fee?: number;
  estimatedDays?: string;
  zoneType?: "LOCAL" | "REGIONAL" | "INTERNATIONAL";
  status?: "ACTIVE" | "INACTIVE";
  freeThreshold?: number;
}

export const shippingService = {
  // ── Get All Shipping Zones ──
  async getAllZones(): Promise<ShippingZone[]> {
    const response = await api.get("/shipping/zones");
    return response.data.data;
  },

  // ── Get Shipping Zone by ID ──
  async getZoneById(id: number): Promise<ShippingZone> {
    const response = await api.get(`/shipping/zones/${id}`);
    return response.data.data;
  },

  // ── Create Shipping Zone ──
  async createZone(data: CreateShippingZonePayload): Promise<ShippingZone> {
    const response = await api.post("/shipping/zones", data);
    return response.data.data;
  },

  // ── Update Shipping Zone ──
  async updateZone(id: number, data: UpdateShippingZonePayload): Promise<ShippingZone> {
    const response = await api.put(`/shipping/zones/${id}`, data);
    return response.data.data;
  },

  // ── Delete Shipping Zone ──
  async deleteZone(id: number): Promise<void> {
    await api.delete(`/shipping/zones/${id}`);
  },

  // ── Get Shipping Settings ──
  async getSettings(): Promise<ShippingSettings> {
    const response = await api.get("/shipping/settings");
    return response.data.data;
  },

  // ── Update Shipping Settings ──
  async updateSettings(data: { defaultFee?: number; freeThreshold?: number }): Promise<ShippingSettings> {
    const response = await api.put("/shipping/settings", data);
    return response.data.data;
  },
};

