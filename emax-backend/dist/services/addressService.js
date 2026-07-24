"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressService = void 0;
const prisma_1 = require("../config/prisma");
exports.addressService = {
    // ── Get all addresses for a user ──
    async getAllByUser(userId) {
        return prisma_1.prisma.customerAddress.findMany({
            where: { userId },
            orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        });
    },
    // ── Get single address ──
    async getById(id, userId) {
        const address = await prisma_1.prisma.customerAddress.findFirst({
            where: { id, userId },
        });
        if (!address)
            throw new Error("Address not found.");
        return address;
    },
    // ── Create address ──
    async create(userId, data) {
        // If this is the first address or marked as default, unset other defaults
        if (data.isDefault) {
            await prisma_1.prisma.customerAddress.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        // If this is the first address, make it default automatically
        const existingCount = await prisma_1.prisma.customerAddress.count({ where: { userId } });
        const makeDefault = existingCount === 0 ? true : data.isDefault ?? false;
        return prisma_1.prisma.customerAddress.create({
            data: {
                label: data.label || "Home",
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                county: data.county,
                town: data.town,
                address: data.address,
                landmark: data.landmark || null,
                isDefault: makeDefault,
                userId,
            },
        });
    },
    // ── Update address ──
    async update(id, userId, data) {
        const existing = await prisma_1.prisma.customerAddress.findFirst({
            where: { id, userId },
        });
        if (!existing)
            throw new Error("Address not found.");
        // If setting as default, unset others
        if (data.isDefault) {
            await prisma_1.prisma.customerAddress.updateMany({
                where: { userId, id: { not: id } },
                data: { isDefault: false },
            });
        }
        return prisma_1.prisma.customerAddress.update({
            where: { id },
            data: {
                ...(data.label !== undefined && { label: data.label }),
                ...(data.firstName !== undefined && { firstName: data.firstName }),
                ...(data.lastName !== undefined && { lastName: data.lastName }),
                ...(data.phone !== undefined && { phone: data.phone }),
                ...(data.county !== undefined && { county: data.county }),
                ...(data.town !== undefined && { town: data.town }),
                ...(data.address !== undefined && { address: data.address }),
                ...(data.landmark !== undefined && { landmark: data.landmark || null }),
                ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
            },
        });
    },
    // ── Set default address ──
    async setDefault(id, userId) {
        const existing = await prisma_1.prisma.customerAddress.findFirst({
            where: { id, userId },
        });
        if (!existing)
            throw new Error("Address not found.");
        // Unset all defaults for this user
        await prisma_1.prisma.customerAddress.updateMany({
            where: { userId },
            data: { isDefault: false },
        });
        // Set the chosen one
        return prisma_1.prisma.customerAddress.update({
            where: { id },
            data: { isDefault: true },
        });
    },
    // ── Delete address ──
    async delete(id, userId) {
        const existing = await prisma_1.prisma.customerAddress.findFirst({
            where: { id, userId },
        });
        if (!existing)
            throw new Error("Address not found.");
        await prisma_1.prisma.customerAddress.delete({ where: { id } });
        // If we deleted the default, assign default to the next most recent
        if (existing.isDefault) {
            const nextAddress = await prisma_1.prisma.customerAddress.findFirst({
                where: { userId },
                orderBy: { createdAt: "desc" },
            });
            if (nextAddress) {
                await prisma_1.prisma.customerAddress.update({
                    where: { id: nextAddress.id },
                    data: { isDefault: true },
                });
            }
        }
        return { message: "Address deleted successfully." };
    },
};
