import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    const [
      products,
      categories,
      brands,
      customers,
      featuredProducts,
      reviews,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      revenueAgg,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.brand.count(),
      prisma.user.count({
        where: {
          role: "CUSTOMER",
        },
      }),
      prisma.product.count({
        where: {
          featured: true,
        },
      }),
      prisma.productReview.count(),
      prisma.order.count(),
      prisma.order.count({
        where: { status: "PENDING" },
      }),
      prisma.order.count({
        where: { status: "DELIVERED" },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: "CANCELLED" } },
      }),
    ]);

    const recentOrders = await prisma.order.findMany({
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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics.",
    });
  }
};

// =====================================================
// Customer Dashboard (real data from DB)
// =====================================================


export const getMyDashboardOverview = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const [ordersCount, wishlistCount] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.wishlist.count({ where: { userId } }),
    ]);

    // No reward points/coupons model exists in schema yet.
    // Keep UI stable by returning a realistic derived placeholder.
    // (Derived from delivered orders total, rounded.)
    const deliveredOrdersTotal = await prisma.order.aggregate({
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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load customer dashboard overview.",
    });
  }
};

export const getMyRecentOrders = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const orders = await prisma.order.findMany({
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
        product:
          firstItem?.product?.name || "Order Item",
        status: o.status,
        total: o.totalAmount,
      };
    });

    res.status(200).json({
      success: true,
      data: mapped,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load recent orders.",
    });
  }
};

export const getMyWishlist = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const wishlist = await prisma.wishlist.findUnique({
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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load wishlist.",
    });
  }
};
