"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMySettings = exports.getMyPaymentMethods = exports.getMyAddresses = exports.getMyNotifications = exports.removeMyWishlistItem = exports.getMyWishlist = exports.getMyRecentOrders = exports.getMyDashboardOverview = void 0;
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
        const [ordersCount, wishlistCount, couponsCount] = await Promise.all([
            prisma_1.prisma.order.count({ where: { userId } }),
            prisma_1.prisma.wishlist.count({ where: { userId } }),
            prisma_1.prisma.coupon.count({
                where: {
                    isActive: true,
                    AND: [
                        { OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }] },
                    ],
                },
            }),
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
                couponsCount,
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
            productId: wi.product.id,
            name: wi.product.name,
            price: wi.product.price,
            slug: wi.product.slug,
            image: wi.product.images?.[0]?.image || wi.product.thumbnail || null,
            brand: wi.product.brand?.name || null,
            stock: wi.product.stock,
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
const removeMyWishlistItem = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }
        const productId = Number(req.params.productId);
        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID.",
            });
        }
        const wishlist = await prisma_1.prisma.wishlist.findUnique({
            where: { userId },
        });
        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found.",
            });
        }
        await prisma_1.prisma.wishlistItem.delete({
            where: {
                wishlistId_productId: {
                    wishlistId: wishlist.id,
                    productId,
                },
            },
        });
        return res.status(200).json({
            success: true,
            message: "Item removed from wishlist.",
        });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Failed to remove item from wishlist.",
        });
    }
};
exports.removeMyWishlistItem = removeMyWishlistItem;
// Real-time notifications generated from actual user data
const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }
        const [recentOrders, wishlistItems, user] = await Promise.all([
            prisma_1.prisma.order.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                take: 3,
            }),
            prisma_1.prisma.wishlist.findUnique({
                where: { userId },
                include: { items: { take: 3, include: { product: true } } },
            }),
            prisma_1.prisma.user.findUnique({ where: { id: userId } }),
        ]);
        const notifications = [];
        // Order-based notifications
        const deliveredOrders = recentOrders.filter((o) => o.status === "DELIVERED");
        if (deliveredOrders.length > 0) {
            notifications.push({
                id: 1,
                type: "success",
                message: `Order #${deliveredOrders[0].orderNumber} has been delivered successfully!`,
                time: "Recent",
            });
        }
        const processingOrders = recentOrders.filter((o) => o.status === "PROCESSING");
        if (processingOrders.length > 0) {
            notifications.push({
                id: 2,
                type: "info",
                message: `Order #${processingOrders[0].orderNumber} is being processed.`,
                time: "Recent",
            });
        }
        const shippedOrders = recentOrders.filter((o) => o.status === "SHIPPED");
        if (shippedOrders.length > 0) {
            notifications.push({
                id: 3,
                type: "info",
                message: `Order #${shippedOrders[0].orderNumber} has been shipped!`,
                time: "Recent",
            });
        }
        // Wishlist notifications
        const wishlistCount = wishlistItems?.items?.length || 0;
        if (wishlistCount > 0) {
            notifications.push({
                id: 4,
                type: "warning",
                message: `You have ${wishlistCount} item${wishlistCount > 1 ? "s" : ""} in your wishlist waiting for you.`,
                time: "Today",
            });
        }
        // Account notification
        if (!user?.isVerified) {
            notifications.push({
                id: 5,
                type: "warning",
                message: "Please verify your email address to unlock all features.",
                time: "Pending",
            });
        }
        // Coupon notification
        const activeCoupons = await prisma_1.prisma.coupon.count({
            where: { isActive: true, expiresAt: { gte: new Date() } },
        });
        if (activeCoupons > 0) {
            notifications.push({
                id: 6,
                type: "info",
                message: `There ${activeCoupons > 1 ? "are" : "is"} ${activeCoupons} active coupon${activeCoupons > 1 ? "s" : ""} available for you.`,
                time: "Today",
            });
        }
        // Default welcome notification if nothing else
        if (notifications.length === 0) {
            notifications.push({
                id: 7,
                type: "info",
                message: "Welcome to your dashboard! Start exploring products and deals.",
                time: "Just now",
            });
        }
        return res.status(200).json({
            success: true,
            data: notifications,
        });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Failed to load notifications.",
        });
    }
};
exports.getMyNotifications = getMyNotifications;
// Scaffolded endpoints for dashboard navigation.
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
