import { prisma } from "../config/prisma";

export const getSalesReport = async (dateFrom?: string, dateTo?: string) => {
  const from = dateFrom ? new Date(dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const to = dateTo ? new Date(dateTo) : new Date();

  const whereDate = { createdAt: { gte: from, lte: to } };

  const [totalOrders, pendingOrders, processingOrders, shippedOrders, deliveredOrders, cancelledOrders, revenueAgg] =
    await Promise.all([
      prisma.order.count({ where: whereDate }),
      prisma.order.count({ where: { ...whereDate, status: "PENDING" } }),
      prisma.order.count({ where: { ...whereDate, status: "PROCESSING" } }),
      prisma.order.count({ where: { ...whereDate, status: "SHIPPED" } }),
      prisma.order.count({ where: { ...whereDate, status: "DELIVERED" } }),
      prisma.order.count({ where: { ...whereDate, status: "CANCELLED" } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { ...whereDate, status: { not: "CANCELLED" } },
      }),
    ]);

  const orders = await prisma.order.findMany({
    where: whereDate,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  });

  const mappedOrders = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    totalAmount: o.totalAmount,
    status: o.status,
    paymentStatus: o.paymentStatus,
    customerName: `${o.user.firstName} ${o.user.lastName}`,
    customerEmail: o.user.email,
    productName: o.items[0]?.product?.name || "N/A",
    createdAt: o.createdAt,
  }));

  return {
    summary: {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: revenueAgg._sum.totalAmount || 0,
    },
    orders: mappedOrders,
  };
};

export const getFinanceReport = async (dateFrom?: string, dateTo?: string) => {
  const from = dateFrom ? new Date(dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const to = dateTo ? new Date(dateTo) : new Date();

  const whereDate = { createdAt: { gte: from, lte: to } };

  const [paidOrders, refundedOrders, revenueAgg] = await Promise.all([
    prisma.order.count({ where: { ...whereDate, paymentStatus: "PAID" } }),
    prisma.order.count({ where: { ...whereDate, paymentStatus: "REFUNDED" } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { ...whereDate, paymentStatus: "PAID" },
    }),
  ]);

  const transactions = await prisma.order.findMany({
    where: { ...whereDate, paymentStatus: { in: ["PAID", "REFUNDED"] } },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
    },
  });

  const mappedTxns = transactions.map((t) => ({
    id: t.id,
    orderNumber: t.orderNumber,
    amount: t.totalAmount,
    paymentStatus: t.paymentStatus,
    customerName: `${t.user.firstName} ${t.user.lastName}`,
    customerEmail: t.user.email,
    date: t.createdAt,
  }));

  return {
    summary: {
      paidOrders,
      refundedOrders,
      totalPayout: revenueAgg._sum.totalAmount || 0,
    },
    transactions: mappedTxns,
    taxInfo: {
      taxRate: "16% VAT",
      taxableAmount: revenueAgg._sum.totalAmount || 0,
      estimatedTax: ((revenueAgg._sum.totalAmount || 0) * 0.16).toFixed(2),
    },
  };
};

export const getInventoryReport = async () => {
  const [totalProducts, totalStock, outOfStock, lowStock] = await Promise.all([
    prisma.product.count(),
    prisma.product.aggregate({ _sum: { stock: true } }),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.product.count({ where: { stock: { gt: 0, lte: 10 } } }),
  ]);

  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true } },
      brand: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const productData = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    stock: p.stock,
    category: p.category.name,
    brand: p.brand.name,
    featured: p.featured,
    active: p.active,
    updatedAt: p.updatedAt,
  }));

  return {
    summary: {
      totalProducts,
      totalStock: totalStock._sum.stock || 0,
      outOfStock,
      lowStock,
    },
    products: productData,
  };
};

export const getCustomerReport = async (dateFrom?: string, dateTo?: string) => {
  const from = dateFrom ? new Date(dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const to = dateTo ? new Date(dateTo) : new Date();

  const whereDate = { createdAt: { gte: from, lte: to } };

  const [cancelledOrders, refundedOrders, totalReviews, reviews] = await Promise.all([
    prisma.order.count({ where: { ...whereDate, status: "CANCELLED" } }),
    prisma.order.count({ where: { ...whereDate, paymentStatus: "REFUNDED" } }),
    prisma.productReview.count({ where: whereDate }),
    prisma.productReview.findMany({
      where: whereDate,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        product: { select: { name: true } },
      },
    }),
  ]);

  const ratingDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRatingSum = 0;
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingDist[r.rating as keyof typeof ratingDist]++;
      totalRatingSum += r.rating;
    }
  });
  const avgRating = totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : "0.0";

  const mappedReviews = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    customerName: `${r.user.firstName} ${r.user.lastName}`,
    customerEmail: r.user.email,
    productName: r.product.name,
    date: r.createdAt,
  }));

  return {
    summary: {
      cancelledOrders,
      refundedOrders,
      totalReviews,
      averageRating: avgRating,
      ratingDistribution: ratingDist,
    },
    reviews: mappedReviews,
  };
};

export const getPerformanceReport = async (dateFrom?: string, dateTo?: string) => {
  const from = dateFrom ? new Date(dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const to = dateTo ? new Date(dateTo) : new Date();

  const whereDate = { createdAt: { gte: from, lte: to } };

  const [totalOrders, deliveredOrders, cancelledOrders, totalReviews, totalRatingAgg] = await Promise.all([
    prisma.order.count({ where: whereDate }),
    prisma.order.count({ where: { ...whereDate, status: "DELIVERED" } }),
    prisma.order.count({ where: { ...whereDate, status: "CANCELLED" } }),
    prisma.productReview.count({ where: whereDate }),
    prisma.productReview.aggregate({
      _avg: { rating: true },
      where: whereDate,
    }),
  ]);

  const deliveryRate = totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : "0.0";
  const cancellationRate = totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : "0.0";
  const avgRating = totalRatingAgg._avg.rating?.toFixed(1) || "0.0";

  return {
    summary: {
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      totalReviews,
      averageRating: avgRating,
      deliveryRate: `${deliveryRate}%`,
      cancellationRate: `${cancellationRate}%`,
      scorecard: {
        deliveryPerformance: deliveryRate,
        customerSatisfaction: avgRating,
        orderFulfillment: totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : "0.0",
      },
      penalties: {
        cancelledPercentage: cancellationRate,
        cancelledAmount: cancelledOrders,
        estimatedPenalty: cancelledOrders * 50, // $50 penalty per cancellation
      },
    },
  };
};

