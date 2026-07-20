export interface ReviewInput {
  rating: number;
  comment: string;
}

export const validateReview = (
  data: ReviewInput
): string[] => {
  const errors: string[] = [];

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
    errors.push(
      "Comment must contain at least 5 characters."
    );
  }

  return errors;
};