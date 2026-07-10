import { prisma } from "../config/prisma";

export const categoryService = {
  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  },

  async getCategoryById(id: number) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  },

  async createCategory(data: {
    name: string;
    description?: string;
  }) {
    return prisma.category.create({
      data,
    });
  },

  async updateCategory(
    id: number,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  async deleteCategory(id: number) {
    return prisma.category.delete({
      where: { id },
    });
  },
};