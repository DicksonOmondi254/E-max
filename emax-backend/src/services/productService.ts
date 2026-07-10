import { prisma } from "../config/prisma";

export const productService = {
  async getAllProducts() {
    return prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        images: true,
        reviews: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getProductById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  },

  async createProduct(data: any) {
    return prisma.product.create({
      data,
    });
  },

  async updateProduct(id: number, data: any) {
    return prisma.product.update({
      where: { id },
      data,
    });
  },

  async deleteProduct(id: number) {
    return prisma.product.delete({
      where: { id },
    });
  },
};