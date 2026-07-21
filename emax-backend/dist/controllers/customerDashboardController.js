"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMySettings = exports.getMyPaymentMethods = exports.getMyAddresses = exports.getMyWishlist = exports.getMyRecentOrders = exports.getMyDashboardOverview = void 0;
const prisma_1 = require("../config/prisma");
// Customer dashboard (scaffolded endpoints).
// These are intentionally lightweight: if the underlying data is missing,
// they return empty arrays/zero values (so the frontend is ready to serve).
const getMyDashboardOverview = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }
        const [ordersCount, wishlistCount] = await Promise.all([
            prisma_1.prisma.order.count({ where: { userId } }),
            prisma_1.prisma.wishlist.count({ where: { userId } }),
        ]);
        const deliveredTotal = await prisma_1.prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { userId, status: "DELIVERED" },
        });
        const totalAmount = deliveredTotal._sum.totalAmount ?? 0;
        const rewardPoints = Math.round(totalAmount / 100);
        return res.status(200).json({
            success: true,
            data: {
                ordersCount,
                wishlistCount,
                rewardPoints,
            },
        });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Failed to load customer dashboard overview.",
        });
    }
};
exports.getMyDashboardOverview = getMyDashboardOverview;
const getMyRecentOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }
        const orders = await prisma_1.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                items: {
                    include: {
                        product: { include: { brand: true } },
                    },
                },
            },
        });
        const mapped = orders.map((o) => {
            const firstItem = o.items[0];
            return {
                id: o.orderNumber,
                product: firstItem?.product?.name || "Order Item",
                status: o.status,
                total: o.totalAmount,
            };
        });
        return res.status(200).json({
            success: true,
            data: mapped,
        });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Failed to load recent orders.",
        });
    }
};
exports.getMyRecentOrders = getMyRecentOrders;
const getMyWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }
        const wishlist = await prisma_1.prisma.wishlist.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                brand: true,
                                category: true,
                                images: true,
                            },
                        },
                    },
                },
            },
        });
        const mapped = (wishlist?.items || []).map((wi) => ({
            id: wi.id,
            name: wi.product.name,
        }));
        return res.status(200).json({
            success: true,
            data: mapped,
        });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Failed to load wishlist.",
        });
    }
};
exports.getMyWishlist = getMyWishlist;
// Scaffolded endpoints for dashboard navigation.
// Current Prisma schema does not include these models.
const getMyAddresses = async (_req, res) => {
    return res.status(200).json({ success: true, data: [] });
};
exports.getMyAddresses = getMyAddresses;
const getMyPaymentMethods = async (_req, res) => {
    return res.status(200).json({ success: true, data: [] });
};
exports.getMyPaymentMethods = getMyPaymentMethods;
const getMySettings = async (_req, res) => {
    return res.status(200).json({ success: true, data: {} });
};
exports.getMySettings = getMySettings;
