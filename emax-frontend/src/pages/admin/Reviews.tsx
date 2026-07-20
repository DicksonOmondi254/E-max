import { useEffect, useMemo, useState, useCallback } from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaTimes,
  FaTrash,
  FaUser,
  FaBox,
  FaCalendarAlt,
  FaCommentAlt,
} from "react-icons/fa";

import { reviewService } from "../../services/reviewService";
import type { AdminReview, ReviewStats } from "../../services/reviewService";

type SortField = "rating" | "createdAt" | "user" | "product";
type SortOrder = "asc" | "desc";

const PAGE_SIZE = 12;

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateFull = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StarDisplay = ({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className="star-filled" />);
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(<FaStarHalfAlt key={i} className="star-filled" />);
    } else {
      stars.push(<FaRegStar key={i} className="star-empty" />);
    }
  }
  return <span className="star-display">{stars}</span>;
};

const Reviews = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Success/error toast state
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await reviewService.getAllReviews();
      setReviews(result.reviews || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const result = await reviewService.getReviewStats();
      setStats(result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [loadReviews, loadStats]);

  // Compute stats from local data if API not available
  const computedStats = useMemo(() => {
    if (stats) return stats;

    const total = reviews.length;
    if (total === 0) {
      return { totalReviews: 0, averageRating: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    }
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    const average = sum / total;
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });
    return { totalReviews: total, averageRating: Number(average.toFixed(1)), distribution };
  }, [reviews, stats]);

  // Filter & Sort
  const filtered = useMemo(() => {
    let result = [...reviews];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((r) => {
        const userName = `${r.user?.firstName ?? ""} ${r.user?.lastName ?? ""}`.toLowerCase();
        const productName = (r.product?.name ?? "").toLowerCase();
        const comment = (r.comment ?? "").toLowerCase();
        return userName.includes(q) || productName.includes(q) || comment.includes(q);
      });
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "rating":
          cmp = a.rating - b.rating;
          break;
        case "createdAt":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "user":
          cmp = `${a.user?.firstName ?? ""} ${a.user?.lastName ?? ""}`.localeCompare(
            `${b.user?.firstName ?? ""} ${b.user?.lastName ?? ""}`
          );
          break;
        case "product":
          cmp = (a.product?.name ?? "").localeCompare(b.product?.name ?? "");
          break;
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  }, [reviews, debouncedSearch, sortBy, sortOrder]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) return <FaSort className="sort-icon" />;
    return sortOrder === "asc" ? <FaSortUp className="sort-icon active" /> : <FaSortDown className="sort-icon active" />;
  };

  // Delete review
  const handleDeleteReview = async (reviewId: number) => {
    try {
      setActionLoading(reviewId);
      await reviewService.deleteReview(reviewId);
      showToast("success", "Review deleted successfully.");
      setDeleteConfirm(null);
      if (selectedReview?.id === reviewId) setSelectedReview(null);
      loadReviews();
      loadStats();
    } catch (err: any) {
      showToast("error", err?.message || "Failed to delete review.");
    } finally {
      setActionLoading(null);
    }
  };

  // Compute rating distribution for stats display
  const dist = computedStats.distribution || {};

  return (
    <div className="admin-page reviews-page">
      {/* Toast Notification */}
      {toast && (
        <div className={`reviews-toast reviews-toast--${toast.type}`}>
          <span>{toast.type === "success" ? "\u2713" : "\u2715"}</span>
          <span>{toast.message}</span>
          <button className="reviews-toast-close" onClick={() => setToast(null)}>\u2715</button>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <FaStar className="page-header-icon" />
            Reviews
          </h1>
          <p className="page-subtitle">
            {loading ? "Loading reviews..." : `Manage ${reviews.length} customer review${reviews.length !== 1 ? "s" : ""}.`}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="reviews-stats-grid">
        <div className="reviews-stat-card reviews-stat-card--total">
          <div className="reviews-stat-icon">
            <FaCommentAlt />
          </div>
          <div className="reviews-stat-info">
            <span className="reviews-stat-value">
              {statsLoading ? "..." : computedStats.totalReviews}
            </span>
            <span className="reviews-stat-label">Total Reviews</span>
          </div>
        </div>
        <div className="reviews-stat-card reviews-stat-card--average">
          <div className="reviews-stat-icon">
            <FaStar />
          </div>
          <div className="reviews-stat-info">
            <span className="reviews-stat-value">
              {statsLoading ? "..." : computedStats.averageRating.toFixed(1)}
            </span>
            <span className="reviews-stat-label">Average Rating</span>
          </div>
        </div>
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className={`reviews-stat-card reviews-stat-card--${star}star`}>
            <div className="reviews-stat-icon">{star}</div>
            <div className="reviews-stat-info">
              <span className="reviews-stat-value">
                {statsLoading ? "..." : (dist[star] ?? 0)}
              </span>
              <span className="reviews-stat-label">{star} Star</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Toolbar */}
      <div className="table-toolbar">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by customer name, product or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>
              \u2715
            </button>
          )}
        </div>
        <span className="toolbar-info">
          {loading ? "Loading..." : `${filtered.length} review${filtered.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Error State */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">\u26A0\uFE0F</span>
          <span>{error}</span>
          <button className="alert-retry" onClick={loadReviews}>Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table className="admin-table reviews-table">
          <thead>
            <tr>
              <th className="th-reviewer" onClick={() => handleSort("user")}>
                Reviewer {getSortIcon("user")}
              </th>
              <th className="th-product" onClick={() => handleSort("product")}>
                Product {getSortIcon("product")}
              </th>
              <th className="th-rating" onClick={() => handleSort("rating")}>
                Rating {getSortIcon("rating")}
              </th>
              <th className="th-comment">Comment</th>
              <th className="th-date" onClick={() => handleSort("createdAt")}>
                Date {getSortIcon("createdAt")}
              </th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={`skel-${idx}`} className="skeleton-row">
                  <td><div className="skeleton-cell skeleton-cell--reviewer" /></td>
                  <td><div className="skeleton-cell skeleton-cell--product" /></td>
                  <td><div className="skeleton-cell skeleton-cell--rating" /></td>
                  <td><div className="skeleton-cell skeleton-cell--comment" /></td>
                  <td><div className="skeleton-cell skeleton-cell--date" /></td>
                  <td><div className="skeleton-cell skeleton-cell--actions" /></td>
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={6}>
                  <div className="empty-state">
                    <FaStar className="empty-icon" />
                    <h3>No reviews found</h3>
                    <p>
                      {debouncedSearch
                        ? `No reviews matching "${debouncedSearch}".`
                        : "No reviews have been submitted yet."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((review) => (
                <tr
                  key={review.id}
                  className={`review-row ${selectedReview?.id === review.id ? "selected" : ""}`}
                >
                  {/* Reviewer */}
                  <td className="td-reviewer">
                    <div className="reviewer-info-cell">
                      <div className="reviewer-avatar-sm">
                        {(review.user?.firstName?.charAt(0) ?? "?")}
                        {(review.user?.lastName?.charAt(0) ?? "")}
                      </div>
                      <div className="reviewer-details-sm">
                        <span className="reviewer-name-sm">
                          {review.user?.firstName ?? ""} {review.user?.lastName ?? ""}
                        </span>
                        <span className="reviewer-email-sm">{review.user?.email ?? ""}</span>
                      </div>
                    </div>
                  </td>

                  {/* Product */}
                  <td className="td-product">
                    <span className="review-product-name">{review.product?.name ?? "-"}</span>
                  </td>

                  {/* Rating */}
                  <td className="td-rating">
                    <div className="review-rating-cell">
                      <StarDisplay rating={review.rating} />
                      <span className="review-rating-number">{review.rating}/5</span>
                    </div>
                  </td>

                  {/* Comment */}
                  <td className="td-comment">
                    <p className="review-comment-text">
                      {review.comment?.length > 80
                        ? `${review.comment.substring(0, 80)}...`
                        : review.comment ?? "-"}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="td-date">
                    <span className="date-text">{formatDate(review.createdAt)}</span>
                  </td>

                  {/* Actions */}
                  <td className="td-actions">
                    <div className="review-actions-group">
                      <button
                        className="review-action-btn review-action-btn--view"
                        title="View Details"
                        onClick={() => setSelectedReview(review)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="review-action-btn review-action-btn--delete"
                        title="Delete Review"
                        onClick={() => setDeleteConfirm(review.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Delete Confirm */}
                    {deleteConfirm === review.id && (
                      <div className="review-delete-confirm">
                        <span className="delete-confirm-text">Delete this review?</span>
                        <div className="delete-confirm-actions">
                          <button
                            className="delete-confirm-yes"
                            onClick={() => handleDeleteReview(review.id)}
                            disabled={actionLoading === review.id}
                          >
                            {actionLoading === review.id ? "..." : "Yes"}
                          </button>
                          <button
                            className="delete-confirm-no"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <FaChevronLeft /> Previous
          </button>

          <div className="pagination-pages">
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, idx) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = idx + 1;
              } else if (page <= 4) {
                pageNum = idx + 1;
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + idx;
              } else {
                pageNum = page - 3 + idx;
              }
              return (
                <button
                  key={pageNum}
                  className={`pagination-page ${page === pageNum ? "active" : ""}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="pagination-btn"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="review-detail-overlay" onClick={() => setSelectedReview(null)}>
          <div className="review-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="review-detail-header">
              <div className="review-detail-title">
                <h2>Review Details</h2>
                <div className="review-detail-rating">
                  <StarDisplay rating={selectedReview.rating} />
                  <span className="review-detail-rating-number">{selectedReview.rating}/5</span>
                </div>
              </div>
              <button className="review-detail-close" onClick={() => setSelectedReview(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="review-detail-body">
              {/* Customer Info */}
              <div className="review-detail-section">
                <h3 className="review-detail-section-title">
                  <FaUser /> Customer Information
                </h3>
                <div className="review-detail-info-grid">
                  <div className="review-detail-info-item">
                    <FaUser className="info-icon" />
                    <span>{selectedReview.user?.firstName ?? ""} {selectedReview.user?.lastName ?? ""}</span>
                  </div>
                  <div className="review-detail-info-item">
                    <FaCalendarAlt className="info-icon" />
                    <span>Reviewed on {formatDateFull(selectedReview.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="review-detail-section">
                <h3 className="review-detail-section-title">
                  <FaBox /> Product Information
                </h3>
                <div className="review-detail-info-grid">
                  <div className="review-detail-info-item">
                    <FaBox className="info-icon" />
                    <span className="review-product-link">{selectedReview.product?.name ?? "-"}</span>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="review-detail-section">
                <h3 className="review-detail-section-title">
                  <FaCommentAlt /> Review Comment
                </h3>
                <div className="review-detail-comment-box">
                  <p className="review-detail-comment-text">
                    {selectedReview.comment ?? "No comment provided."}
                  </p>
                </div>
              </div>

              {/* Delete Action */}
              <div className="review-detail-section">
                <h3 className="review-detail-section-title">
                  <FaTrash /> Actions
                </h3>
                <div className="review-detail-actions">
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setDeleteConfirm(selectedReview.id);
                      setSelectedReview(null);
                    }}
                  >
                    <FaTrash /> Delete Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
