import { Router } from "express";

import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getAllReviews,
  getReviewStats,
} from "../controllers/reviewController";

import { protect } from "../middlewares/authMiddleware";

const router = Router();

/* Public */

router.get(
  "/product/:productId",
  getProductReviews
);

/* Protected */

router.get("/", protect, getAllReviews);
router.get("/stats", protect, getReviewStats);

router.post(
  "/product/:productId",
  protect,
  createReview
);

router.put(
  "/:id",
  protect,
  updateReview
);

router.delete(
  "/:id",
  protect,
  deleteReview
);

export default router;
