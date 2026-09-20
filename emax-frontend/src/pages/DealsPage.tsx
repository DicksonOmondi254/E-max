import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTag,
  FaBox,
  FaExclamationCircle,
  FaShoppingCart,
  FaEye,
  FaStar,
  FaArrowLeft,
} from "react-icons/fa";
import { productService } from "../services/productService";
import "./Products.css";

const API_BASE = "http://localhost:5000";

type DealProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  thumbnail: string;
  stock: number;
  featured: boolean;
  active: boolean;
  brand: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
};

const DealsPage = () => {
  const [products, setProducts] = useState<DealProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getDeals();
        setProducts(data || []);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Failed to load deals.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Calculate the original price from current price and discount percentage
  const dealProducts = useMemo(() => {
    return products
      .filter((p) => p.active && p.stock > 0)
      .map((p) => {
        const oldPrice = Math.round(p.price * (1 + p.discount / 100));
        return { ...p, oldPrice };
      })
      .sort((a, b) => b.discount - a.discount);
  }, [products]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="products-page">
        <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #e63946, #ff6b6b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "22px",
              }}
            >
              <FaTag />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "28px" }}>Deals & Discounts</h1>
              <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
                Loading the best offers...
              </p>
            </div>
          </div>
          <div className="products-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "20px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  className="wishlist-skel-line"
                  style={{ width: "100%", height: "180px", borderRadius: "8px", marginBottom: "16px" }}
                />
                <div
                  className="wishlist-skel-line"
                  style={{ width: "70%", height: "16px", borderRadius: "8px", marginBottom: "12px" }}
                />
                <div
                  className="wishlist-skel-line"
                  style={{ width: "40%", height: "14px", borderRadius: "8px", marginBottom: "12px" }}
                />
                <div
                  className="wishlist-skel-line"
                  style={{ width: "60%", height: "20px", borderRadius: "8px" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="products-page">
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "40px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "64px", color: "#fca5a5", marginBottom: "20px" }}>
            <FaExclamationCircle />
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 10px" }}>
            Couldn't load deals
          </h2>
          <p style={{ color: "#94a3b8", margin: "0 0 24px", maxWidth: "400px" }}>
            {error}
          </p>
          <Link
            to="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "#1a1a2e",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            <FaArrowLeft /> Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  // Empty state
  if (dealProducts.length === 0) {
    return (
      <div className="products-page">
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "40px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "64px", color: "#c7d2fe", marginBottom: "20px" }}>
            <FaTag />
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 8px" }}>No deals available</h2>
          <p style={{ color: "#94a3b8", margin: "0 0 24px", maxWidth: "400px" }}>
            There are no discounted products right now. Check back later for exciting offers!
          </p>
          <Link
            to="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "#1a1a2e",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            <FaBox /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 20px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
            paddingTop: "32px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #e63946, #ff6b6b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "22px",
            }}
          >
            <FaTag />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "28px" }}>Deals & Discounts</h1>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
              {dealProducts.length} product{dealProducts.length !== 1 ? "s" : ""} at discounted prices
            </p>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="products-grid">
          {dealProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.slug || product.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="flash-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                {/* Discount Badge */}
                <div className="discount-badge">-{product.discount}%</div>

                {/* Product Image */}
                <img
                  src={`${API_BASE}/uploads/products/${product.thumbnail}`}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "contain",
                    marginBottom: "12px",
                  }}
                />

                {/* Brand Name */}
                {product.brand && (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      margin: "0 0 4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontWeight: 600,
                    }}
                  >
                    {product.brand.name}
                  </p>
                )}

                {/* Product Name */}
                <h3 style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 8px", flex: 1 }}>
                  {product.name}
                </h3>

                {/* Rating Placeholder */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    marginBottom: "8px",
                    fontSize: "13px",
                    color: "#6b7280",
                  }}
                >
                  <FaStar color="#FFC107" />
                  <span>4.5</span>
                </div>

                {/* Prices */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "baseline",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      color: "#e63946",
                      fontWeight: 700,
                      fontSize: "18px",
                    }}
                  >
                    KES {product.price.toLocaleString()}
                  </span>
                  <span
                    style={{
                      color: "#9ca3af",
                      textDecoration: "line-through",
                      fontSize: "14px",
                    }}
                  >
                    KES {(product as any).oldPrice?.toLocaleString()}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to cart logic
                    }}
                    style={{
                      flex: 1,
                      padding: "10px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "13px",
                      background: "#1a1a2e",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <FaShoppingCart /> Add
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // View details
                    }}
                    style={{
                      padding: "10px 14px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: "#f3f4f6",
                      color: "#374151",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaEye />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealsPage;

