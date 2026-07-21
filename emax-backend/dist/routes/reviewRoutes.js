"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/* Public */
router.get("/product/:productId", reviewController_1.getProductReviews);
/* Protected */
router.get("/", authMiddleware_1.protect, reviewController_1.getAllReviews);
router.get("/stats", authMiddleware_1.protect, reviewController_1.getReviewStats);
router.post("/product/:productId", authMiddleware_1.protect, reviewController_1.createReview);
router.put("/:id", authMiddleware_1.protect, reviewController_1.updateReview);
router.delete("/:id", authMiddleware_1.protect, reviewController_1.deleteReview);
exports.default = router;
