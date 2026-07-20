import { prisma } from "../config/prisma";

export const wishlistService = {
  /* ==========================================
     GET OR CREATE WISHLIST
  ========================================== */
  async getWishlist(userId: number) {
    let wishlist = await prisma.wishlist.findUnique({
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

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
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
    }

    return wishlist;
  },

  /* ==========================================
     ADD PRODUCT
  ========================================== */
  async addItem(userId: number, productId: number) {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
      });
    }

    const exists = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (exists) {
      return exists;
    }

    return prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
      include: {
        product: true,
      },
    });
  },

  /* ==========================================
     REMOVE PRODUCT
  ========================================== */
  async removeItem(userId: number, productId: number) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      throw new Error("Wishlist not found.");
    }

    return prisma.wishlistItem.delete({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });
  },

  /* ==========================================
     CLEAR WISHLIST
  ========================================== */
  async clearWishlist(userId: number) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) return;

    await prisma.wishlistItem.deleteMany({
      where: {
        wishlistId: wishlist.id,
      },
    });
  },
};