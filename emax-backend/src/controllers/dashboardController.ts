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
    ]);

    res.status(200).json({
      success: true,
      data: {
        products,
        categories,
        brands,
        customers,
        featuredProducts,
        reviews,
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