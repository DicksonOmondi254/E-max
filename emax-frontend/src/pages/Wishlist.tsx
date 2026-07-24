import { useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaTrash, FaShoppingCart, FaStore, FaSpinner } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchWishlist,
  removeFromWishlist,
  selectWishlistItems,
  selectWishlistLoading,
} from "../redux/wishlistSlice";

const API_BASE = "http://localhost:5000";

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const loading = useAppSelector(selectWishlistLoading);

  // Check authentication
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return null;
  }

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = useCallback(
    async (productId: number) => {
      try {
        await dispatch(removeFromWishlist(productId)).unwrap();
      } catch {
        console.error("Failed to remove item.");
      }
    },
    [dispatch]
  );

  const getImageUrl = (item: any): string => {
    if (item.image) return `${API_BASE}/uploads/products/${item.image}`;
    return "/images/no-image.svg";
  };

  return (
    <div className="wishlist-page" style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>
          <FaHeart style={{ color: "#ef4444", marginRight: 8 }} />
          My Wishlist ({items.length})
        </h1>
        <Link
          to="/dashboard/wishlist"
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Go to Dashboard Wishlist
        </Link>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 60 }}>
          <FaSpinner className="spinner" style={{ fontSize: 32, animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "#94a3b8", marginTop: 12 }}>Loading wishlist...</p>
        </div>
      )}

      {/* Error state handled silently — could be enhanced with an error selector */}
      {!loading && items.length === 0 && (
        <div style={{ textAlign: "center", padding: 60 }}>
          <FaHeart style={{ fontSize: 64, color: "#fecdd3", marginBottom: 16 }} />
          <h3>Your wishlist is empty</h3>
          <p style={{ color: "#94a3b8", marginBottom: 24 }}>
            Start exploring our products and save the ones you love!
          </p>
          <Link
            to="/products"
            style={{
              padding: "12px 24px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FaStore /> Explore Products
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#fff",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
              }}
            >
              <Link
                to={`/products/${item.slug || ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 200,
                  background: "#fafafa",
                  textDecoration: "none",
                }}
              >
                <img
                  src={getImageUrl(item)}
                  alt={item.name}
                  style={{ width: "85%", height: "85%", objectFit: "contain" }}
                />
              </Link>

              <div style={{ padding: "16px 18px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                {item.brand && (
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 4px", fontWeight: 500 }}>
                    {item.brand}
                  </p>
                )}

                <Link
                  to={`/products/${item.slug || ""}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 8px", lineHeight: 1.4 }}>
                    {item.name}
                  </h3>
                </Link>

                <p style={{ fontSize: 20, fontWeight: 800, color: "#6366f1", margin: "0 0 14px" }}>
                  KES {item.price?.toLocaleString()}
                </p>

                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  <button
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "none",
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>

                  <button
                    onClick={() => handleRemove(item.productId)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid #fee2e2",
                      background: "rgba(239,68,68,0.05)",
                      color: "#ef4444",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

