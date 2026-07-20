"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReview = void 0;
const validateReview = (data) => {
    const errors = [];
    if (!data.rating) {
        errors.push("Rating is required.");
    }
    if (data.rating < 1 || data.rating > 5) {
        errors.push("Rating must be between 1 and 5.");
    }
    if (!data.comment?.trim()) {
        errors.push("Comment is required.");
    }
    if (data.comment.length < 5) {
        errors.push("Comment must contain at least 5 characters.");
    }
    return errors;
};
exports.validateReview = validateReview;
