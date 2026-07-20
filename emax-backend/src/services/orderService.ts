import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

export interface OrderItemData {
  productId: number;
  quantity: number;
}

interface OrderItemCreate {
  productId: number;
  quantity: number;
  price: number;
}

export const orderService = {
  /* ==========================================
     CREATE ORDER
  ========================================== */

  async createOrder(
    userId: number,
    items: OrderItemData[]
  ) {
    let totalAmount = 0;

    const orderItems: OrderItemCreate[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product) {
        throw new Error(
          `Product ${item.productId} not found.`
        );
      }

      if (!product.active) {
        throw new Error(
          `${product.name} is unavailable.`
        );
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}.`
        );
      }

      totalAmount +=
        product.price * item.quantity;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    return prisma.$transaction(
      async (
        tx: Prisma.TransactionClient
      ) => {
        const order =
          await tx.order.create({
            data: {
              orderNumber: `EMX-${Date.now()}`,
              totalAmount,
              userId,

              items: {
                create: orderItems,
              },
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

        for (const item of orderItems) {
          await tx.product.update({
            where: {
              id: item.productId,
            },

            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        return order;
      }
    );
  },

  /* ==========================================
     GET ALL ORDERS
  ========================================== */

  async getOrders() {
    return prisma.order.findMany({
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
  },

  /* ==========================================
     GET ORDER BY ID
  ========================================== */

  async getOrder(id: number) {
    return prisma.order.findUnique({
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
  },

  /* ==========================================
     GET ORDER BY NUMBER
  ========================================== */

  async getOrderByOrderNumber(
    orderNumber: string
  ) {
    return prisma.order.findUnique({
      where: {
        orderNumber,
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
  },

  /* ==========================================
     GET USER ORDERS
  ========================================== */

  async getUserOrders(userId: number) {
    return prisma.order.findMany({
      where: {
        userId,
      },

      include: {
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
  },

  /* ==========================================
     UPDATE ORDER STATUS
  ========================================== */

  async updateStatus(
    id: number,
    status: string
  ) {
    return prisma.order.update({
      where: {
        id,
      },

      data: {
  status: status as any,
},
    });
  },

  /* ==========================================
     UPDATE PAYMENT STATUS
  ========================================== */

  async updatePaymentStatus(
    id: number,
    paymentStatus: string
  ) {
    return prisma.order.update({
      where: {
        id,
      },

      data: {
  paymentStatus: paymentStatus as any,
},
    });
  },

  /* ==========================================
     MARK ORDER AS PAID
  ========================================== */

  async markAsPaid(id: number) {
    return prisma.order.update({
      where: {
        id,
      },

      data: {
        paymentStatus: "PAID",
        status: "PROCESSING",
      },
    });
  },

  /* ==========================================
     MARK ORDER AS DELIVERED
  ========================================== */

  async markAsDelivered(id: number) {
    return prisma.order.update({
      where: {
        id,
      },

      data: {
        status: "DELIVERED",
      },
    });
  },

  /* ==========================================
     CANCEL ORDER
  ========================================== */

  async cancelOrder(id: number) {
    return prisma.$transaction(
      async (
        tx: Prisma.TransactionClient
      ) => {
        const order =
          await tx.order.findUnique({
            where: {
              id,
            },

            include: {
              items: true,
            },
          });

        if (!order) {
          throw new Error(
            "Order not found."
          );
        }

        if (
          order.status === "DELIVERED"
        ) {
          throw new Error(
            "Delivered orders cannot be cancelled."
          );
        }

        await tx.order.update({
          where: {
            id,
          },

          data: {
            status: "CANCELLED",
          },
        });

        for (const item of order.items) {
          await tx.product.update({
            where: {
              id: item.productId,
            },

            data: {
              stock: {
                increment:
                  item.quantity,
              },
            },
          });
        }

        return order;
      }
    );
  },

  /* ==========================================
     DELETE ORDER
  ========================================== */

  async deleteOrder(id: number) {
    const order =
      await prisma.order.findUnique({
        where: {
          id,
        },
      });

    if (!order) {
      throw new Error(
        "Order not found."
      );
    }

    return prisma.order.delete({
      where: {
        id,
      },
    });
  },
};