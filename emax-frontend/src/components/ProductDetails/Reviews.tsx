import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
  FaTrash,
  FaEdit,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
} from "react-icons/fa";
import { reviewService } from "../../services/reviewService";
import type { CustomerReview } from "../../services/reviewService";

interface ReviewsProps {
  productId: number;
}

const PAGE_SIZE = 5;

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ReviewStars = ({ rating, interactive, onChange, size }: {
  rating: number;
  interactive?: boolean;
  onChange?: (val: number) => void;
  size?: "sm" | "md" | "lg";
}) => {
  const [hovered, setHovered] = useState(0);
  const starSize = size === "sm" ? 14 : size === "lg" ? 22 : 18;

  return (
    <span className="review-stars" style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || rating);
        return interactive ? (
          <button
            key={star}
            type="button"
            className="star-btn"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontSize: starSize,
              color: filled ? "#f59e0b" : "#d1d5db",
              transition: "color 0.15s ease",
            }}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`${star} star`}
          >
            {filled ? <FaStar /> : <FaRegStar />}
          </button>
        ) : (
          <span
            key={star}
            style={{
              fontSize: starSize,
              color: filled ? "#f59e0b" : "#d1d5db",
            }}
          >
            {filled ? <FaStar /> : <FaRegStar />}
          </span>
        );
      })}
    </span>
  );
};

