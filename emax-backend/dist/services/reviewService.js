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
    /* ==========================================
       ADMIN: GET ALL REVIEWS (paginated)
    ========================================== */
    async getAllReviews(params) {
        const { page = 1, limit = 20, search = "", sortBy = "createdAt", sortOrder = "desc", } = params;
        const where = {};
        if (search) {
            where.OR = [
                {
                    comment: { contains: search, mode: "insensitive" },
                },
                {
                    user: {
                        OR: [
                            { firstName: { contains: search, mode: "insensitive" } },
                            { lastName: { contains: search, mode: "insensitive" } },
                            { email: { contains: search, mode: "insensitive" } },
                        ],
                    },
                },
                {
                    product: {
                        name: { contains: search, mode: "insensitive" },
                    },
                },
            ];
        }
        const orderBy = {};
        const sortFieldMap = {
            rating: "rating",
            createdAt: "createdAt",
            comment: "comment",
            product: "productId",
            user: "userId",
        };
        const field = sortFieldMap[sortBy] || "createdAt";
        orderBy[field] = sortOrder;
        const [reviews, total] = await Promise.all([
            prisma_1.prisma.productReview.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            thumbnail: true,
                        },
                    },
                },
            }),
            prisma_1.prisma.productReview.count({ where }),
        ]);
        return {
            reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },
    /* ==========================================
       ADMIN: GET REVIEW STATS
    ========================================== */
    async getReviewStats() {
        const reviews = await prisma_1.prisma.productReview.findMany({
            select: { rating: true },
        });
        const total = reviews.length;
        const average = total === 0
            ? 0
            : reviews.reduce((sum, r) => sum + r.rating, 0) / total;
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach((r) => {
            distribution[r.rating] = (distribution[r.rating] || 0) + 1;
        });
        return {
            totalReviews: total,
            averageRating: Number(average.toFixed(1)),
            distribution,
        };
    },
};
