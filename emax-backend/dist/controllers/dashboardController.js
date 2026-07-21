"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyWishlist = exports.getMyRecentOrders = exports.getMyDashboardOverview = exports.getDashboardStats = void 0;
const prisma_1 = require("../config/prisma");
const getDashboardStats = async (req, res) => {
    try {
        const [products, categories, brands, customers, featuredProducts, reviews, totalOrders, pendingOrders, deliveredOrders, revenueAgg,] = await Promise.all([
            prisma_1.prisma.product.count(),
            prisma_1.prisma.category.count(),
            prisma_1.prisma.brand.count(),
            prisma_1.prisma.user.count({
                where: {
                    role: "CUSTOMER",
                },
            }),
            prisma_1.prisma.product.count({
                where: {
                    featured: true,
                },
            }),
            prisma_1.prisma.productReview.count(),
            prisma_1.prisma.order.count(),
            prisma_1.prisma.order.count({
                where: { status: "PENDING" },
            }),
            prisma_1.prisma.order.count({
                where: { status: "DELIVERED" },
            }),
            prisma_1.prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { status: { not: "CANCELLED" } },
            }),
        ]);
        const recentOrders = await prisma_1.prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                items: {
                    take: 1,
                    include: {
                        product: {
                            select: { name: true },
                        },
                    },
                },
            },
        });
        const mappedRecentOrders = recentOrders.map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            totalAmount: o.totalAmount,
            status: o.status,
            paymentStatus: o.paymentStatus,
            customerName: `${o.user.firstName} ${o.user.lastName}`,
            customerEmail: o.user.email,
            productName: o.items[0]?.product?.name || "Order",
            createdAt: o.createdAt,
        }));
        res.status(200).json({
            success: true,
            data: {
                products,
                categories,
                brands,
                customers,
                featuredProducts,
                reviews,
                orders: totalOrders,
                pendingOrders,
                deliveredOrders,
                revenue: revenueAgg._sum.totalAmount || 0,
                recentOrders: mappedRecentOrders,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to load dashboard statistics.",
        });
    }
};
exports.getDashboardStats = getDashboardStats;
// =====================================================
// Customer Dashboard (real data from DB)
// =====================================================
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
        // No reward points/coupons model exists in schema yet.
        // Keep UI stable by returning a realistic derived placeholder.
        // (Derived from delivered orders total, rounded.)
        const deliveredOrdersTotal = await prisma_1.prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { userId, status: "DELIVERED" },
        });
        const totalAmount = deliveredOrdersTotal._sum.totalAmount || 0;
        const rewardPoints = Math.round(totalAmount / 100); // 1 point per 100 KES (derived)
        res.status(200).json({
            success: true,
            data: {
                ordersCount,
                wishlistCount,
                rewardPoints,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
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
                        product: {
                            include: { brand: true },
                        },
                    },
                },
            },
        });
        // Convert to the shape the existing UI expects.
        const mapped = orders.map((o) => {
            const firstItem = o.items[0];
            return {
                id: o.orderNumber,
                product: firstItem?.product?.name || "Order Item",
                status: o.status,
                total: o.totalAmount,
            };
        });
        res.status(200).json({
            success: true,
            data: mapped,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
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
        res.status(200).json({
            success: true,
            data: mapped,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to load wishlist.",
        });
    }
};
exports.getMyWishlist = getMyWishlist;
