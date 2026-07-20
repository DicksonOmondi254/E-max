import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// Customer dashboard (scaffolded endpoints).
// These are intentionally lightweight: if the underlying data is missing,
// they return empty arrays/zero values (so the frontend is ready to serve).

export const getMyDashboardOverview = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user?.id as number | undefined;
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

    const deliveredTotal = await prisma.order.aggregate({
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
  } catch (e) {
    console.error(e);
    return res.status(500).json({
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
    const userId = (req as any).user?.id as number | undefined;
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
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Failed to load recent orders.",
    });
  }
};

export const getMyWishlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id as number | undefined;
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

    return res.status(200).json({
      success: true,
      data: mapped,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Failed to load wishlist.",
    });
  }
};

// Scaffolded endpoints for dashboard navigation.
// Current Prisma schema does not include these models.

export const getMyAddresses = async (_req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};

export const getMyPaymentMethods = async (
  _req: Request,
  res: Response
) => {
  return res.status(200).json({ success: true, data: [] });
};

export const getMySettings = async (_req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: {} });
};

