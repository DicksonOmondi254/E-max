"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistService = void 0;
const prisma_1 = require("../config/prisma");
exports.wishlistService = {
    /* ==========================================
       GET OR CREATE WISHLIST
    ========================================== */
    async getWishlist(userId) {
        let wishlist = await prisma_1.prisma.wishlist.findUnique({
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
            wishlist = await prisma_1.prisma.wishlist.create({
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
    async addItem(userId, productId) {
        let wishlist = await prisma_1.prisma.wishlist.findUnique({
            where: { userId },
        });
        if (!wishlist) {
            wishlist = await prisma_1.prisma.wishlist.create({
                data: { userId },
            });
        }
        const exists = await prisma_1.prisma.wishlistItem.findUnique({
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
        return prisma_1.prisma.wishlistItem.create({
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
    async removeItem(userId, productId) {
        const wishlist = await prisma_1.prisma.wishlist.findUnique({
            where: { userId },
        });
        if (!wishlist) {
            throw new Error("Wishlist not found.");
        }
        return prisma_1.prisma.wishlistItem.delete({
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
    async clearWishlist(userId) {
        const wishlist = await prisma_1.prisma.wishlist.findUnique({
            where: { userId },
        });
        if (!wishlist)
            return;
        await prisma_1.prisma.wishlistItem.deleteMany({
            where: {
                wishlistId: wishlist.id,
            },
        });
    },
};
