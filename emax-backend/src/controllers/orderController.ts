import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const createOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      userId,
      items,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required.",
      });
    }

    let total = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found.`,
        });
      }

      total += product.price * item.quantity;
    }

    const order = await prisma.order.create({
      data: {
        orderNumber:
          "EMX-" + Date.now(),

        totalAmount: total,

        userId,

        items: {
          create: await Promise.all(
            items.map(async (item: any) => {
              const product =
                await prisma.product.findUnique({
                  where: {
                    id: item.productId,
                  },
                });

              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product!.price,
              };
            })
          ),
        },
      },

      include: {
        items: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create order.",
    });
  }
};

export const getOrders = async (
  req: Request,
  res: Response
) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};

export const getOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const order =
      await prisma.order.findUnique({
        where: {
          id,
        },

        include: {
          user: true,

          items: {
            include: {
              product: true,
            },
          },
        },
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order.",
    });
  }
};