import { prisma } from "../config/prisma";

export const brandService = {
  async getAllBrands() {
    return prisma.brand.findMany({
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

  async getBrandById(id: number) {
    return prisma.brand.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  },

  async createBrand(data: {
    name: string;
    logo?: string;
  }) {
    const existing = await prisma.brand.findUnique({
      where: {
        name: data.name.trim(),
      },
    });

    if (existing) {
      throw new Error("Brand already exists.");
    }

    return prisma.brand.create({
      data: {
        name: data.name.trim(),
        logo: data.logo?.trim(),
      },
    });
  },

  async updateBrand(
    id: number,
    data: {
      name?: string;
      logo?: string;
    }
  ) {
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new Error("Brand not found.");
    }

    if (data.name) {
      const existing = await prisma.brand.findFirst({
        where: {
          name: data.name.trim(),
          NOT: {
            id,
          },
        },
      });

      if (existing) {
        throw new Error(
          "Another brand with this name already exists."
        );
      }
    }

    return prisma.brand.update({
      where: { id },
      data: {
        ...(data.name && {
          name: data.name.trim(),
        }),
        ...(data.logo !== undefined && {
          logo: data.logo.trim(),
        }),
      },
    });
  },

  async deleteBrand(id: number) {
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!brand) {
      throw new Error("Brand not found.");
    }

    if (brand._count.products > 0) {
      throw new Error(
        "Cannot delete brand because it contains products."
      );
    }

    return prisma.brand.delete({
      where: { id },
    });
  },
};