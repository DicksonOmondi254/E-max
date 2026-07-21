"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shippingService = void 0;
const prisma_1 = require("../config/prisma");
exports.shippingService = {
    // ── Get All Shipping Zones ──
    async getAllZones() {
        return prisma_1.prisma.shippingZone.findMany({
            orderBy: { createdAt: "desc" },
        });
    },
    // ── Get Shipping Zone by ID ──
    async getZoneById(id) {
        const zone = await prisma_1.prisma.shippingZone.findUnique({
            where: { id },
        });
        if (!zone) {
            throw new Error("Shipping zone not found.");
        }
        return zone;
    },
    // ── Create Shipping Zone ──
    async createZone(data) {
        return prisma_1.prisma.shippingZone.create({
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
    async updateZone(id, data) {
        const zone = await prisma_1.prisma.shippingZone.findUnique({
            where: { id },
        });
        if (!zone) {
            throw new Error("Shipping zone not found.");
        }
        return prisma_1.prisma.shippingZone.update({
            where: { id },
            data,
        });
    },
    // ── Delete Shipping Zone ──
    async deleteZone(id) {
        const zone = await prisma_1.prisma.shippingZone.findUnique({
            where: { id },
        });
        if (!zone) {
            throw new Error("Shipping zone not found.");
        }
        return prisma_1.prisma.shippingZone.delete({
            where: { id },
        });
    },
    // ── Get Shipping Settings ──
    async getSettings() {
        let settings = await prisma_1.prisma.shippingSettings.findFirst();
        if (!settings) {
            settings = await prisma_1.prisma.shippingSettings.create({
                data: {
                    defaultFee: 350,
                    freeThreshold: 5000,
                },
            });
        }
        return settings;
    },
    // ── Update Shipping Settings ──
    async updateSettings(data) {
        let settings = await prisma_1.prisma.shippingSettings.findFirst();
        if (!settings) {
            settings = await prisma_1.prisma.shippingSettings.create({
                data: {
                    defaultFee: data.defaultFee ?? 350,
                    freeThreshold: data.freeThreshold ?? 5000,
                },
            });
        }
        else {
            settings = await prisma_1.prisma.shippingSettings.update({
                where: { id: settings.id },
                data,
            });
        }
        return settings;
    },
};
