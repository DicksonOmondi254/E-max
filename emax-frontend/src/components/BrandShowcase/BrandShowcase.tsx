import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStore, FaBox, FaArrowRight } from "react-icons/fa";
import { brandService } from "../../services/brandService";
import "./BrandShowcase.css";

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

const BrandShowcase = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const brandData = await brandService.getAllBrands();
        setBrands(brandData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className="brand-showcase">
        <div className="brand-showcase__header">
          <h2 className="brand-showcase__title">
            <FaStore className="brand-showcase__title-icon" />
            Shop by Brand
          </h2>
          <p className="brand-showcase__subtitle">
            Explore products from top brands
          </p>
        </div>
        <div className="brand-showcase__grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="brand-showcase__skeleton">
              <div className="brand-showcase__skeleton-logo" />
              <div className="brand-showcase__skeleton-name" />
              <div className="brand-showcase__skeleton-count" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="brand-showcase">
      <div className="brand-showcase__header">
        <div className="brand-showcase__header-left">
          <h2 className="brand-showcase__title">
            <FaStore className="brand-showcase__title-icon" />
            Shop by Brand
          </h2>
          <p className="brand-showcase__subtitle">
            Discover products from {brands.length} premium brands
          </p>
        </div>
        <Link to="/products" className="brand-showcase__view-all">
          View All <FaArrowRight />
        </Link>
      </div>

      <div className="brand-showcase__grid">
        {brands.map((brand, index) => {
          const colors = BRAND_COLORS[index % BRAND_COLORS.length];
          const logoUrl = brand.logo
            ? `${API_BASE}/uploads/brands/${brand.logo}`
            : null;
          const productCount = brand._count?.products ?? 0;

          return (
            <Link
              key={brand.id}
              to={`/brands/${brand.id}`}
              className="brand-showcase__card"
              style={{
                "--card-gradient": colors.gradient,
                "--card-shadow": colors.shadow,
              } as React.CSSProperties}
            >
              <div className="brand-showcase__card-bg" />
              <div className="brand-showcase__card-content">
                <div className="brand-showcase__logo-wrapper">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={`${brand.name} logo`}
                      className="brand-showcase__logo"
                      loading="lazy"
                    />
                  ) : (
                    <div className="brand-showcase__logo-placeholder">
                      {brand.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="brand-showcase__name">{brand.name}</h3>
                <span className="brand-showcase__count">
                  <FaBox className="brand-showcase__count-icon" />
                  {productCount} {productCount === 1 ? "Product" : "Products"}
                </span>
              </div>
              <div className="brand-showcase__card-arrow">
                <FaArrowRight />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default BrandShowcase;

