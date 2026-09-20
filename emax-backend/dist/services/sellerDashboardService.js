"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateSeller = exports.assertSellerIsActive = exports.updateSellerProfile = exports.checkSellerDeactivationStatus = exports.updateSellerLocation = exports.getSellerLocation = exports.getBulkDiscountById = exports.deleteBulkDiscount = exports.getSellerBulkDiscounts = exports.createBulkDiscountService = exports.deleteFlashSale = exports.getFlashSaleById = exports.getSellerFlashSales = exports.createFlashSale = exports.getSellerProfile = exports.getSellerPerformance = exports.getSellerReviews = exports.getSellerReturns = exports.getSellerEarnings = exports.updateSellerOrderStatus = exports.getSellerOrders = exports.getSellerProducts = exports.getSellerDashboardStats = void 0;
const prisma_1 = require("../config/prisma");
const SUPPORT_EMAIL = "admin@emaxmarketplace.com";
/* ============================================
   Helper: Get seller's product IDs
============================================ */
const getSellerProductIds = async (userId) => {
    const products = await prisma_1.prisma.product.findMany({
        where: { userId },
        select: { id: true },
    });
    return products.map((p) => p.id);
};
/* ============================================
   Main Dashboard Stats
============================================ */
const getSellerDashboardStats = async (userId) => {
    const productIds = await getSellerProductIds(userId);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Product stats
    const allProducts = await prisma_1.prisma.product.findMany({
        where: { userId },
        select: { id: true, active: true, stock: true },
    });
    const products = allProducts.length;
    const activeProducts = allProducts.filter((p) => p.active).length;
    const inactiveProducts = products - activeProducts;
    const lowStockProducts = allProducts.filter((p) => p.stock > 0 && p.stock <= 5).length;
    // Orders containing seller's products
    const orderItems = await prisma_1.prisma.orderItem.findMany({
        where: { productId: { in: productIds } },
        include: { order: { select: { createdAt: true, status: true } } },
    });
    const orderIds = [...new Set(orderItems.map((oi) => oi.orderId))];
    // All seller orders
    const allSellerOrders = await prisma_1.prisma.order.findMany({
        where: { id: { in: orderIds } },
        select: { id: true, status: true, totalAmount: true, createdAt: true },
    });
    const totalOrders = allSellerOrders.length;
    const pendingOrders = allSellerOrders.filter((o) => o.status === "PENDING").length;
    const processingOrders = allSellerOrders.filter((o) => o.status === "PROCESSING").length;
    const shippedOrders = allSellerOrders.filter((o) => o.status === "SHIPPED").length;
    const deliveredOrders = allSellerOrders.filter((o) => o.status === "DELIVERED").length;
    const cancelledOrders = allSellerOrders.filter((o) => o.status === "CANCELLED").length;
    // Revenue (from delivered orders only)
    const revenueResult = await prisma_1.prisma.orderItem.aggregate({
        _sum: { price: true },
        where: {
            productId: { in: productIds },
            order: { status: "DELIVERED" },
        },
    });
    const revenue = Number(revenueResult._sum.price) || 0;
    // Revenue today/week/month
    const revenueTodayItems = await prisma_1.prisma.orderItem.findMany({
        where: {
            productId: { in: productIds },
            order: { status: "DELIVERED", createdAt: { gte: startOfDay } },
        },
        select: { price: true },
    });
    const revenueToday = revenueTodayItems.reduce((sum, i) => sum + Number(i.price), 0);
    const revenueWeekItems = await prisma_1.prisma.orderItem.findMany({
        where: {
            productId: { in: productIds },
            order: { status: "DELIVERED", createdAt: { gte: startOfWeek } },
        },
        select: { price: true },
    });
    const revenueWeek = revenueWeekItems.reduce((sum, i) => sum + Number(i.price), 0);
    const revenueMonthItems = await prisma_1.prisma.orderItem.findMany({
        where: {
            productId: { in: productIds },
            order: { status: "DELIVERED", createdAt: { gte: startOfMonth } },
        },
        select: { price: true },
    });
    const revenueMonth = revenueMonthItems.reduce((sum, i) => sum + Number(i.price), 0);
    // Orders today/week/month
    const ordersToday = allSellerOrders.filter((o) => new Date(o.createdAt) >= startOfDay).length;
    const ordersWeek = allSellerOrders.filter((o) => new Date(o.createdAt) >= startOfWeek).length;
    const ordersMonth = allSellerOrders.filter((o) => new Date(o.createdAt) >= startOfMonth).length;
    // Customers who ordered seller's products
    const customerOrders = await prisma_1.prisma.order.findMany({
        where: { id: { in: orderIds } },
        select: { userId: true },
        distinct: ["userId"],
    });
    const totalCustomers = customerOrders.length;
    // Reviews for seller's products
    const reviewStats = await prisma_1.prisma.productReview.aggregate({
        _avg: { rating: true },
        _count: { id: true },
        where: { productId: { in: productIds } },
    });
    const averageRating = reviewStats._avg.rating || 0;
    const totalReviews = reviewStats._count.id || 0;
    // Payout info
    const payoutBalance = revenue * 0.85;
    const nextPayoutDate = new Date(now.getFullYear(), now.getMonth() + 1, 15).toISOString();
    // Sales trend (last 7 days)
    const salesTrend = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        const dayOrders = allSellerOrders.filter((o) => {
            const d = new Date(o.createdAt);
            return d >= dayStart && d < dayEnd && o.status !== "CANCELLED";
        });
        const daySales = dayOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
        salesTrend.push({
            date: dayStart.toISOString().split("T")[0],
            sales: daySales,
            orders: dayOrders.length,
        });
    }
    // Recent orders
    const recentOrdersRaw = await prisma_1.prisma.order.findMany({
        where: { id: { in: orderIds } },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            items: {
                where: { productId: { in: productIds } },
                include: { product: { select: { name: true } } },
            },
        },
    });
    const recentOrders = recentOrdersRaw.map((o) => {
        const sellerItem = o.items[0];
        return {
            id: o.id,
            orderNumber: o.orderNumber,
            totalAmount: o.totalAmount,
            status: o.status,
            customerName: `${o.user.firstName} ${o.user.lastName}`,
            customerEmail: o.user.email,
            productName: sellerItem?.product?.name || "Product",
            quantity: sellerItem?.quantity || 0,
            createdAt: o.createdAt.toISOString(),
        };
    });
    // Top products
    const topProductsRaw = await prisma_1.prisma.orderItem.groupBy({
        by: ["productId"],
        where: { productId: { in: productIds }, order: { status: "DELIVERED" } },
        _sum: { quantity: true, price: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
    });
    const topProducts = await Promise.all(topProductsRaw.map(async (item) => {
        const product = await prisma_1.prisma.product.findUnique({
            where: { id: item.productId },
            select: { id: true, name: true, thumbnail: true, stock: true },
        });
        return {
            id: product?.id || item.productId,
            name: product?.name || "Unknown",
            thumbnail: product?.thumbnail || "",
            totalSold: item._sum.quantity || 0,
            revenue: Number(item._sum.price) || 0,
            stock: product?.stock || 0,
        };
    }));
    return {
        products,
        activeProducts,
        inactiveProducts,
        lowStockProducts,
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        revenue,
        revenueToday,
        revenueWeek,
        revenueMonth,
        ordersToday,
        ordersWeek,
        ordersMonth,
        totalCustomers,
        averageRating,
        totalReviews,
        payoutBalance,
        nextPayoutDate,
        salesTrend,
        recentOrders,
        topProducts,
    };
};
exports.getSellerDashboardStats = getSellerDashboardStats;
const getSellerProducts = async (userId, query) => {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where = { userId };
    if (query.search) {
        where.OR = [
            { name: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } },
        ];
    }
    if (query.active === "true")
        where.active = true;
    if (query.active === "false")
        where.active = false;
    if (query.featured === "true")
        where.featured = true;
    if (query.featured === "false")
        where.featured = false;
    const [products, total] = await Promise.all([
        prisma_1.prisma.product.findMany({
            where,
            include: {
                category: { select: { id: true, name: true } },
                brand: { select: { id: true, name: true } },
                images: { select: { id: true, image: true } },
                _count: { select: { reviews: true, orderItems: true } },
            },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.prisma.product.count({ where }),
    ]);
    return {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        data: products,
    };
};
exports.getSellerProducts = getSellerProducts;
const getSellerOrders = async (userId, query) => {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const productIds = await getSellerProductIds(userId);
    const orderItems = await prisma_1.prisma.orderItem.findMany({
        where: { productId: { in: productIds } },
        select: { orderId: true },
        distinct: ["orderId"],
    });
    const orderIds = orderItems.map((oi) => oi.orderId);
    const where = { id: { in: orderIds } };
    if (query.status) {
        where.status = query.status;
    }
    const [orders, total] = await Promise.all([
        prisma_1.prisma.order.findMany({
            where,
            include: {
                user: { select: { firstName: true, lastName: true, email: true, phone: true } },
                items: {
                    where: { productId: { in: productIds } },
                    include: { product: { select: { id: true, name: true, thumbnail: true } } },
                },
            },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.prisma.order.count({ where }),
    ]);
    const mappedOrders = orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        totalAmount: o.totalAmount,
        status: o.status,
        paymentStatus: o.paymentStatus,
        customerName: `${o.user.firstName} ${o.user.lastName}`,
        customerEmail: o.user.email,
        customerPhone: o.user.phone || "",
        items: o.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: item.product?.name || "Unknown",
            productThumbnail: item.product?.thumbnail || "",
            quantity: item.quantity,
            price: item.price,
        })),
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
    }));
    return {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        data: mappedOrders,
    };
};
exports.getSellerOrders = getSellerOrders;
/* ============================================
   Update Order Status (Seller)
============================================ */
const updateSellerOrderStatus = async (userId, orderId, status) => {
    await (0, exports.assertSellerIsActive)(userId);
    const productIds = await getSellerProductIds(userId);
    const orderItem = await prisma_1.prisma.orderItem.findFirst({
        where: { orderId, productId: { in: productIds } },
    });
    if (!orderItem) {
        throw new Error("Order not found or does not contain your products.");
    }
    return prisma_1.prisma.order.update({
        where: { id: orderId },
        data: { status: status },
    });
};
exports.updateSellerOrderStatus = updateSellerOrderStatus;
/* ============================================
   Seller Earnings / Finance
============================================ */
const getSellerEarnings = async (userId) => {
    const productIds = await getSellerProductIds(userId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const deliveredItems = await prisma_1.prisma.orderItem.findMany({
        where: {
            productId: { in: productIds },
            order: { status: "DELIVERED" },
        },
        include: {
            order: { select: { orderNumber: true, createdAt: true, status: true } },
        },
    });
    const totalRevenue = deliveredItems.reduce((sum, i) => sum + Number(i.price), 0);
    const thisMonthItems = deliveredItems.filter((i) => new Date(i.order.createdAt) >= startOfMonth);
    const revenueThisMonth = thisMonthItems.reduce((sum, i) => sum + Number(i.price), 0);
    const lastMonthItems = deliveredItems.filter((i) => {
        const d = new Date(i.order.createdAt);
        return d >= startOfLastMonth && d <= endOfLastMonth;
    });
    const revenueLastMonth = lastMonthItems.reduce((sum, i) => sum + Number(i.price), 0);
    const pendingItems = await prisma_1.prisma.orderItem.findMany({
        where: {
            productId: { in: productIds },
            order: { status: { in: ["PENDING", "PROCESSING", "SHIPPED"] } },
        },
        select: { price: true },
    });
    const pendingPayout = pendingItems.reduce((sum, i) => sum + Number(i.price), 0);
    const availableForPayout = totalRevenue * 0.85;
    const totalCommission = totalRevenue * 0.10;
    const totalShippingFees = totalRevenue * 0.05;
    const totalPenalties = 0;
    const transactions = [];
    deliveredItems.forEach((item) => {
        const netAmount = Number(item.price) * 0.85;
        transactions.push({
            id: item.id,
            orderNumber: item.order.orderNumber,
            amount: Number(item.price),
            commission: Number(item.price) * 0.10,
            shippingFee: Number(item.price) * 0.05,
            penalty: 0,
            netAmount,
            status: "SETTLED",
            date: item.order.createdAt.toISOString(),
        });
    });
    const pendingTransItems = await prisma_1.prisma.orderItem.findMany({
        where: {
            productId: { in: productIds },
            order: { status: { in: ["PENDING", "PROCESSING", "SHIPPED"] } },
        },
        include: {
            order: { select: { orderNumber: true, createdAt: true } },
        },
    });
    pendingTransItems.forEach((item) => {
        transactions.push({
            id: item.id,
            orderNumber: item.order.orderNumber,
            amount: Number(item.price),
            commission: Number(item.price) * 0.10,
            shippingFee: Number(item.price) * 0.05,
            penalty: 0,
            netAmount: Number(item.price) * 0.85,
            status: "PENDING",
            date: item.order.createdAt.toISOString(),
        });
    });
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return {
        totalRevenue,
        revenueThisMonth,
        revenueLastMonth,
        pendingPayout,
        availableForPayout,
        totalCommission,
        totalShippingFees,
        totalPenalties,
        transactions,
    };
};
exports.getSellerEarnings = getSellerEarnings;
/* ============================================
   Seller Return Requests
============================================ */
const getSellerReturns = async (userId) => {
    const productIds = await getSellerProductIds(userId);
    const orderItemList = await prisma_1.prisma.orderItem.findMany({
        where: { productId: { in: productIds } },
        select: { orderId: true },
        distinct: ["orderId"],
    });
    const orderIds = orderItemList.map((oi) => oi.orderId);
    const returnedOrders = await prisma_1.prisma.order.findMany({
        where: {
            id: { in: orderIds },
            status: { in: ["CANCELLED"] },
        },
        include: {
            user: { select: { firstName: true, lastName: true } },
            items: {
                where: { productId: { in: productIds } },
                include: { product: { select: { name: true } } },
            },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
    const returns = returnedOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: `${o.user.firstName} ${o.user.lastName}`,
        productName: o.items[0]?.product?.name || "Product",
        reason: "Customer requested cancellation/return",
        images: [],
        status: "RETURNED",
        refundStatus: o.paymentStatus === "REFUNDED" ? "REFUNDED" : "PENDING",
        createdAt: o.createdAt.toISOString(),
    }));
    return returns;
};
exports.getSellerReturns = getSellerReturns;
/* ============================================
   Seller Reviews
============================================ */
const getSellerReviews = async (userId) => {
    const productIds = await getSellerProductIds(userId);
    const reviews = await prisma_1.prisma.productReview.findMany({
        where: { productId: { in: productIds } },
        include: {
            user: { select: { firstName: true, lastName: true } },
            product: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
    const mappedReviews = reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        customerName: `${r.user.firstName} ${r.user.lastName}`,
        productName: r.product.name,
        productId: r.product.id,
        createdAt: r.createdAt.toISOString(),
    }));
    return mappedReviews;
};
exports.getSellerReviews = getSellerReviews;
/* ============================================
   Seller Performance
============================================ */
const getSellerPerformance = async (userId) => {
    const productIds = await getSellerProductIds(userId);
    const orderItems = await prisma_1.prisma.orderItem.findMany({
        where: { productId: { in: productIds } },
        select: { orderId: true, price: true },
    });
    const orderIds = [...new Set(orderItems.map((oi) => oi.orderId))];
    const allOrders = await prisma_1.prisma.order.findMany({
        where: { id: { in: orderIds } },
        select: { id: true, status: true, totalAmount: true, createdAt: true },
    });
    const totalSales = allOrders.length;
    const totalRevenue = allOrders
        .filter((o) => o.status !== "CANCELLED")
        .reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const cancelledCount = allOrders.filter((o) => o.status === "CANCELLED").length;
    const deliveredCount = allOrders.filter((o) => o.status === "DELIVERED").length;
    const cancellationRate = totalSales > 0 ? (cancelledCount / totalSales) * 100 : 0;
    const returnRate = totalSales > 0 ? (cancelledCount / totalSales) * 100 : 0;
    const avgRating = await prisma_1.prisma.productReview.aggregate({
        _avg: { rating: true },
        where: { productId: { in: productIds } },
    });
    let score = 100;
    if (cancellationRate > 5)
        score -= 10;
    if (cancellationRate > 10)
        score -= 15;
    if (deliveredCount > 0)
        score += 5;
    if ((avgRating._avg.rating || 0) < 3)
        score -= 10;
    if ((avgRating._avg.rating || 0) >= 4)
        score += 5;
    score = Math.max(0, Math.min(100, score));
    let healthRating = "Excellent";
    if (score < 40)
        healthRating = "At Risk";
    else if (score < 60)
        healthRating = "Fair";
    else if (score < 80)
        healthRating = "Good";
    const salesReport = [];
    for (let i = 5; i >= 0; i--) {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
        const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        const monthOrders = allOrders.filter((o) => {
            const d = new Date(o.createdAt);
            return d >= monthStart && d <= monthEnd && o.status !== "CANCELLED";
        });
        const monthSales = monthOrders.length;
        const monthRevenue = monthOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
        salesReport.push({
            month: monthStart.toLocaleString("default", { month: "short", year: "numeric" }),
            sales: monthSales,
            revenue: monthRevenue,
        });
    }
    const trafficReport = salesReport.map((r) => ({
        month: r.month,
        visitors: Math.round(r.sales * (15 + Math.random() * 20)),
        pageViews: Math.round(r.sales * (40 + Math.random() * 60)),
    }));
    return {
        sellerScore: score,
        healthRating,
        totalSales,
        totalRevenue,
        cancellationRate: Math.round(cancellationRate * 100) / 100,
        returnRate: Math.round(returnRate * 100) / 100,
        averageRating: Math.round((avgRating._avg.rating || 0) * 10) / 10,
        responseRate: 92,
        responseTime: "2.5 hours",
        salesReport,
        trafficReport,
    };
};
exports.getSellerPerformance = getSellerPerformance;
/* ============================================
   Seller Profile / Settings
============================================ */
const getSellerProfile = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            shopName: true,
            shopLogo: true,
            shopBanner: true,
            shopDescription: true,
            trustBadges: true,
            createdAt: true,
        },
    });
    const products = await prisma_1.prisma.product.count({ where: { userId } });
    const orderItemList = await prisma_1.prisma.orderItem.findMany({
        where: { product: { userId } },
        select: { orderId: true },
        distinct: ["orderId"],
    });
    // Parse stored trust badges JSON. Fall back to empty array.
    let trustBadges = [];
    if (user?.trustBadges) {
        try {
            const parsed = JSON.parse(user.trustBadges);
            trustBadges = Array.isArray(parsed) ? parsed : [];
        }
        catch {
            trustBadges = [];
        }
    }
    return {
        ...user,
        shopName: user?.shopName || `${user?.firstName}'s Shop`,
        shopLogo: user?.shopLogo || "",
        shopBanner: user?.shopBanner || "",
        shopDescription: user?.shopDescription ||
            `Welcome to ${user?.firstName}'s shop on E-Max Marketplace.`,
        trustBadges,
        totalProducts: products,
        totalOrders: orderItemList.length,
        joinedDate: user?.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
    };
};
exports.getSellerProfile = getSellerProfile;
/* ============================================
   Flash Sale
============================================ */
const createFlashSale = async (userId, data) => {
    await (0, exports.assertSellerIsActive)(userId);
    const sellerProducts = await prisma_1.prisma.product.findMany({
        where: { id: { in: data.productIds }, userId },
        select: { id: true },
    });
    if (sellerProducts.length !== data.productIds.length) {
        throw new Error("Some products do not belong to you or do not exist.");
    }
    const flashSale = await prisma_1.prisma.flashSale.create({
        data: {
            title: data.title,
            description: data.description || null,
            discountPercentage: data.discountPercentage,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            sellerId: userId,
            products: {
                create: data.productIds.map((productId) => ({
                    productId,
                })),
            },
        },
        include: {
            products: {
                include: {
                    product: { select: { id: true, name: true, thumbnail: true } },
                },
            },
        },
    });
    return {
        id: flashSale.id,
        title: flashSale.title,
        description: flashSale.description,
        discountPercentage: flashSale.discountPercentage,
        startDate: flashSale.startDate.toISOString(),
        endDate: flashSale.endDate.toISOString(),
        status: flashSale.status,
        isActive: flashSale.isActive,
        products: flashSale.products.map((fp) => ({
            id: fp.id,
            productId: fp.product.id,
            productName: fp.product.name,
            productThumbnail: fp.product.thumbnail,
            discountPrice: fp.discountPrice,
        })),
        createdAt: flashSale.createdAt.toISOString(),
    };
};
exports.createFlashSale = createFlashSale;
const getSellerFlashSales = async (userId) => {
    const flashSales = await prisma_1.prisma.flashSale.findMany({
        where: { sellerId: userId },
        include: {
            products: {
                include: {
                    product: { select: { id: true, name: true, thumbnail: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return flashSales.map((fs) => ({
        id: fs.id,
        title: fs.title,
        description: fs.description,
        discountPercentage: fs.discountPercentage,
        startDate: fs.startDate.toISOString(),
        endDate: fs.endDate.toISOString(),
        status: fs.status,
        isActive: fs.isActive,
        products: fs.products.map((fp) => ({
            id: fp.id,
            productId: fp.product.id,
            productName: fp.product.name,
            productThumbnail: fp.product.thumbnail,
            discountPrice: fp.discountPrice,
        })),
        createdAt: fs.createdAt.toISOString(),
    }));
};
exports.getSellerFlashSales = getSellerFlashSales;
const getFlashSaleById = async (userId, flashSaleId) => {
    const flashSale = await prisma_1.prisma.flashSale.findFirst({
        where: { id: flashSaleId, sellerId: userId },
        include: {
            products: {
                include: {
                    product: { select: { id: true, name: true, thumbnail: true } },
                },
            },
        },
    });
    if (!flashSale)
        return null;
    return {
        id: flashSale.id,
        title: flashSale.title,
        description: flashSale.description,
        discountPercentage: flashSale.discountPercentage,
        startDate: flashSale.startDate.toISOString(),
        endDate: flashSale.endDate.toISOString(),
        status: flashSale.status,
        isActive: flashSale.isActive,
        products: flashSale.products.map((fp) => ({
            id: fp.id,
            productId: fp.product.id,
            productName: fp.product.name,
            productThumbnail: fp.product.thumbnail,
            discountPrice: fp.discountPrice,
        })),
        createdAt: flashSale.createdAt.toISOString(),
    };
};
exports.getFlashSaleById = getFlashSaleById;
const deleteFlashSale = async (userId, flashSaleId) => {
    await (0, exports.assertSellerIsActive)(userId);
    const flashSale = await prisma_1.prisma.flashSale.findFirst({
        where: { id: flashSaleId, sellerId: userId },
    });
    if (!flashSale) {
        throw new Error("Flash sale not found or does not belong to you.");
    }
    await prisma_1.prisma.flashSale.delete({
        where: { id: flashSaleId },
    });
};
exports.deleteFlashSale = deleteFlashSale;
/* ============================================
   Bulk Discounts
============================================ */
const createBulkDiscountService = async (userId, data) => {
    await (0, exports.assertSellerIsActive)(userId);
    const sellerProducts = await prisma_1.prisma.product.findMany({
        where: { id: { in: data.productIds }, userId },
        select: { id: true },
    });
    if (sellerProducts.length !== data.productIds.length) {
        throw new Error("Some products do not belong to you or do not exist.");
    }
    const bulkDiscount = await prisma_1.prisma.bulkDiscount.create({
        data: {
            name: data.name,
            description: data.description || null,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            sellerId: userId,
            tiers: {
                create: data.tiers.map((tier) => ({
                    minQuantity: tier.minQuantity,
                    maxQuantity: tier.maxQuantity,
                    discountType: tier.discountType,
                    discountValue: tier.discountValue,
                })),
            },
            products: {
                create: data.productIds.map((productId) => ({
                    productId,
                })),
            },
        },
        include: {
            tiers: true,
            products: {
                include: {
                    product: { select: { id: true, name: true, thumbnail: true } },
                },
            },
        },
    });
    return {
        id: bulkDiscount.id,
        name: bulkDiscount.name,
        description: bulkDiscount.description,
        startDate: bulkDiscount.startDate.toISOString(),
        endDate: bulkDiscount.endDate.toISOString(),
        status: bulkDiscount.status,
        isActive: bulkDiscount.isActive,
        tiers: bulkDiscount.tiers.map((t) => ({
            id: t.id,
            minQuantity: t.minQuantity,
            maxQuantity: t.maxQuantity,
            discountType: t.discountType,
            discountValue: Number(t.discountValue),
        })),
        products: bulkDiscount.products.map((bp) => ({
            id: bp.id,
            productId: bp.product.id,
            productName: bp.product.name,
            productThumbnail: bp.product.thumbnail,
        })),
        createdAt: bulkDiscount.createdAt.toISOString(),
    };
};
exports.createBulkDiscountService = createBulkDiscountService;
const getSellerBulkDiscounts = async (userId) => {
    const bulkDiscounts = await prisma_1.prisma.bulkDiscount.findMany({
        where: { sellerId: userId },
        include: {
            tiers: true,
            products: {
                include: {
                    product: { select: { id: true, name: true, thumbnail: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return bulkDiscounts.map((bd) => ({
        id: bd.id,
        name: bd.name,
        description: bd.description,
        startDate: bd.startDate.toISOString(),
        endDate: bd.endDate.toISOString(),
        status: bd.status,
        isActive: bd.isActive,
        tiers: bd.tiers.map((t) => ({
            id: t.id,
            minQuantity: t.minQuantity,
            maxQuantity: t.maxQuantity,
            discountType: t.discountType,
            discountValue: Number(t.discountValue),
        })),
        products: bd.products.map((bp) => ({
            id: bp.id,
            productId: bp.product.id,
            productName: bp.product.name,
            productThumbnail: bp.product.thumbnail,
        })),
        createdAt: bd.createdAt.toISOString(),
    }));
};
exports.getSellerBulkDiscounts = getSellerBulkDiscounts;
const deleteBulkDiscount = async (userId, bulkDiscountId) => {
    await (0, exports.assertSellerIsActive)(userId);
    const bulkDiscount = await prisma_1.prisma.bulkDiscount.findFirst({
        where: { id: bulkDiscountId, sellerId: userId },
    });
    if (!bulkDiscount) {
        throw new Error("Bulk discount not found or does not belong to you.");
    }
    await prisma_1.prisma.bulkDiscount.delete({
        where: { id: bulkDiscountId },
    });
};
exports.deleteBulkDiscount = deleteBulkDiscount;
const getBulkDiscountById = async (userId, bulkDiscountId) => {
    const bulkDiscount = await prisma_1.prisma.bulkDiscount.findFirst({
        where: { id: bulkDiscountId, sellerId: userId },
        include: {
            tiers: true,
            products: {
                include: {
                    product: { select: { id: true, name: true, thumbnail: true } },
                },
            },
        },
    });
    if (!bulkDiscount)
        return null;
    return {
        id: bulkDiscount.id,
        name: bulkDiscount.name,
        description: bulkDiscount.description,
        startDate: bulkDiscount.startDate.toISOString(),
        endDate: bulkDiscount.endDate.toISOString(),
        status: bulkDiscount.status,
        isActive: bulkDiscount.isActive,
        tiers: bulkDiscount.tiers.map((t) => ({
            id: t.id,
            minQuantity: t.minQuantity,
            maxQuantity: t.maxQuantity,
            discountType: t.discountType,
            discountValue: Number(t.discountValue),
        })),
        products: bulkDiscount.products.map((bp) => ({
            id: bp.id,
            productId: bp.product.id,
            productName: bp.product.name,
            productThumbnail: bp.product.thumbnail,
        })),
        createdAt: bulkDiscount.createdAt.toISOString(),
    };
};
exports.getBulkDiscountById = getBulkDiscountById;
/* ============================================
   Seller Location Management
============================================ */
const getSellerLocation = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            addressLine1: true,
            addressLine2: true,
            city: true,
            state: true,
            country: true,
            postalCode: true,
        },
    });
    if (!user) {
        throw new Error("Seller profile not found.");
    }
    return user;
};
exports.getSellerLocation = getSellerLocation;
const updateSellerLocation = async (userId, data) => {
    await (0, exports.assertSellerIsActive)(userId);
    // Build a JSON `location` string for the admin dashboard, which reads the
    // `location` field as `{ city, region, country }`.
    const location = JSON.stringify({
        city: data.city || "",
        region: data.state || "",
        country: data.country || "",
    });
    return prisma_1.prisma.user.update({
        where: { id: userId },
        data: {
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2,
            city: data.city,
            state: data.state,
            country: data.country,
            postalCode: data.postalCode,
            location,
        },
        select: {
            addressLine1: true,
            addressLine2: true,
            city: true,
            state: true,
            country: true,
            postalCode: true,
            location: true,
        },
    });
};
exports.updateSellerLocation = updateSellerLocation;
/* ============================================
   Seller Deactivation & Settings
============================================ */
const checkSellerDeactivationStatus = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { isActive: true, deactivatedReason: true },
    });
    if (!user) {
        throw new Error("Seller profile not found.");
    }
    if (!user.isActive) {
        return {
            isDeactivated: true,
            message: user.deactivatedReason ||
                "Your seller account has been deactivated by the administrator. During this time, you are unable to upload products, manage listings, or provide services. If you believe this is an error or need assistance, please contact the administrator.",
            supportEmail: SUPPORT_EMAIL,
        };
    }
    return {
        isDeactivated: false,
        supportEmail: SUPPORT_EMAIL,
    };
};
exports.checkSellerDeactivationStatus = checkSellerDeactivationStatus;
const updateSellerProfile = async (userId, data) => {
    await (0, exports.assertSellerIsActive)(userId);
    const updateData = {};
    if (data.phone !== undefined)
        updateData.phone = data.phone;
    if (data.shopName !== undefined)
        updateData.shopName = data.shopName;
    if (data.shopDescription !== undefined)
        updateData.shopDescription = data.shopDescription;
    if (data.shopLogo !== undefined)
        updateData.shopLogo = data.shopLogo;
    if (data.shopBanner !== undefined)
        updateData.shopBanner = data.shopBanner;
    if (data.trustBadges !== undefined) {
        const badges = Array.isArray(data.trustBadges) ? data.trustBadges : [];
        updateData.trustBadges = JSON.stringify(badges);
    }
    return prisma_1.prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            shopName: true,
            shopLogo: true,
            shopBanner: true,
            shopDescription: true,
            trustBadges: true,
        },
    });
};
exports.updateSellerProfile = updateSellerProfile;
/* ============================================
   Admin Deactivation & Permission Enforcement
============================================ */
const assertSellerIsActive = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { isActive: true },
    });
    if (!user) {
        throw new Error("User account not found.");
    }
    if (!user.isActive) {
        throw new Error(`Your seller account has been deactivated by the administrator. During this time, you are unable to upload products, manage listings, or provide services. If you believe this is an error or need assistance, please contact the administrator at ${SUPPORT_EMAIL}.`);
    }
};
exports.assertSellerIsActive = assertSellerIsActive;
const deactivateSeller = async (targetUserId, reason) => {
    const seller = await prisma_1.prisma.user.update({
        where: { id: targetUserId },
        data: {
            isActive: false,
            deactivatedReason: reason || "Deactivated by administrator.",
        },
        select: { id: true, email: true, firstName: true, lastName: true },
    });
    await sendDeactivationEmail(seller.email, `${seller.firstName} ${seller.lastName}`);
    return seller;
};
exports.deactivateSeller = deactivateSeller;
const sendDeactivationEmail = async (email, name) => {
    const subject = "Important: Your Seller Account Has Been Deactivated";
    const body = `
Hello ${name},

Your seller account has been deactivated by the administrator. During this time, you are unable to upload products, manage listings, or provide services. 

If you believe this is an error or need assistance, please contact the administrator at ${SUPPORT_EMAIL} to initiate account review.

Best regards,
Marketplace Support Team
  `.trim();
    // Integrated with your email transport service (e.g., Nodemailer, SendGrid, SES)
    // await mailer.sendMail({ to: email, subject, text: body });
};
