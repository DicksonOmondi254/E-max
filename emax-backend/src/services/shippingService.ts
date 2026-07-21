import { prisma } from "../config/prisma";

export interface CreateShippingZoneInput {
  name: string;
  regions: string;
  fee: number;
  estimatedDays: string;
  zoneType?: "LOCAL" | "REGIONAL" | "INTERNATIONAL";
  status?: "ACTIVE" | "INACTIVE";
  freeThreshold?: number;
}

export interface UpdateShippingZoneInput {
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
  async getAllZones() {
    return prisma.shippingZone.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  // ── Get Shipping Zone by ID ──
  async getZoneById(id: number) {
    const zone = await prisma.shippingZone.findUnique({
      where: { id },
    });
    if (!zone) {
      throw new Error("Shipping zone not found.");
    }
    return zone;
  },

  // ── Create Shipping Zone ──
  async createZone(data: CreateShippingZoneInput) {
    return prisma.shippingZone.create({
      data: {
        name: data.name,
        regions: data.regions,
        fee: data.fee,
        estimatedDays: data.estimatedDays,
        zoneType: data.zoneType || "LOCAL",
        status: data.status || "ACTIVE",
        freeThreshold: data.freeThreshold || 0,
      },
    });
  },

  // ── Update Shipping Zone ──
  async updateZone(id: number, data: UpdateShippingZoneInput) {
    const zone = await prisma.shippingZone.findUnique({
      where: { id },
    });
    if (!zone) {
      throw new Error("Shipping zone not found.");
    }
    return prisma.shippingZone.update({
      where: { id },
      data,
    });
  },

  // ── Delete Shipping Zone ──
  async deleteZone(id: number) {
    const zone = await prisma.shippingZone.findUnique({
      where: { id },
    });
    if (!zone) {
      throw new Error("Shipping zone not found.");
    }
    return prisma.shippingZone.delete({
      where: { id },
    });
  },

  // ── Get Shipping Settings ──
  async getSettings() {
    let settings = await prisma.shippingSettings.findFirst();
    if (!settings) {
      settings = await prisma.shippingSettings.create({
        data: {
          defaultFee: 350,
          freeThreshold: 5000,
        },
      });
    }
    return settings;
  },

  // ── Update Shipping Settings ──
  async updateSettings(data: { defaultFee?: number; freeThreshold?: number }) {
    let settings = await prisma.shippingSettings.findFirst();
    if (!settings) {
      settings = await prisma.shippingSettings.create({
        data: {
          defaultFee: data.defaultFee ?? 350,
          freeThreshold: data.freeThreshold ?? 5000,
        },
      });
    } else {
      settings = await prisma.shippingSettings.update({
        where: { id: settings.id },
        data,
      });
    }
    return settings;
  },
};

