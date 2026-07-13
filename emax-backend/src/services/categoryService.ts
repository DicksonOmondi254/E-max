import { prisma } from "../config/prisma";

export const categoryService = {
  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
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
    const existing = await prisma.category.findUnique({
      where: {
        name: data.name.trim(),
      },
    });

    if (existing) {
      throw new Error("Category already exists.");
    }

    return prisma.category.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim(),
      },
    });
  },

  async updateCategory(
    id: number,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error("Category not found.");
    }

    if (data.name) {
      const existing = await prisma.category.findFirst({
        where: {
          name: data.name.trim(),
          NOT: {
            id,
          },
        },
      });

      if (existing) {
        throw new Error(
          "Another category with this name already exists."
        );
      }
    }

    return prisma.category.update({
      where: { id },
      data: {
        ...(data.name && {
          name: data.name.trim(),
        }),
        ...(data.description !== undefined && {
          description: data.description.trim(),
        }),
      },
    });
  },

  async deleteCategory(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new Error("Category not found.");
    }

    if (category._count.products > 0) {
      throw new Error(
        "Cannot delete category because it contains products."
      );
    }

    return prisma.category.delete({
      where: { id },
    });
  },
};