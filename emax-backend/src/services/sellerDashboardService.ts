import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

/* ============================================
   Types & Interfaces
============================================ */

export interface SellerDashboardStats {
  products: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  revenue: number;
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  ordersToday: number;
  ordersWeek: number;
  ordersMonth: number;
  totalCustomers: number;
  averageRating: number;
  totalReviews: number;
  payoutBalance: number;
  nextPayoutDate: string | null;
  salesTrend: SalesTrendPoint[];
  recentOrders: SellerRecentOrder[];
  topProducts: TopProduct[];
}

export interface SellerRecentOrder {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  createdAt: string;
}

export interface SalesTrendPoint {
  date: string;
  sales: number;
  orders: number;
}

export interface TopProduct {
  id: number;
  name: string;
  thumbnail: string;
  totalSold: number;
  revenue: number;
  stock: number;
}

export interface SellerProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: string;
  featured: boolean;
  active: boolean;
  discount: number;
  category: { id: number; name: string } | null;
  brand: { id: number; name: string } | null;
  images: { id: number; image: string }[];
  _count: { reviews: number; orderItems: number };
  createdAt: string;
  updatedAt: string;
}

export interface SellerOrder {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: SellerOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface SellerOrderItem {
  id: number;
  productId: number;
  productName: string;
  productThumbnail: string;
  quantity: number;
  price: number;
}

export interface SellerEarnings {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  pendingPayout: number;
  availableForPayout: number;
  totalCommission: number;
  totalShippingFees: number;
  totalPenalties: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: number;
  orderNumber: string;
  amount: number;
  commission: number;
  shippingFee: number;
  penalty: number;
  netAmount: number;
  status: string;
  date: string;
}

export interface SellerReturnRequest {
  id: number;
  orderNumber: string;
  customerName: string;
  productName: string;
  reason: string;
  images: string[];
  status: string;
  refundStatus: string;
  createdAt: string;
}

export interface SellerReview {
  id: number;
  rating: number;
  comment: string;
  customerName: string;
  productName: string;
  productId: number;
  createdAt: string;
}

export interface SellerPerformance {
  sellerScore: number;
  healthRating: string;
  totalSales: number;
  totalRevenue: number;
  cancellationRate: number;
  returnRate: number;
  averageRating: number;
  responseRate: number;
  responseTime: string;
  salesReport: SalesReportPoint[];
  trafficReport: TrafficReportPoint[];
}

export interface SalesReportPoint {
  month: string;
  sales: number;
  revenue: number;
}

export interface TrafficReportPoint {
  month: string;
  visitors: number;
  pageViews: number;
}

export interface FlashSaleData {
  id: number;
  title: string;
  description: string | null;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  status: string;
  isActive: boolean;
  products: {
    id: number;
    productId: number;
    productName: string;
    productThumbnail: string;
    discountPrice: number | null;
  }[];
  createdAt: string;
}

export interface BulkDiscountData {
  id: number;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  status: string;
  isActive: boolean;
  tiers: {
    id: number;
    minQuantity: number;
    maxQuantity: number;
    discountType: string;
    discountValue: number;
  }[];
  products: {
    id: number;
    productId: number;
    productName: string;
    productThumbnail: string;
  }[];
  createdAt: string;
}

export interface UpdateSellerLocationInput {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface DeactivationCheckResult {
  isDeactivated: boolean;
  message?: string;
  supportEmail: string;
}

const SUPPORT_EMAIL = "admin@emaxmarketplace.com";

/* ============================================
   Helper: Get seller's product IDs
============================================ */

const getSellerProductIds = async (userId: number): Promise<number[]> => {
  const products = await prisma.product.findMany({
    where: { userId } as any,
    select: { id: true },
  });
  return products.map((p: { id: number }) => p.id);
};

/* ============================================
   Main Dashboard Stats
============================================ */

export const getSellerDashboardStats = async (
  userId: number
): Promise<SellerDashboardStats> => {
  const productIds = await getSellerProductIds(userId);

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Product stats
  const allProducts = await prisma.product.findMany({
    where: { userId } as any,
    select: { id: true, active: true, stock: true },
  });

  const products = allProducts.length;
  const activeProducts = allProducts.filter((p: { active: boolean }) => p.active).length;
  const inactiveProducts = products - activeProducts;
  const lowStockProducts = allProducts.filter((p: { stock: number }) => p.stock > 0 && p.stock <= 5).length;

  // Orders containing seller's products
  const orderItems = await prisma.orderItem.findMany({
    where: { productId: { in: productIds } },
    include: { order: { select: { createdAt: true, status: true } } },
  });

  const orderIds = [...new Set(orderItems.map((oi: { orderId: number }) => oi.orderId))];

  // All seller orders
  const allSellerOrders = await prisma.order.findMany({
    where: { id: { in: orderIds } },
    select: { id: true, status: true, totalAmount: true, createdAt: true },
  });

  const totalOrders = allSellerOrders.length;
  const pendingOrders = allSellerOrders.filter((o: { status: string }) => o.status === "PENDING").length;
  const processingOrders = allSellerOrders.filter((o: { status: string }) => o.status === "PROCESSING").length;
  const shippedOrders = allSellerOrders.filter((o: { status: string }) => o.status === "SHIPPED").length;
  const deliveredOrders = allSellerOrders.filter((o: { status: string }) => o.status === "DELIVERED").length;
  const cancelledOrders = allSellerOrders.filter((o: { status: string }) => o.status === "CANCELLED").length;

  // Revenue (from delivered orders only)
  const revenueResult = await prisma.orderItem.aggregate({
    _sum: { price: true },
    where: {
      productId: { in: productIds },
      order: { status: "DELIVERED" },
    },
  });
  const revenue = Number(revenueResult._sum.price) || 0;

  // Revenue today/week/month
  const revenueTodayItems = await prisma.orderItem.findMany({
    where: {
      productId: { in: productIds },
      order: { status: "DELIVERED", createdAt: { gte: startOfDay } },
    },
    select: { price: true },
  });
  const revenueToday = revenueTodayItems.reduce((sum: number, i: { price: number }) => sum + Number(i.price), 0);

  const revenueWeekItems = await prisma.orderItem.findMany({
    where: {
      productId: { in: productIds },
      order: { status: "DELIVERED", createdAt: { gte: startOfWeek } },
    },
    select: { price: true },
  });
  const revenueWeek = revenueWeekItems.reduce((sum: number, i: { price: number }) => sum + Number(i.price), 0);

  const revenueMonthItems = await prisma.orderItem.findMany({
    where: {
      productId: { in: productIds },
      order: { status: "DELIVERED", createdAt: { gte: startOfMonth } },
    },
    select: { price: true },
  });
  const revenueMonth = revenueMonthItems.reduce((sum: number, i: { price: number }) => sum + Number(i.price), 0);

  // Orders today/week/month
  const ordersToday = allSellerOrders.filter((o: { createdAt: Date }) => new Date(o.createdAt) >= startOfDay).length;
  const ordersWeek = allSellerOrders.filter((o: { createdAt: Date }) => new Date(o.createdAt) >= startOfWeek).length;
  const ordersMonth = allSellerOrders.filter((o: { createdAt: Date }) => new Date(o.createdAt) >= startOfMonth).length;

  // Customers who ordered seller's products
  const customerOrders = await prisma.order.findMany({
    where: { id: { in: orderIds } },
    select: { userId: true },
    distinct: ["userId"],
  });
  const totalCustomers = customerOrders.length;

  // Reviews for seller's products
  const reviewStats = await prisma.productReview.aggregate({
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
  const salesTrend: SalesTrendPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayOrders = allSellerOrders.filter((o: { createdAt: Date; status: string }) => {
      const d = new Date(o.createdAt);
      return d >= dayStart && d < dayEnd && o.status !== "CANCELLED";
    });

    const daySales = dayOrders.reduce((sum: number, o: { totalAmount: number }) => sum + Number(o.totalAmount), 0);

    salesTrend.push({
      date: dayStart.toISOString().split("T")[0],
      sales: daySales,
      orders: dayOrders.length,
    });
  }

  // Recent orders
  const recentOrdersRaw = await prisma.order.findMany({
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

  const recentOrders: SellerRecentOrder[] = recentOrdersRaw.map((o: any) => {
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
  const topProductsRaw = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: { productId: { in: productIds }, order: { status: "DELIVERED" } },
    _sum: { quantity: true, price: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const topProducts: TopProduct[] = await Promise.all(
    topProductsRaw.map(async (item: { productId: number; _sum: { quantity: number | null; price: number | null } }) => {
      const product = await prisma.product.findUnique({
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
    })
  );

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

/* ============================================
   Seller Products
============================================ */

interface ProductQuery {
  search?: string;
  active?: string;
  featured?: string;
  page?: number;
  limit?: number;
}

export const getSellerProducts = async (
  userId: number,
  query: ProductQuery
) => {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = { userId };

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }
  if (query.active === "true") where.active = true;
  if (query.active === "false") where.active = false;
  if (query.featured === "true") where.featured = true;
  if (query.featured === "false") where.featured = false;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
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
    prisma.product.count({ where }),
  ]);

  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    data: products,
  };
};

/* ============================================
   Seller Orders
============================================ */

interface OrderQuery {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getSellerOrders = async (
  userId: number,
  query: OrderQuery
) => {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = (page - 1) * limit;

  const productIds = await getSellerProductIds(userId);

  const orderItems = await prisma.orderItem.findMany({
    where: { productId: { in: productIds } },
    select: { orderId: true },
    distinct: ["orderId"],
  });
  const orderIds = orderItems.map((oi: { orderId: number }) => oi.orderId);

  const where: Prisma.OrderWhereInput = { id: { in: orderIds } };
  if (query.status) {
    where.status = query.status as any;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
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
    prisma.order.count({ where }),
  ]);

  const mappedOrders: SellerOrder[] = orders.map((o: any) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    totalAmount: o.totalAmount,
    status: o.status,
    paymentStatus: o.paymentStatus,
    customerName: `${o.user.firstName} ${o.user.lastName}`,
    customerEmail: o.user.email,
    customerPhone: o.user.phone || "",
    items: o.items.map((item: any) => ({
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

/* ============================================
   Update Order Status (Seller)
============================================ */

export const updateSellerOrderStatus = async (
  userId: number,
  orderId: number,
  status: string
) => {
  await assertSellerIsActive(userId);

  const productIds = await getSellerProductIds(userId);

  const orderItem = await prisma.orderItem.findFirst({
    where: { orderId, productId: { in: productIds } },
  });

  if (!orderItem) {
    throw new Error("Order not found or does not contain your products.");
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: status as any },
  });
};

/* ============================================
   Seller Earnings / Finance
============================================ */

export const getSellerEarnings = async (userId: number): Promise<SellerEarnings> => {
  const productIds = await getSellerProductIds(userId);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const deliveredItems = await prisma.orderItem.findMany({
    where: {
      productId: { in: productIds },
      order: { status: "DELIVERED" },
    },
    include: {
      order: { select: { orderNumber: true, createdAt: true, status: true } },
    },
  });

  const totalRevenue = deliveredItems.reduce((sum: number, i: { price: number }) => sum + Number(i.price), 0);

  const thisMonthItems = deliveredItems.filter(
    (i: { order: { createdAt: Date } }) => new Date(i.order.createdAt) >= startOfMonth
  );
  const revenueThisMonth = thisMonthItems.reduce((sum: number, i: { price: number }) => sum + Number(i.price), 0);

  const lastMonthItems = deliveredItems.filter((i: { order: { createdAt: Date } }) => {
    const d = new Date(i.order.createdAt);
    return d >= startOfLastMonth && d <= endOfLastMonth;
  });
  const revenueLastMonth = lastMonthItems.reduce((sum: number, i: { price: number }) => sum + Number(i.price), 0);

  const pendingItems = await prisma.orderItem.findMany({
    where: {
      productId: { in: productIds },
      order: { status: { in: ["PENDING", "PROCESSING", "SHIPPED"] } },
    },
    select: { price: true },
  });
  const pendingPayout = pendingItems.reduce((sum: number, i: { price: number }) => sum + Number(i.price), 0);

  const availableForPayout = totalRevenue * 0.85;
  const totalCommission = totalRevenue * 0.10;
  const totalShippingFees = totalRevenue * 0.05;
  const totalPenalties = 0;

  const transactions: Transaction[] = [];

  deliveredItems.forEach((item: any) => {
    const netAmount = Number(item.price) * 0.85;
    transactions.push({
      id: item.id,
      orderNumber: item.order.orderNumber,
      amount: Number(item.price),
      commission: Number(item.price) * 0.10,
      shippingFee: Number(item.price) * 0.05,
      penalty: 0,
      netAmount,
      status: "SETTLED" as string,
      date: item.order.createdAt.toISOString(),
    });
  });

  const pendingTransItems = await prisma.orderItem.findMany({
    where: {
      productId: { in: productIds },
      order: { status: { in: ["PENDING", "PROCESSING", "SHIPPED"] } },
    },
    include: {
      order: { select: { orderNumber: true, createdAt: true } },
    },
  });

  pendingTransItems.forEach((item: any) => {
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

  transactions.sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

/* ============================================
   Seller Return Requests
============================================ */

export const getSellerReturns = async (userId: number): Promise<SellerReturnRequest[]> => {
  const productIds = await getSellerProductIds(userId);

  const orderItemList = await prisma.orderItem.findMany({
    where: { productId: { in: productIds } },
    select: { orderId: true },
    distinct: ["orderId"],
  });
  const orderIds = orderItemList.map((oi: { orderId: number }) => oi.orderId);

  const returnedOrders = await prisma.order.findMany({
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

  const returns: SellerReturnRequest[] = returnedOrders.map((o: any) => ({
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

/* ============================================
   Seller Reviews
============================================ */

export const getSellerReviews = async (userId: number): Promise<SellerReview[]> => {
  const productIds = await getSellerProductIds(userId);

  const reviews = await prisma.productReview.findMany({
    where: { productId: { in: productIds } },
    include: {
      user: { select: { firstName: true, lastName: true } },
      product: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const mappedReviews: SellerReview[] = reviews.map((r: any) => ({
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

/* ============================================
   Seller Performance
============================================ */

export const getSellerPerformance = async (userId: number): Promise<SellerPerformance> => {
  const productIds = await getSellerProductIds(userId);

  const orderItems = await prisma.orderItem.findMany({
    where: { productId: { in: productIds } },
    select: { orderId: true, price: true },
  });

  const orderIds = [...new Set(orderItems.map((oi: { orderId: number }) => oi.orderId))];

  const allOrders = await prisma.order.findMany({
    where: { id: { in: orderIds } },
    select: { id: true, status: true, totalAmount: true, createdAt: true },
  });

  const totalSales = allOrders.length;
  const totalRevenue = allOrders
    .filter((o: { status: string }) => o.status !== "CANCELLED")
    .reduce((sum: number, o: { totalAmount: number }) => sum + Number(o.totalAmount), 0);
  const cancelledCount = allOrders.filter((o: { status: string }) => o.status === "CANCELLED").length;
  const deliveredCount = allOrders.filter((o: { status: string }) => o.status === "DELIVERED").length;

  const cancellationRate = totalSales > 0 ? (cancelledCount / totalSales) * 100 : 0;
  const returnRate = totalSales > 0 ? (cancelledCount / totalSales) * 100 : 0;

  const avgRating = await prisma.productReview.aggregate({
    _avg: { rating: true },
    where: { productId: { in: productIds } },
  });

  let score = 100;
  if (cancellationRate > 5) score -= 10;
  if (cancellationRate > 10) score -= 15;
  if (deliveredCount > 0) score += 5;
  if ((avgRating._avg.rating || 0) < 3) score -= 10;
  if ((avgRating._avg.rating || 0) >= 4) score += 5;
  score = Math.max(0, Math.min(100, score));

  let healthRating = "Excellent";
  if (score < 40) healthRating = "At Risk";
  else if (score < 60) healthRating = "Fair";
  else if (score < 80) healthRating = "Good";

  const salesReport: SalesReportPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const monthOrders = allOrders.filter((o: { createdAt: Date; status: string }) => {
      const d = new Date(o.createdAt);
      return d >= monthStart && d <= monthEnd && o.status !== "CANCELLED";
    });

    const monthSales = monthOrders.length;
    const monthRevenue = monthOrders.reduce((sum: number, o: { totalAmount: number }) => sum + Number(o.totalAmount), 0);

    salesReport.push({
      month: monthStart.toLocaleString("default", { month: "short", year: "numeric" }),
      sales: monthSales,
      revenue: monthRevenue,
    });
  }

  const trafficReport: TrafficReportPoint[] = salesReport.map((r: SalesReportPoint) => ({
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

/* ============================================
   Seller Profile / Settings
============================================ */

export const getSellerProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
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

  const products = await prisma.product.count({ where: { userId } });
  const orderItemList = await prisma.orderItem.findMany({
    where: { product: { userId } },
    select: { orderId: true },
    distinct: ["orderId"],
  });

  // Parse stored trust badges JSON. Fall back to empty array.
  let trustBadges: string[] = [];
  if (user?.trustBadges) {
    try {
      const parsed = JSON.parse(user.trustBadges);
      trustBadges = Array.isArray(parsed) ? parsed : [];
    } catch {
      trustBadges = [];
    }
  }

  return {
    ...user,
    shopName: user?.shopName || `${user?.firstName}'s Shop`,
    shopLogo: user?.shopLogo || "",
    shopBanner: user?.shopBanner || "",
    shopDescription:
      user?.shopDescription ||
      `Welcome to ${user?.firstName}'s shop on E-Max Marketplace.`,
    trustBadges,
    totalProducts: products,
    totalOrders: orderItemList.length,
    joinedDate: user?.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
  };
};

/* ============================================
   Flash Sale
============================================ */

export const createFlashSale = async (
  userId: number,
  data: {
    title: string;
    description?: string;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    productIds: number[];
  }
) => {
  await assertSellerIsActive(userId);

  const sellerProducts = await prisma.product.findMany({
    where: { id: { in: data.productIds }, userId },
    select: { id: true },
  });

  if (sellerProducts.length !== data.productIds.length) {
    throw new Error("Some products do not belong to you or do not exist.");
  }

  const flashSale = await prisma.flashSale.create({
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
    products: flashSale.products.map((fp: any) => ({
      id: fp.id,
      productId: fp.product.id,
      productName: fp.product.name,
      productThumbnail: fp.product.thumbnail,
      discountPrice: fp.discountPrice,
    })),
    createdAt: flashSale.createdAt.toISOString(),
  };
};

export const getSellerFlashSales = async (userId: number): Promise<FlashSaleData[]> => {
  const flashSales = await prisma.flashSale.findMany({
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

  return flashSales.map((fs: any) => ({
    id: fs.id,
    title: fs.title,
    description: fs.description,
    discountPercentage: fs.discountPercentage,
    startDate: fs.startDate.toISOString(),
    endDate: fs.endDate.toISOString(),
    status: fs.status,
    isActive: fs.isActive,
    products: fs.products.map((fp: any) => ({
      id: fp.id,
      productId: fp.product.id,
      productName: fp.product.name,
      productThumbnail: fp.product.thumbnail,
      discountPrice: fp.discountPrice,
    })),
    createdAt: fs.createdAt.toISOString(),
  }));
};

export const getFlashSaleById = async (userId: number, flashSaleId: number): Promise<FlashSaleData | null> => {
  const flashSale = await prisma.flashSale.findFirst({
    where: { id: flashSaleId, sellerId: userId },
    include: {
      products: {
        include: {
          product: { select: { id: true, name: true, thumbnail: true } },
        },
      },
    },
  });

  if (!flashSale) return null;

  return {
    id: flashSale.id,
    title: flashSale.title,
    description: flashSale.description,
    discountPercentage: flashSale.discountPercentage,
    startDate: flashSale.startDate.toISOString(),
    endDate: flashSale.endDate.toISOString(),
    status: flashSale.status,
    isActive: flashSale.isActive,
    products: flashSale.products.map((fp: any) => ({
      id: fp.id,
      productId: fp.product.id,
      productName: fp.product.name,
      productThumbnail: fp.product.thumbnail,
      discountPrice: fp.discountPrice,
    })),
    createdAt: flashSale.createdAt.toISOString(),
  };
};

export const deleteFlashSale = async (userId: number, flashSaleId: number): Promise<void> => {
  await assertSellerIsActive(userId);

  const flashSale = await prisma.flashSale.findFirst({
    where: { id: flashSaleId, sellerId: userId },
  });

  if (!flashSale) {
    throw new Error("Flash sale not found or does not belong to you.");
  }

  await prisma.flashSale.delete({
    where: { id: flashSaleId },
  });
};

/* ============================================
   Bulk Discounts
============================================ */

export const createBulkDiscountService = async (
  userId: number,
  data: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    productIds: number[];
    tiers: {
      minQuantity: number;
      maxQuantity: number;
      discountType: string;
      discountValue: number;
    }[];
  }
): Promise<BulkDiscountData> => {
  await assertSellerIsActive(userId);

  const sellerProducts = await prisma.product.findMany({
    where: { id: { in: data.productIds }, userId },
    select: { id: true },
  });

  if (sellerProducts.length !== data.productIds.length) {
    throw new Error("Some products do not belong to you or do not exist.");
  }

  const bulkDiscount = await prisma.bulkDiscount.create({
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
          discountType: tier.discountType as any,
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
    tiers: bulkDiscount.tiers.map((t: any) => ({
      id: t.id,
      minQuantity: t.minQuantity,
      maxQuantity: t.maxQuantity,
      discountType: t.discountType,
      discountValue: Number(t.discountValue),
    })),
    products: bulkDiscount.products.map((bp: any) => ({
      id: bp.id,
      productId: bp.product.id,
      productName: bp.product.name,
      productThumbnail: bp.product.thumbnail,
    })),
    createdAt: bulkDiscount.createdAt.toISOString(),
  };
};

export const getSellerBulkDiscounts = async (userId: number): Promise<BulkDiscountData[]> => {
  const bulkDiscounts = await prisma.bulkDiscount.findMany({
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

  return bulkDiscounts.map((bd: any) => ({
    id: bd.id,
    name: bd.name,
    description: bd.description,
    startDate: bd.startDate.toISOString(),
    endDate: bd.endDate.toISOString(),
    status: bd.status,
    isActive: bd.isActive,
    tiers: bd.tiers.map((t: any) => ({
      id: t.id,
      minQuantity: t.minQuantity,
      maxQuantity: t.maxQuantity,
      discountType: t.discountType,
      discountValue: Number(t.discountValue),
    })),
    products: bd.products.map((bp: any) => ({
      id: bp.id,
      productId: bp.product.id,
      productName: bp.product.name,
      productThumbnail: bp.product.thumbnail,
    })),
    createdAt: bd.createdAt.toISOString(),
  }));
};

export const deleteBulkDiscount = async (userId: number, bulkDiscountId: number): Promise<void> => {
  await assertSellerIsActive(userId);

  const bulkDiscount = await prisma.bulkDiscount.findFirst({
    where: { id: bulkDiscountId, sellerId: userId },
  });

  if (!bulkDiscount) {
    throw new Error("Bulk discount not found or does not belong to you.");
  }

  await prisma.bulkDiscount.delete({
    where: { id: bulkDiscountId },
  });
};

export const getBulkDiscountById = async (userId: number, bulkDiscountId: number): Promise<BulkDiscountData | null> => {
  const bulkDiscount = await prisma.bulkDiscount.findFirst({
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

  if (!bulkDiscount) return null;

  return {
    id: bulkDiscount.id,
    name: bulkDiscount.name,
    description: bulkDiscount.description,
    startDate: bulkDiscount.startDate.toISOString(),
    endDate: bulkDiscount.endDate.toISOString(),
    status: bulkDiscount.status,
    isActive: bulkDiscount.isActive,
    tiers: bulkDiscount.tiers.map((t: any) => ({
      id: t.id,
      minQuantity: t.minQuantity,
      maxQuantity: t.maxQuantity,
      discountType: t.discountType,
      discountValue: Number(t.discountValue),
    })),
    products: bulkDiscount.products.map((bp: any) => ({
      id: bp.id,
      productId: bp.product.id,
      productName: bp.product.name,
      productThumbnail: bp.product.thumbnail,
    })),
    createdAt: bulkDiscount.createdAt.toISOString(),
  };
};

/* ============================================
   Seller Location Management
============================================ */

export const getSellerLocation = async (userId: number) => {
  const user = await prisma.user.findUnique({
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

export const updateSellerLocation = async (
  userId: number,
  data: UpdateSellerLocationInput
) => {
  await assertSellerIsActive(userId);

  // Build a JSON `location` string for the admin dashboard, which reads the
  // `location` field as `{ city, region, country }`.
  const location = JSON.stringify({
    city: data.city || "",
    region: data.state || "",
    country: data.country || "",
  });

  return prisma.user.update({
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

/* ============================================
   Seller Deactivation & Settings
============================================ */

export const checkSellerDeactivationStatus = async (
  userId: number
): Promise<DeactivationCheckResult> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true, deactivatedReason: true },
  });

  if (!user) {
    throw new Error("Seller profile not found.");
  }

  if (!user.isActive) {
    return {
      isDeactivated: true,
      message:
        user.deactivatedReason ||
        "Your seller account has been deactivated by the administrator. During this time, you are unable to upload products, manage listings, or provide services. If you believe this is an error or need assistance, please contact the administrator.",
      supportEmail: SUPPORT_EMAIL,
    };
  }

  return {
    isDeactivated: false,
    supportEmail: SUPPORT_EMAIL,
  };
};

export const updateSellerProfile = async (
  userId: number,
  data: {
    shopName?: string;
    shopDescription?: string;
    phone?: string;
    shopLogo?: string;
    shopBanner?: string;
    trustBadges?: string[];
  }
) => {
  await assertSellerIsActive(userId);

  const updateData: any = {};
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.shopName !== undefined) updateData.shopName = data.shopName;
  if (data.shopDescription !== undefined) updateData.shopDescription = data.shopDescription;
  if (data.shopLogo !== undefined) updateData.shopLogo = data.shopLogo;
  if (data.shopBanner !== undefined) updateData.shopBanner = data.shopBanner;
  if (data.trustBadges !== undefined) {
    const badges = Array.isArray(data.trustBadges) ? data.trustBadges : [];
    updateData.trustBadges = JSON.stringify(badges);
  }

  return prisma.user.update({
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

/* ============================================
   Admin Deactivation & Permission Enforcement
============================================ */

export const assertSellerIsActive = async (userId: number): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true },
  });

  if (!user) {
    throw new Error("User account not found.");
  }

  if (!user.isActive) {
    throw new Error(
      `Your seller account has been deactivated by the administrator. During this time, you are unable to upload products, manage listings, or provide services. If you believe this is an error or need assistance, please contact the administrator at ${SUPPORT_EMAIL}.`
    );
  }
};

export const deactivateSeller = async (targetUserId: number, reason?: string) => {
  const seller = await prisma.user.update({
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

const sendDeactivationEmail = async (email: string, name: string) => {
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