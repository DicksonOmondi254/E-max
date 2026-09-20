import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaComments, FaStar, FaReply, FaShareAlt, FaChartBar,
  FaBullhorn, FaSmile, FaCheckCircle, FaStarHalfAlt,
  FaFilter, FaSearch, FaTimes, FaLightbulb,
  FaRegStar, FaStar as FaStarFull,
} from "react-icons/fa";
import { sellerService } from "../../services/sellerService";
import type { SellerReview } from "../../services/sellerService";
import "./Messages.css";

type FilterTab = "all" | "positive" | "critical";

const SellerMessages = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<SellerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await sellerService.getReviews();
        setReviews(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load reviews.");
      } finally { setLoading(false); }
    };
    load();
  }, []);

  // ── Derived data ──

  const avgRating = useMemo(
    () => reviews.reduce((a, r) => a + r.rating, 0) / (reviews.length || 1),
    [reviews]
  );

  const distribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++; });
    return dist;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let filtered = reviews;
    if (activeTab === "positive") filtered = filtered.filter((r) => r.rating >= 4);
    if (activeTab === "critical") filtered = filtered.filter((r) => r.rating <= 2);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.customerName?.toLowerCase().includes(q) ||
          r.comment?.toLowerCase().includes(q) ||
          r.productName?.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [reviews, activeTab, searchQuery]);

  // ── Render helpers ──

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => (
    <div className={`s-r-stars s-r-stars--${size}`}>
      {Array.from({ length: 5 }).map((_, idx) => {
        const filled = idx < Math.floor(rating);
        const half = !filled && idx < rating;
        return (
          <span key={idx} className={`s-r-star ${filled ? "s-r-star--filled" : half ? "s-r-star--half" : "s-r-star--empty"}`}>
            {filled ? <FaStarFull /> : half ? <FaStarHalfAlt /> : <FaRegStar />}
          </span>
        );
      })}
    </div>
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getReviewGrade = (rating: number) => {
    if (rating >= 4) return { label: "Positive", className: "s-r-grade--positive" };
    if (rating === 3) return { label: "Neutral", className: "s-r-grade--neutral" };
    return { label: "Critical", className: "s-r-grade--critical" };
  };

  // ── Loading / Error ──

  if (loading) {
    return (
      <div className="seller-page">
        <div className="s-loading-container">
          <FaComments className="s-loading-spinner" />
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-page">
        <div className="s-alert s-alert-danger">{error}</div>
      </div>
    );
  }

  const noReviews = reviews.length === 0;
  const noFilteredResults = !noReviews && filteredReviews.length === 0;

  return (
    <div className="seller-page s-messages-page">
      {/* ── Page Header ── */}
      <div className="s-page-header">
        <div>
          <h1><FaComments className="s-page-icon" /> Messages & Reviews</h1>
          <p className="s-page-subtitle">Stay on top of customer feedback and ratings</p>
        </div>
      </div>

      {/* ── Rating Overview Hero ── */}
      {!noReviews && (
        <div className="s-r-hero">
          <div className="s-r-hero-glow" />
          <div className="s-r-hero-content">
            <div className="s-r-hero-main">
              <div className="s-r-hero-score">
                <span className="s-r-hero-number">{avgRating.toFixed(1)}</span>
                <div className="s-r-hero-stars">{renderStars(avgRating, "md")}</div>
                <span className="s-r-hero-total">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="s-r-hero-distribution">
                {distribution.map((count, idx) => {
                  const starNum = 5 - idx;
                  const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={idx} className="s-r-dist-row">
                      <span className="s-r-dist-label">{starNum} ★</span>
                      <div className="s-r-dist-track">
                        <div className="s-r-dist-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="s-r-dist-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="s-r-hero-meta">
              <div className="s-r-hero-chip">
                <FaSmile /> {Math.round((distribution.slice(3).reduce((a, b) => a + b, 0) / (reviews.length || 1)) * 100)}% Positive
              </div>
              <div className="s-r-hero-chip">
                <FaChartBar /> Avg. rating
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Empty State (modern) ── */}
      {noReviews && (
        <div className="s-r-empty-modern">
          <div className="s-r-empty-bg-shapes">
            <div className="s-r-empty-shape s-r-empty-shape--1" />
            <div className="s-r-empty-shape s-r-empty-shape--2" />
            <div className="s-r-empty-shape s-r-empty-shape--3" />
          </div>
          <div className="s-r-empty-content">
            <div className="s-r-empty-icon-wrap">
              <FaComments className="s-r-empty-main-icon" />
              <FaStar className="s-r-empty-star-icon" />
            </div>
            <h3 className="s-r-empty-title">No reviews yet</h3>
            <p className="s-r-empty-desc">
              Reviews from customers will appear here. Encourage your buyers to leave feedback to build trust and grow your sales!
            </p>
            <div className="s-r-empty-actions">
              <button className="s-btn s-btn-primary" onClick={() => {
                navigator.clipboard?.writeText(window.location.origin + "/shop/" + "your-store");
                alert("Store link copied to clipboard!");
              }}>
                <FaShareAlt /> Copy Store Link
              </button>
              <span className="s-r-empty-or">or</span>
              <button className="s-btn s-btn-secondary" onClick={() => {
                navigate("/seller/promotions");
              }}>
                <FaBullhorn /> Promote Products
              </button>
            </div>
          </div>
          {/* Tips Card */}
          <div className="s-r-tips-card">
            <div className="s-r-tips-header">
              <FaLightbulb className="s-r-tips-icon" />
              <span>Tips to get more reviews</span>
            </div>
            <div className="s-r-tips-list">
              <div className="s-r-tip-item">
                <FaCheckCircle className="s-r-tip-check" />
                <span>Deliver products on time and in perfect condition</span>
              </div>
              <div className="s-r-tip-item">
                <FaCheckCircle className="s-r-tip-check" />
                <span>Follow up with a friendly thank-you message after purchase</span>
              </div>
              <div className="s-r-tip-item">
                <FaCheckCircle className="s-r-tip-check" />
                <span>Offer a small discount on the next purchase in exchange for a review</span>
              </div>
              <div className="s-r-tip-item">
                <FaCheckCircle className="s-r-tip-check" />
                <span>Respond to existing reviews to show you value feedback</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reviews Section (when data exists) ── */}
      {!noReviews && (
        <>
          {/* Filter & Search Bar */}
          <div className="s-r-filter-bar">
            <div className="s-r-tabs">
              <button
                className={`s-r-tab ${activeTab === "all" ? "s-r-tab--active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                <FaFilter /> All ({reviews.length})
              </button>
              <button
                className={`s-r-tab ${activeTab === "positive" ? "s-r-tab--active" : ""}`}
                onClick={() => setActiveTab("positive")}
              >
                <FaSmile /> Positive
              </button>
              <button
                className={`s-r-tab ${activeTab === "critical" ? "s-r-tab--active" : ""}`}
                onClick={() => setActiveTab("critical")}
              >
                <FaTimes /> Critical
              </button>
            </div>
            <div className="s-r-search">
              <FaSearch className="s-r-search-icon" />
              <input
                type="text"
                className="s-r-search-input"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="s-r-search-clear" onClick={() => setSearchQuery("")}>
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* No filtered results */}
          {noFilteredResults && (
            <div className="s-r-empty-filtered">
              <FaSearch className="s-r-empty-filtered-icon" />
              <p>No reviews match your search or filter. Try a different term.</p>
            </div>
          )}

          {/* Reviews List */}
          {!noFilteredResults && (
            <div className="s-r-list">
              {filteredReviews.map((r, i) => {
                const grade = getReviewGrade(r.rating);
                return (
                  <div key={r.id || i} className="s-r-card">
                    <div className="s-r-card-top">
                      <div className="s-r-card-left">
                        <div className="s-r-avatar" data-grade={grade.className.replace("s-r-grade--", "")}>
                          {r.customerName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="s-r-card-info">
                          <div className="s-r-card-name-row">
                            <strong className="s-r-customer-name">{r.customerName || "Anonymous"}</strong>
                            <span className={`s-r-grade ${grade.className}`}>{grade.label}</span>
                          </div>
                          <div className="s-r-card-stars-row">
                            {renderStars(r.rating)}
                            <span className="s-r-card-date">{formatDate(r.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="s-r-product-badge">
                        <FaComments className="s-r-product-badge-icon" />
                        <span>{r.productName}</span>
                      </div>
                    </div>
                    <div className="s-r-card-body">
                      <p className="s-r-comment">{r.comment || "No comment provided."}</p>
                    </div>
                    <div className="s-r-card-actions">
                      <button className="s-r-reply-btn" title="Reply to this review">
                        <FaReply /> Reply
                      </button>
                      <div className="s-r-card-meta">
                        <span className="s-r-rating-badge">
                          <FaStar /> {r.rating}/5
                        </span>
                      </div>
                    </div>
                    {/* Hover glow effect */}
                    <div className="s-r-card-glow" />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SellerMessages;
