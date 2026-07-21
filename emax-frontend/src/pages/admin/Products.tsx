import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaExclamationTriangle,
  FaSearch,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import ProductTable from "../../components/Admin/ProductTable";
import { productService } from "../../services/productService";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  thumbnail: string;
  featured: boolean;
  active: boolean;
  category: {
    id: number;
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
}

type SortField = "name" | "price" | "stock" | "category" | "brand" | "featured" | "active";
type SortOrder = "asc" | "desc";

const PAGE_SIZE = 12;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [sortBy, _setSortBy] = useState<SortField>("name");
  const [sortOrder, _setSortOrder] = useState<SortOrder>("asc");

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

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err: any) {
      console.error(err);
      setFetchError(err?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Compute stats
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.active).length;
    const inactive = products.filter((p) => !p.active).length;
    const featured = products.filter((p) => p.featured).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    return { total, active, inactive, featured, outOfStock };
  }, [products]);

  // Filter & Sort
  const filtered = useMemo(() => {
    let result = [...products];

    // Text search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q) ||
          p.brand?.name?.toLowerCase().includes(q) ||
          String(p.id).includes(q)
      );
    }

    // Featured filter
    if (featuredFilter !== "all") {
      result = result.filter((p) =>
        featuredFilter === "featured" ? p.featured : !p.featured
      );
    }

    // Active filter
    if (activeFilter !== "all") {
      result = result.filter((p) =>
        activeFilter === "active" ? p.active : !p.active
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "price":
          cmp = a.price - b.price;
          break;
        case "stock":
          cmp = a.stock - b.stock;
          break;
        case "category":
          cmp = (a.category?.name ?? "").localeCompare(b.category?.name ?? "");
          break;
        case "brand":
          cmp = (a.brand?.name ?? "").localeCompare(b.brand?.name ?? "");
          break;
        case "featured":
          cmp = Number(a.featured) - Number(b.featured);
          break;
        case "active":
          cmp = Number(a.active) - Number(b.active);
          break;
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  }, [products, debouncedSearch, featuredFilter, activeFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Delete product
  const handleDelete = async (id: number) => {
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("success", "Product deleted successfully.");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to delete product.");
      throw err;
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (id: number) => {
    try {
      const updated = await productService.toggleFeatured(id);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: updated.featured } : p))
      );
      showToast(
        "success",
        `Product ${updated.featured ? "marked as featured" : "unmarked as featured"}.`
      );
    } catch (err: any) {
      showToast("error", err?.message || "Failed to toggle featured status.");
      throw err;
    }
  };

  // Toggle status
  const handleToggleStatus = async (id: number) => {
    try {
      const updated = await productService.toggleStatus(id);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, active: updated.active } : p))
      );
      showToast(
        "success",
        `Product ${updated.active ? "activated" : "deactivated"}.`
      );
    } catch (err: any) {
      showToast("error", err?.message || "Failed to toggle product status.");
      throw err;
    }
  };

  return (
    <div className="admin-page products-page">
      {/* Toast Notification */}
      {toast && (
        <div className={`products-toast products-toast--${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          <span>{toast.message}</span>
          <button
            className="products-toast-close"
            onClick={() => setToast(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>
            <FaBox className="page-header-icon" />
            Products
          </h1>
          <p className="page-subtitle">
            {loading
              ? "Loading products..."
              : `Manage ${products.length} product${products.length !== 1 ? "s" : ""} in your catalog.`}
          </p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          <FaPlus /> New Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="products-stats-grid">
        <div className="products-stat-card products-stat-card--total">
          <div className="products-stat-icon">
            <FaBox />
          </div>
          <div className="products-stat-info">
            <span className="products-stat-value">{stats.total}</span>
            <span className="products-stat-label">Total Products</span>
          </div>
        </div>
        <div className="products-stat-card products-stat-card--active">
          <div className="products-stat-icon">
            <FaCheckCircle />
          </div>
          <div className="products-stat-info">
            <span className="products-stat-value">{stats.active}</span>
            <span className="products-stat-label">Active</span>
          </div>
        </div>
        <div className="products-stat-card products-stat-card--inactive">
          <div className="products-stat-icon">
            <FaTimesCircle />
          </div>
          <div className="products-stat-info">
            <span className="products-stat-value">{stats.inactive}</span>
            <span className="products-stat-label">Inactive</span>
          </div>
        </div>
        <div className="products-stat-card products-stat-card--featured">
          <div className="products-stat-icon">
            <FaStar />
          </div>
          <div className="products-stat-info">
            <span className="products-stat-value">{stats.featured}</span>
            <span className="products-stat-label">Featured</span>
          </div>
        </div>
        <div className="products-stat-card products-stat-card--outofstock">
          <div className="products-stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="products-stat-info">
            <span className="products-stat-value">{stats.outOfStock}</span>
            <span className="products-stat-label">Out of Stock</span>
          </div>
        </div>
      </div>

      {/* Search & Toolbar */}
      <div className="table-toolbar">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, category, brand or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        <select
          value={featuredFilter}
          onChange={(e) => {
            setFeaturedFilter(e.target.value);
            setPage(1);
          }}
          className="form-input"
          style={{ width: 140, padding: "10px 12px", fontSize: 13 }}
        >
          <option value="all">All Products</option>
          <option value="featured">Featured</option>
          <option value="normal">Normal</option>
        </select>

        <select
          value={activeFilter}
          onChange={(e) => {
            setActiveFilter(e.target.value);
            setPage(1);
          }}
          className="form-input"
          style={{ width: 130, padding: "10px 12px", fontSize: 13 }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <span className="toolbar-info">
          {loading ? "Loading..." : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Error State */}
      {fetchError && !loading && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{fetchError}</span>
          <button className="alert-retry" onClick={loadProducts}>
            Retry
          </button>
        </div>
      )}

      {/* Products Table */}
      <ProductTable
        products={paginated}
        onDelete={handleDelete}
        onToggleFeatured={handleToggleFeatured}
        onToggleStatus={handleToggleStatus}
        loading={loading}
      />

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
    </div>
  );
};

export default Products;

