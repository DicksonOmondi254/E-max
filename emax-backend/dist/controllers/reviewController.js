"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.getProductReviews = exports.createReview = void 0;
const reviewService_1 = require("../services/reviewService");
const reviewValidation_1 = require("../validations/reviewValidation");
/* ==========================================
   CREATE REVIEW
========================================== */
const createReview = async (req, res) => {
    try {
        const userId = Number(req.user.id);
        const productId = Number(req.params.productId);
        const errors = (0, reviewValidation_1.validateReview)({
            rating: Number(req.body.rating),
            comment: req.body.comment,
        });
        if (errors.length) {
            return res.status(400).json({
                success: false,
                errors,
            });
        }
        const review = await reviewService_1.reviewService.createReview({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to create review.",
        });
    }
};
exports.createReview = createReview;
/* ==========================================
   GET PRODUCT REVIEWS
========================================== */
const getProductReviews = async (req, res) => {
    try {
        const productId = Number(req.params.productId);
        const reviews = await reviewService_1.reviewService.getProductReviews(productId);
        const summary = await reviewService_1.reviewService.getRatingSummary(productId);
        res.status(200).json({
            success: true,
            ...summary,
            data: reviews,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to fetch reviews.",
        });
    }
};
exports.getProductReviews = getProductReviews;
/* ==========================================
   UPDATE REVIEW
========================================== */
const updateReview = async (req, res) => {
    try {
        const review = await reviewService_1.reviewService.updateReview(Number(req.params.id), Number(req.body.rating), req.body.comment);
        res.json({
            success: true,
            message: "Review updated successfully.",
            data: review,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to update review.",
        });
    }
};
exports.updateReview = updateReview;
/* ==========================================
   DELETE REVIEW
========================================== */
const deleteReview = async (req, res) => {
    try {
        await reviewService_1.reviewService.deleteReview(Number(req.params.id));
        res.json({
            success: true,
            message: "Review deleted successfully.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to delete review.",
        });
    }
};
exports.deleteReview = deleteReview;