const Reviews = ({ productId }: ReviewsProps) => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rating summary
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  // Review form
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formComment, setFormComment] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  // Delete confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);
  const paginatedReviews = reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const token = localStorage.getItem("token");

  // Decode user ID from token (simple JWT decode)
  const getCurrentUserId = (): number | null => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || null;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await reviewService.getProductReviews(productId);
      setReviews(result.data || []);
      setTotalReviews(result.totalReviews || 0);
      setAverageRating(result.averageRating || 0);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (formRating === 0) {
      setFormError("Please select a rating.");
      return;
    }
    if (formComment.trim().length < 5) {
      setFormError("Comment must be at least 5 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.createReview(productId, {
        rating: formRating,
        comment: formComment.trim(),
      });
      setShowForm(false);
      setFormRating(0);
      setFormComment("");
      await loadReviews();
    } catch (err: any) {
      setFormError(err?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReview = async (id: number) => {
    if (editRating === 0) return;
    if (editComment.trim().length < 5) return;

    setSubmitting(true);
    try {
      await reviewService.updateReview(id, {
        rating: editRating,
        comment: editComment.trim(),
      });
      setEditingId(null);
      setEditRating(0);
      setEditComment("");
      await loadReviews();
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (id: number) => {
    try {
      await reviewService.deleteCustomerReview(id);
      setDeleteConfirmId(null);
      await loadReviews();
    } catch (err: any) {
      console.error(err);
    }
  };

  const startEditing = (review: CustomerReview) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditRating(0);
    setEditComment("");
  };

  // Reset pagination when reviews change
  useEffect(() => {
    setPage(1);
  }, [reviews.length]);

  // Distribution calculation
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    distribution[r.rating] = (distribution[r.rating] || 0) + 1;
  });

  return (
    <div className="product-reviews">
      {/* Rating Summary */}
      <div className="reviews-summary">
        <div className="reviews-summary-left">
          <div className="reviews-average-rating">
            <span className="reviews-average-number">{averageRating.toFixed(1)}</span>
            <div className="reviews-average-stars">
              <ReviewStars rating={Math.round(averageRating)} size="lg" />
            </div>
            <span className="reviews-total-count">{totalReviews} review{totalReviews !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <div className="reviews-summary-right">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="reviews-distribution-row">
                <span className="reviews-distribution-label">{star} star</span>
                <div className="reviews-distribution-bar">
                  <div
                    className="reviews-distribution-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="reviews-distribution-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Form Trigger */}
      {token ? (
        <div className="reviews-form-section">
          {!showForm && editingId === null && (
            <button
              className="reviews-form-toggle"
              onClick={() => setShowForm(true)}
            >
              <FaStar /> Write a Review
            </button>
          )}

          {/* Create Review Form */}
          {showForm && (
            <form className="reviews-form" onSubmit={handleSubmitReview}>
              <h4 className="reviews-form-title">Write Your Review</h4>

              <div className="reviews-form-field">
                <label>Rating</label>
                <ReviewStars
                  rating={formRating}
                  interactive
                  onChange={setFormRating}
                  size="lg"
                />
              </div>

              <div className="reviews-form-field">
                <label>Comment</label>
                <textarea
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  maxLength={1000}
                />
              </div>

              {formError && <p className="reviews-form-error">{formError}</p>}

              <div className="reviews-form-actions">
                <button
                  type="submit"
                  className="reviews-form-submit"
                  disabled={submitting}
                >
                  {submitting ? <><FaSpinner className="spin" /> Submitting...</> : "Submit Review"}
                </button>
                <button
                  type="button"
                  className="reviews-form-cancel"
                  onClick={() => {
                    setShowForm(false);
                    setFormRating(0);
                    setFormComment("");
                    setFormError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="reviews-login-prompt">
          <p>
            <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
              Sign in
            </a>{" "}
            to write a review.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="reviews-loading">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="reviews-skeleton">
              <div className="skeleton-line skeleton-line--name" />
              <div className="skeleton-line skeleton-line--stars" />
              <div className="skeleton-line skeleton-line--comment" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="reviews-error">
          <p>{error}</p>
          <button onClick={loadReviews}>Retry</button>
        </div>
      )}

      {/* Reviews List */}
      {!loading && !error && reviews.length === 0 && (
        <div className="reviews-empty">
          <FaStar className="reviews-empty-icon" />
          <h4>No reviews yet</h4>
          <p>Be the first to review this product.</p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <>
          <div className="reviews-list">
            {paginatedReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-card-header">
                  <div className="review-card-user">
                    <div className="review-card-avatar">
                      {review.user?.firstName?.charAt(0) ?? "?"}
                      {review.user?.lastName?.charAt(0) ?? ""}
                    </div>
                    <div className="review-card-user-info">
                      <span className="review-card-name">
                        {review.user?.firstName ?? ""} {review.user?.lastName ?? ""}
                      </span>
                      <span className="review-card-date">
                        <FaCalendarAlt /> {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  <ReviewStars rating={review.rating} size="sm" />
                </div>

                {/* Edit Mode */}
                {editingId === review.id ? (
                  <div className="review-edit-form">
                    <div className="reviews-form-field">
                      <label>Rating</label>
                      <ReviewStars
                        rating={editRating}
                        interactive
                        onChange={setEditRating}
                        size="lg"
                      />
                    </div>
                    <div className="reviews-form-field">
                      <label>Comment</label>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={3}
                        maxLength={1000}
                      />
                    </div>
                    <div className="reviews-form-actions">
                      <button
                        className="reviews-form-submit"
                        onClick={() => handleUpdateReview(review.id)}
                        disabled={submitting || editRating === 0 || editComment.trim().length < 5}
                      >
                        {submitting ? "Saving..." : "Save"}
                      </button>
                      <button
                        className="reviews-form-cancel"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="review-card-comment">{review.comment}</p>

                    {/* Actions (own review) */}
                    {currentUserId === review.userId && (
                      <div className="review-card-actions">
                        <button
                          className="review-action-btn review-action-btn--edit"
                          onClick={() => startEditing(review)}
                          title="Edit review"
                        >
                          <FaEdit /> Edit
                        </button>
                        {deleteConfirmId === review.id ? (
                          <span className="review-delete-confirm-inline">
                            <span>Delete?</span>
                            <button onClick={() => handleDeleteReview(review.id)}>Yes</button>
                            <button onClick={() => setDeleteConfirmId(null)}>No</button>
                          </span>
                        ) : (
                          <button
                            className="review-action-btn review-action-btn--delete"
                            onClick={() => setDeleteConfirmId(review.id)}
                            title="Delete review"
                          >
                            <FaTrash /> Delete
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="reviews-pagination">
              <button
                className="reviews-page-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <FaChevronLeft />
              </button>
              <span className="reviews-page-info">
                Page {page} of {totalPages}
              </span>
              <button
                className="reviews-page-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reviews;

