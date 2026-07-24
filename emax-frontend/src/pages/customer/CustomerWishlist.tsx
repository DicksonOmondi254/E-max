import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaTrash,
  FaShoppingCart,
  FaStore,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";
import CustomerShell from "./CustomerShell";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchWishlist,
  removeFromWishlist,
  clearWishlist,
  selectWishlistItems,
  selectWishlistLoading,
} from "../../redux/wishlistSlice";
import { addToCart } from "../../redux/cartSlice";
import type { WishlistItem } from "../../services/wishlistService";

const API_BASE = "http://localhost:5000";

// ─── Toast Notification ───────────────────────────────────
type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;

// ─── Component ────────────────────────────────────────────
const CustomerWishlist = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const loading = useAppSelector(selectWishlistLoading);

  const [removingId, setRemovingId] = useState<number | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ── Toast helper ──────────────────────────────────────
  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Load wishlist ─────────────────────────────────────
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  // ── Remove from wishlist ──────────────────────────────
  const handleRemove = useCallback(
    async (productId: number) => {
      try {
        setRemovingId(productId);
        await dispatch(removeFromWishlist(productId)).unwrap();
        showToast("Item removed from wishlist", "success");
      } catch {
        showToast("Failed to remove item. Please try again.", "error");
      } finally {
        setRemovingId(null);
      }
    },
    [dispatch, showToast]
  );

  // ── Add to cart ───────────────────────────────────────
  const handleAddToCart = useCallback(
    (item: WishlistItem) => {
      setAddingToCartId(item.id);
      const image = item.image
        ? `${API_BASE}/uploads/products/${item.image}`
        : "/images/no-image.svg";

      dispatch(
        addToCart({
          id: item.productId,
          name: item.name,
          image,
          price: item.price ?? 0,
          quantity: 1,
        })
      );

      // Simulate a short delay for visual feedback
      setTimeout(() => {
        setAddingToCartId(null);
        showToast(`${item.name} added to cart!`, "success");
      }, 400);
    },
    [dispatch, showToast]
  );

  // ── Clear all ─────────────────────────────────────────
  const handleClearAll = useCallback(async () => {
    try {
      await dispatch(clearWishlist()).unwrap();
      showToast("Wishlist cleared successfully", "success");
    } catch {
      showToast("Failed to clear wishlist. Please try again.", "error");
    }
  }, [dispatch, showToast]);

  // ── Image URL helper ──────────────────────────────────
  const getImageUrl = (item: WishlistItem): string => {
    if (item.image) return `${API_BASE}/uploads/products/${item.image}`;
    return "/images/no-image.svg";
  };

  // ── Compute total estimated value ─────────────────────
  const totalValue = items.reduce((sum, it) => sum + (it.price ?? 0), 0);

  // ── Handle error state (from Redux) ───────────────────
  const reduxError = useAppSelector((state) => state.wishlist.error);

  // ── Render ────────────────────────────────────────────
  return (
    <CustomerShell title="My Wishlist">
      {/* ── Toast Container ─────────────────────── */}
      <div className="wishlist-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`wishlist-toast wishlist-toast--${t.type}`}>
            <span className="wishlist-toast-icon">
              {t.type === "success" ? (
                <FaCheckCircle />
              ) : t.type === "error" ? (
                <FaExclamationCircle />
              ) : (
                <FaHeart />
              )}
            </span>
            <span className="wishlist-toast-message">{t.message}</span>
            <button
              className="wishlist-toast-close"
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>

      {/* ── Stats Bar ───────────────────────────── */}
      {!loading && !reduxError && items.length > 0 && (
        <div className="wishlist-stats-bar">
          <div className="wishlist-stat-card wishlist-stat-card--total">
            <div className="wishlist-stat-icon">
              <FaHeart />
            </div>
            <p className="wishlist-stat-value">{items.length}</p>
            <p className="wishlist-stat-label">Total Items</p>
          </div>
          <div className="wishlist-stat-card wishlist-stat-card--value">
            <div className="wishlist-stat-icon">
              <FaShoppingCart />
            </div>
            <p className="wishlist-stat-value">
              KES {totalValue.toLocaleString()}
            </p>
            <p className="wishlist-stat-label">Estimated Value</p>
          </div>
          <div className="wishlist-stat-card wishlist-stat-card--saved">
            <div className="wishlist-stat-icon">
              <FaCheckCircle />
            </div>
            <p className="wishlist-stat-value">{items.length}</p>
            <p className="wishlist-stat-label">Saved for Later</p>
          </div>
          <div className="wishlist-stat-card wishlist-stat-card--action">
            <button
              className="wishlist-clear-btn"
              onClick={handleClearAll}
              title="Clear all items"
            >
              <FaTrash /> Clear All
            </button>
          </div>
        </div>
      )}

      {/* ── Loading State ───────────────────────── */}
      {loading && (
        <div className="wishlist-skeleton">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="wishlist-skeleton-card">
              <div className="wishlist-skeleton-img" />
              <div className="wishlist-skeleton-body">
                <div className="wishlist-skeleton-line skeleton-line--short" />
                <div className="wishlist-skeleton-line skeleton-line--medium" />
                <div className="wishlist-skeleton-line skeleton-line--long" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error State ─────────────────────────── */}
      {!loading && reduxError && (
        <div className="wishlist-error">
          <div className="wishlist-error-icon">
            <FaExclamationCircle />
          </div>
          <h3>Oops! Something went wrong</h3>
          <p>{reduxError}</p>
          <button className="wishlist-retry-btn" onClick={() => dispatch(fetchWishlist())}>
            <FaSpinner /> Try Again
          </button>
        </div>
      )}

      {/* ── Empty State ─────────────────────────── */}
      {!loading && !reduxError && items.length === 0 && (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">
            <FaHeart />
          </div>
          <h3>Your wishlist is empty</h3>
          <p>
            Save your favorite items here so you can find them later.
            Start exploring our products and add the ones you love!
          </p>
          <Link to="/products" className="wishlist-explore-btn">
            <FaStore /> Explore Products
          </Link>
        </div>
      )}

      {/* ── Wishlist Grid ───────────────────────── */}
      {!loading && !reduxError && items.length > 0 && (
        <div className="wishlist-grid-full">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="wishlist-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Product Image */}
              <Link
                to={`/products/${item.slug || ""}`}
                className="wishlist-card-image-link"
              >
                <div className="wishlist-card-image">
                  <img
                    src={getImageUrl(item)}
                    alt={item.name}
                    loading="lazy"
                  />
                  {item.stock != null && item.stock <= 0 && (
                    <span className="wishlist-card-out-of-stock">
                      Out of Stock
                    </span>
                  )}
                </div>
              </Link>

              {/* Card Body */}
              <div className="wishlist-card-body">
                {/* Brand */}
                {item.brand && (
                  <p className="wishlist-card-brand">{item.brand}</p>
                )}

                {/* Product Name */}
                <Link
                  to={`/products/${item.slug || ""}`}
                  className="wishlist-card-name-link"
                >
                  <h3 className="wishlist-card-name">{item.name}</h3>
                </Link>

                {/* Price */}
                {item.price !== null && item.price !== undefined && (
                  <p className="wishlist-card-price">
                    KES {item.price.toLocaleString()}
                  </p>
                )}

                {/* Actions */}
                <div className="wishlist-card-actions">
                  <button
                    className="wishlist-card-btn wishlist-card-btn--cart"
                    onClick={() => handleAddToCart(item)}
                    disabled={
                      addingToCartId === item.id ||
                      (item.stock != null && item.stock <= 0)
                    }
                  >
                    {addingToCartId === item.id ? (
                      <FaSpinner className="spinner" />
                    ) : (
                      <FaShoppingCart />
                    )}
                    <span>
                      {addingToCartId === item.id
                        ? "Adding..."
                        : item.stock != null && item.stock <= 0
                          ? "Out of Stock"
                          : "Add to Cart"}
                    </span>
                  </button>
                  <button
                    className="wishlist-card-btn wishlist-card-btn--remove"
                    onClick={() => handleRemove(item.productId)}
                    disabled={removingId === item.productId}
                  >
                    {removingId === item.productId ? (
                      <FaSpinner className="spinner" />
                    ) : (
                      <FaTrash />
                    )}
                    <span>
                      {removingId === item.productId ? "Removing..." : "Remove"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CustomerShell>
  );
};

export default CustomerWishlist;

