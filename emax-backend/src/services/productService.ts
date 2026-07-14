import { prisma } from "../config/prisma";

export interface ProductData {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
 thumbnail: string;
  featured: boolean;
  active?: boolean;
  categoryId: number;
  brandId: number;
}

export const productService = {
  /* ==========================================
     GET ALL PRODUCTS
  ========================================== */
  async getAllProducts() {
    return prisma.product.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /* ==========================================
     GET ACTIVE PRODUCTS (STORE)
  ========================================== */
  async getActiveProducts() {
    return prisma.product.findMany({
      where: {
        active: true,
      },
      include: {
        category: true,
        brand: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /* ==========================================
     GET PRODUCT BY ID
  ========================================== */
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

  /* ==========================================
     GET PRODUCT BY SLUG
  ========================================== */
  async getProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
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

  /* ==========================================
     SEARCH PRODUCTS
  ========================================== */
  async searchProducts(keyword: string) {
    return prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        category: true,
        brand: true,
      },
    });
  },

  /* ==========================================
     CREATE PRODUCT
  ========================================== */
  async createProduct(data: ProductData) {
    return prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        stock: data.stock,
        thumbnail: data.thumbnail,
        featured: data.featured,
        active: data.active ?? true,

        category: {
          connect: {
            id: data.categoryId,
          },
        },

        brand: {
          connect: {
            id: data.brandId,
          },
        },

        images: data.thumbnail
          ? {
              create: [
                {
                  image: data.thumbnail,
                },
              ],
            }
          : undefined,
      },

      include: {
        category: true,
        brand: true,
        images: true,
      },
    });
  },

  /* ==========================================
     UPDATE PRODUCT
  ========================================== */
  async updateProduct(
    id: number,
    data: Partial<ProductData>
  ) {
    return prisma.product.update({
      where: { id },

      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),

        ...(data.slug !== undefined && {
          slug: data.slug,
        }),

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.price !== undefined && {
          price: data.price,
        }),

        ...(data.stock !== undefined && {
          stock: data.stock,
        }),

        ...(data.thumbnail !== undefined && {
          thumbnail: data.thumbnail,
        }),

        ...(data.featured !== undefined && {
          featured: data.featured,
        }),

        ...(data.active !== undefined && {
          active: data.active,
        }),

        ...(data.categoryId && {
          category: {
            connect: {
              id: data.categoryId,
            },
          },
        }),

        ...(data.brandId && {
          brand: {
            connect: {
              id: data.brandId,
            },
          },
        }),
      },

      include: {
        category: true,
        brand: true,
        images: true,
      },
    });
  },

  /* ==========================================
     TOGGLE FEATURED
  ========================================== */
  async toggleFeatured(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    return prisma.product.update({
      where: { id },
      data: {
        featured: !product.featured,
      },
    });
  },

  /* ==========================================
     TOGGLE STATUS
  ========================================== */
  async toggleStatus(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    return prisma.product.update({
      where: { id },
      data: {
        active: !product.active,
      },
    });
  },

  /* ==========================================
     DELETE PRODUCT
  ========================================== */
  async deleteProduct(id: number) {
    await prisma.productImage.deleteMany({
      where: {
        productId: id,
      },
    });

    return prisma.product.delete({
      where: {
        id,
      },
    });
  },
};