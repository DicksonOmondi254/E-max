import { prisma } from "../config/prisma";

export const brandService = {
  async getAllBrands() {
    return prisma.brand.findMany({
      orderBy: {
        name: "asc",
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
    return prisma.brand.create({
      data,
    });
  },

  async updateBrand(
    id: number,
    data: {
      name?: string;
      logo?: string;
    }
  ) {
    return prisma.brand.update({
      where: { id },
      data,
    });
  },

  async deleteBrand(id: number) {
    return prisma.brand.delete({
      where: { id },
    });
  },
};