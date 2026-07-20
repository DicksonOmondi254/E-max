import { Request, Response } from "express";
import { reviewService } from "../services/reviewService";
import { validateReview } from "../validations/reviewValidation";

/* ==========================================
   CREATE REVIEW
========================================== */

export const createReview = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number((req as any).user.id);
    const productId = Number(req.params.productId);

    const errors = validateReview({
      rating: Number(req.body.rating),
      comment: req.body.comment,
    });

    if (errors.length) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const review =
      await reviewService.createReview({
        userId,
        productId,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data: review,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create review.",
    });
  }
};

/* ==========================================
   GET PRODUCT REVIEWS
========================================== */

export const getProductReviews = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = Number(req.params.productId);

    const reviews =
      await reviewService.getProductReviews(
        productId
      );

    const summary =
      await reviewService.getRatingSummary(
        productId
      );

    res.status(200).json({
      success: true,
      ...summary,
      data: reviews,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch reviews.",
    });
  }
};

/* ==========================================
   UPDATE REVIEW
========================================== */

export const updateReview = async (
  req: Request,
  res: Response
) => {
  try {
    const review =
      await reviewService.updateReview(
        Number(req.params.id),
        Number(req.body.rating),
        req.body.comment
      );

    res.json({
      success: true,
      message: "Review updated successfully.",
      data: review,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update review.",
    });
  }
};

/* ==========================================
   DELETE REVIEW
========================================== */

export const deleteReview = async (
  req: Request,
  res: Response
) => {
  try {
    await reviewService.deleteReview(
      Number(req.params.id)
    );

    res.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete review.",
    });
  }
};

/* ==========================================
   ADMIN: GET ALL REVIEWS (paginated)
========================================== */

export const getAllReviews = async (
  req: Request,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || "";
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    const result = await reviewService.getAllReviews({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch reviews.",
    });
  }
};

/* ==========================================
   ADMIN: GET REVIEW STATS
========================================== */

export const getReviewStats = async (
  req: Request,
  res: Response
) => {
  try {
    const stats = await reviewService.getReviewStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch review statistics.",
    });
  }
};
