"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
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
// NOTE: Customer dashboard endpoints have been moved to
// routes/dashboardCustomerRoutes.ts and controllers/customerDashboardController.ts
// to enforce strict multi-tenant isolation with role-based access.
// Only CUSTOMER role users can access those endpoints.
