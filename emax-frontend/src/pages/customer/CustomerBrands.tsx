import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStore,
  FaBox,
  FaArrowRight,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";
import CustomerShell from "./CustomerShell";
import { brandService } from "../../services/brandService";

const API_BASE = "http://localhost:5000";

type Brand = {
  id: number;
  name: string;
  logo?: string | null;
  _count?: {
    products: number;
  };
};

const BRAND_COLORS = [
  { gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)", shadow: "rgba(99, 102, 241, 0.3)" },
  { gradient: "linear-gradient(135deg, #ec4899, #f43f5e)", shadow: "rgba(236, 72, 153, 0.3)" },
  { gradient: "linear-gradient(135deg, #14b8a6, #06b6d4)", shadow: "rgba(20, 184, 166, 0.3)" },
  { gradient: "linear-gradient(135deg, #f59e0b, #ef4444)", shadow: "rgba(245, 158, 11, 0.3)" },
  { gradient: "linear-gradient(135deg, #3b82f6, #6366f1)", shadow: "rgba(59, 130, 246, 0.3)" },
  { gradient: "linear-gradient(135deg, #a855f7, #d946ef)", shadow: "rgba(168, 85, 247, 0.3)" },
];

const CustomerBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await brandService.getAllBrands();
      setBrands(data);
    } catch (e) {
      console.error(e);
      setError("Failed to load brands. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const totalBrands = brands.length;
  const totalProducts = brands.reduce((sum, b) => sum + (b._count?.products ?? 0), 0);

  const renderCard = (brand: Brand, index: number) => {
    const colors = BRAND_COLORS[index % BRAND_COLORS.length];
    const logoUrl = brand.logo ? `${API_BASE}/uploads/brands/${brand.logo}` : null;
    const productCount = brand._count?.products ?? 0;

    return (
      <Link
        key={brand.id}
        to={`/brands/${brand.id}`}
        className="brand-card-hover"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          borderRadius: "20px",
          overflow: "hidden",
          textDecoration: "none",
          background: "#fff",
          border: "1px solid #e5e7eb",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
        }}
      >
        <div
          className="brand-card-bg"
          style={{
            position: "absolute",
            inset: 0,
            background: colors.gradient,
            opacity: 0,
            transition: "opacity 0.35s ease",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 24px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              overflow: "hidden",
              marginBottom: "18px",
              background: "#f9fafb",
              border: "3px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.35s ease",
              flexShrink: 0,
            }}
            className="brand-card-logo-wrapper"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${brand.name} logo`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "8px",
                  transition: "transform 0.3s ease",
                }}
                className="brand-card-logo"
                loading="lazy"
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "#d1d5db",
                  background: "#f3f4f6",
                }}
              >
                {brand.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h3
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 10px 0",
              transition: "color 0.3s ease",
              lineHeight: 1.3,
            }}
            className="brand-card-name"
          >
            {brand.name}
          </h3>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#6b7280",
              background: "#f3f4f6",
              padding: "5px 14px",
              borderRadius: "100px",
              transition: "all 0.3s ease",
            }}
            className="brand-card-count"
          >
            <FaBox style={{ fontSize: "11px" }} />
            {productCount} {productCount === 1 ? "Product" : "Products"}
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "18px",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: "#f3f4f6",
            color: "#9ca3af",
            fontSize: "12px",
            transition: "all 0.3s ease",
            opacity: 0,
            transform: "translateX(-8px)",
          }}
          className="brand-card-arrow"
        >
          <FaArrowRight />
        </div>
      </Link>
    );
  };

  return (
    <CustomerShell title="Brands">
      {/* Stats Bar */}
      {!loading && !error && brands.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          <div className="orders-stat-card orders-stat-card--total">
            <div className="orders-stat-icon"><FaStore /></div>
            <p className="orders-stat-value">{totalBrands}</p>
            <p className="orders-stat-label">Total Brands</p>
          </div>
          <div className="orders-stat-card orders-stat-card--delivered">
            <div className="orders-stat-icon"><FaBox /></div>
            <p className="orders-stat-value">{totalProducts}</p>
            <p className="orders-stat-label">Total Products</p>
          </div>
          <div className="orders-stat-card orders-stat-card--pending">
            <div className="orders-stat-icon"><FaStore /></div>
            <p className="orders-stat-value">{totalBrands}</p>
            <p className="orders-stat-label">Shop by Brand</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "32px 24px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div className="wishlist-skel-line" style={{ width: "88px", height: "88px", borderRadius: "50%" }} />
              <div className="wishlist-skel-line" style={{ width: "120px", height: "18px", borderRadius: "8px" }} />
              <div className="wishlist-skel-line" style={{ width: "100px", height: "28px", borderRadius: "100px" }} />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px",
            background: "#fff",
            borderRadius: "14px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", color: "#fca5a5", marginBottom: "16px" }}>
            <FaExclamationCircle />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", margin: "0 0 8px" }}>
            Oops! Something went wrong
          </h3>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 20px" }}>{error}</p>
          <button
            onClick={loadBrands}
            style={{
              padding: "10px 22px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              border: "none",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaSpinner /> Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && brands.length === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px",
            background: "#fff",
            borderRadius: "14px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "64px", color: "#c7d2fe", marginBottom: "20px" }}>
            <FaStore />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", margin: "0 0 8px" }}>
            No brands available
          </h3>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 24px", maxWidth: "360px" }}>
            Brands will appear here once they are added by the store admin.
          </p>
          <Link
            to="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <FaStore /> Explore Products
          </Link>
        </div>
      )}

      {/* Brands Grid */}
      {!loading && !error && brands.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {brands.map((brand, index) => renderCard(brand, index))}
        </div>
      )}
    </CustomerShell>
  );
};

export default CustomerBrands;
