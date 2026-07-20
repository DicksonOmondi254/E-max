import { prisma } from "../config/prisma";

export interface ReviewData {
  userId: number;
  productId: number;
  rating: number;
  comment: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  distribution: Record<number, number>;
}

export const reviewService = {
  /* ==========================================
     CREATE REVIEW
  ========================================== */

  async createReview(data: ReviewData) {
    const exists = await prisma.productReview.findFirst({
      where: {
        userId: data.userId,
        productId: data.productId,
      },
    });

    if (exists) {
      throw new Error(
        "You have already reviewed this product."
      );
    }

    return prisma.productReview.create({
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

  async getProductReviews(productId: number) {
    return prisma.productReview.findMany({
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

  async updateReview(
    id: number,
    rating: number,
    comment: string
  ) {
    return prisma.productReview.update({
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

  async deleteReview(id: number) {
    return prisma.productReview.delete({
      where: {
        id,
      },
    });
  },

  /* ==========================================
     PRODUCT RATING SUMMARY
  ========================================== */

  async getRatingSummary(productId: number) {
    const reviews = await prisma.productReview.findMany({
      where: {
        productId,
      },
    });

    const total = reviews.length;

    const average =
      total === 0
        ? 0
        : reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / total;

    return {
      totalReviews: total,
      averageRating: Number(average.toFixed(1)),
    };
  },

  /* ==========================================
     ADMIN: GET ALL REVIEWS (paginated)
  ========================================== */

  async getAllReviews(params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const {
      page = 1,
      limit = 20,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const where: any = {};

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

    const orderBy: any = {};
    const sortFieldMap: Record<string, string> = {
      rating: "rating",
      createdAt: "createdAt",
      comment: "comment",
      product: "productId",
      user: "userId",
    };
    const field = sortFieldMap[sortBy] || "createdAt";
    orderBy[field] = sortOrder;

    const [reviews, total] = await Promise.all([
      prisma.productReview.findMany({
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
      prisma.productReview.count({ where }),
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

  async getReviewStats(): Promise<ReviewStats> {
    const reviews = await prisma.productReview.findMany({
      select: { rating: true },
    });

    const total = reviews.length;
    const average =
      total === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) / total;

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
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
