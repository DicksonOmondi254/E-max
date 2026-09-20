import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaBox, FaStore, FaSpinner, FaImage } from "react-icons/fa";

import { productService } from "../services/productService";
import { brandService } from "../services/brandService";
import ProductCard from "../components/ProductCard/ProductCard";
import "./Products.css";
import "./BrandProducts.css";

const API_BASE = "http://localhost:5000";

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string;
  featured: boolean;
  stock: number;
  active?: boolean;
  category: {
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
};

type Brand = {
  id: number;
  name: string;
  logo?: string | null;
  _count?: {
    products: number;
  };
};

const BrandProducts = () => {
  const params = useParams();
  const brandIdParam = params.id;
  const brandId = brandIdParam ? Number(brandIdParam) : NaN;

  const [loading, setLoading] = useState(true);
  const [brandLoading, setBrandLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [brandError, setBrandError] = useState<string | null>(null);

  useEffect(() => {
    const loadBrand = async () => {
      if (!Number.isFinite(brandId)) {
        setBrandError("Invalid brand ID.");
        setBrandLoading(false);
        return;
      }
      try {
        setBrandLoading(true);
        setBrandError(null);
        const data = await brandService.getBrandById(brandId);
        setBrand(data);
      } catch (e: any) {
        console.error(e);
        setBrandError(e?.message || "Failed to load brand details.");
      } finally {
        setBrandLoading(false);
      }
    };

    loadBrand();
  }, [brandId]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts();
        setProducts(data as Product[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    if (!Number.isFinite(brandId)) return [];

    return (products ?? []).filter((p) => {
      const pBrandId = p.brand?.id;
      const matchesBrand = pBrandId === brandId;
      const pActiveOk = p.active === undefined || p.active === true;
      const pStockOk = (p.stock ?? 0) > 0;

      return matchesBrand && pActiveOk && pStockOk;
    });
  }, [products, brandId]);

  const allProducts = useMemo(() => {
    if (!Number.isFinite(brandId)) return [];
    return (products ?? []).filter((p) => {
      const pBrandId = p.brand?.id;
      return pBrandId === brandId;
    });
  }, [products, brandId]);

  return (
    <div className="brand-products-page">
      {/* Brand Hero Section */}
      {brandLoading ? (
        <div className="brand-products__hero brand-products__hero--loading">
          <div className="brand-products__hero-skeleton">
            <div className="brand-products__skeleton-logo" />
            <div className="brand-products__skeleton-text" />
            <div className="brand-products__skeleton-count" />
          </div>
        </div>
      ) : brandError ? (
        <div className="brand-products__hero brand-products__hero--error">
          <div className="brand-products__error-content">
            <div className="brand-products__error-icon">⚠️</div>
            <h2>Brand Not Found</h2>
            <p>{brandError}</p>
            <Link to="/products" className="btn btn--primary">
              Browse All Products
            </Link>
          </div>
        </div>
      ) : brand ? (
        <div className="brand-products__hero">
          <div className="brand-products__hero-bg">
            <div className="brand-products__hero-pattern" />
          </div>
          <div className="brand-products__hero-content">
            <Link to="/products" className="brand-products__back-btn">
              <FaArrowLeft /> All Products
            </Link>
            <div className="brand-products__hero-info">
              <div className="brand-products__hero-logo-wrapper">
                {brand.logo ? (
                  <img
                    src={`${API_BASE}/uploads/brands/${brand.logo}`}
                    alt={`${brand.name} logo`}
                    className="brand-products__hero-logo"
                  />
                ) : (
                  <div className="brand-products__hero-logo-placeholder">
                    <FaImage />
                  </div>
                )}
              </div>
              <div className="brand-products__hero-text">
                <h1 className="brand-products__hero-name">{brand.name}</h1>
                <div className="brand-products__hero-meta">
                  <span className="brand-products__hero-count">
                    <FaBox />
                    {allProducts.length} {allProducts.length === 1 ? "Product" : "Products"}
                  </span>
                  <span className="brand-products__hero-available">
                    <FaStore />
                    {filtered.length} available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Products Section */}
      <div className="brand-products__body">
        {loading ? (
          <div className="brand-products__loading">
            <FaSpinner className="brand-products__spinner" />
            <p>Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="brand-products__empty">
            <div className="brand-products__empty-icon">
              <FaBox />
            </div>
            <h3>No products available</h3>
            <p>
              {allProducts.length > 0
                ? "All products from this brand are currently out of stock."
                : "This brand doesn't have any products yet."}
            </p>
            <Link to="/products" className="brand-products__browse-btn">
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="brand-products__results-header">
              <p className="brand-products__results-text">
                Showing <strong>{filtered.length}</strong>{" "}
                {filtered.length === 1 ? "product" : "products"}
              </p>
            </div>
            <div className="products-grid">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrandProducts;

