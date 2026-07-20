"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = void 0;
const prisma_1 = require("../config/prisma");
exports.reviewService = {
    /* ==========================================
       CREATE REVIEW
    ========================================== */
    async createReview(data) {
        const exists = await prisma_1.prisma.productReview.findFirst({
            where: {
                userId: data.userId,
                productId: data.productId,
            },
        });
        if (exists) {
            throw new Error("You have already reviewed this product.");
        }
        return prisma_1.prisma.productReview.create({
            data,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    },
    /* ==========================================
       GET PRODUCT REVIEWS
    ========================================== */
    async getProductReviews(productId) {
        return prisma_1.prisma.productReview.findMany({
            where: {
                productId,
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    /* ==========================================
       UPDATE REVIEW
    ========================================== */
    async updateReview(id, rating, comment) {
        return prisma_1.prisma.productReview.update({
            where: {
                id,
            },
            data: {
                rating,
                comment,
            },
        });
    },
    /* ==========================================
       DELETE REVIEW
    ========================================== */
    async deleteReview(id) {
        return prisma_1.prisma.productReview.delete({
            where: {
                id,
            },
        });
    },
    /* ==========================================
       PRODUCT RATING SUMMARY
    ========================================== */
    async getRatingSummary(productId) {
        const reviews = await prisma_1.prisma.productReview.findMany({
            where: {
                productId,
            },
        });
        const total = reviews.length;
        const average = total === 0
            ? 0
            : reviews.reduce((sum, review) => sum + review.rating, 0) / total;
        return {
            totalReviews: total,
            averageRating: Number(average.toFixed(1)),
        };
    },
};
