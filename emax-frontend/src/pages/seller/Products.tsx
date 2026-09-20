import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaBox, FaSearch, FaPlus, FaEdit, FaTrash, FaCopy,
  FaStar, FaToggleOn, FaToggleOff, FaGlobe, FaChartLine, FaCogs,
  FaLayerGroup, FaCheck, FaBan, FaFire, FaExclamationCircle, FaExclamationTriangle as FaExclamationTriangle2,
} from "react-icons/fa";
import { sellerService } from "../../services/sellerService";
import type { SellerProduct } from "../../services/sellerService";

const PAGE_SIZE = 12;

const Products = () => {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (toast) { const timer = setTimeout(() => setToast(null), 4000); return () => clearTimeout(timer); }
  }, [toast]);

  const showToast = (type: "success" | "error", message: string) => setToast({ type, message });

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await sellerService.getProducts({ search: debouncedSearch || undefined, page, limit: PAGE_SIZE });
      setProducts(result.data);
    } catch (err: any) {
      setError(err?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.active).length;
    const inactive = products.filter((p) => !p.active).length;
    const featured = products.filter((p) => p.featured).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
    return { total, active, inactive, featured, outOfStock, lowStock };
  }, [products]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const { productService } = await import("../../services/productService");
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("success", "Product deleted successfully.");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to delete product.");
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const { productService } = await import("../../services/productService");
      const updated = await productService.toggleStatus(id);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, active: updated.active } : p)));
      showToast("success", `Product ${updated.active ? "activated" : "deactivated"}.`);
    } catch (err: any) {
      showToast("error", err?.message || "Failed to toggle status.");
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      const { productService } = await import("../../services/productService");
      const updated = await productService.toggleFeatured(id);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: updated.featured } : p)));
      showToast("success", `Product ${updated.featured ? "featured" : "unfeatured"}.`);
    } catch (err: any) {
      showToast("error", err?.message || "Failed to toggle featured.");
    }
  };

  const handleDuplicate = async (product: SellerProduct) => {
    try {
      const { productService } = await import("../../services/productService");
      const formData = new FormData();
      formData.append("name", `${product.name} (Copy)`);
      formData.append("slug", `${product.slug}-copy-${Date.now()}`);
      formData.append("description", product.description);
      formData.append("price", String(product.price));
      formData.append("stock", String(product.stock));
      formData.append("categoryId", String(product.category?.id || ""));
      formData.append("brandId", String(product.brand?.id || ""));
      formData.append("thumbnail", product.thumbnail);
      await productService.createProduct(formData);
      showToast("success", "Product duplicated successfully.");
      loadProducts();
    } catch (err: any) {
      showToast("error", err?.message || "Failed to duplicate product.");
    }
  };

  return (
    <div className="seller-page">
      {toast && (
        <div className={`s-toast s-toast--${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          <span>{toast.message}</span>
          <button className="s-toast-close" onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      <div className="s-page-header">
        <div>
          <h1><FaBox className="s-page-icon" /> Products</h1>
          <p className="s-page-subtitle">Manage your product catalog</p>
        </div>
        <Link to="/seller/products/new" className="s-btn s-btn-primary">
          <FaPlus /> New Product
        </Link>
      </div>

      {/* Stats */}
      <div className="s-stats-grid s-stats-sm">
        <div className="s-stat-mini s-stat-mini-total"><span className="s-stat-mini-icon"><FaLayerGroup /></span><span>{stats.total}</span><span className="s-stat-mini-label">Total</span></div>
        <div className="s-stat-mini s-stat-mini-active"><span className="s-stat-mini-icon"><FaCheck /></span><span>{stats.active}</span><span className="s-stat-mini-label">Active</span></div>
        <div className="s-stat-mini s-stat-mini-inactive"><span className="s-stat-mini-icon"><FaBan /></span><span>{stats.inactive}</span><span className="s-stat-mini-label">Inactive</span></div>
        <div className="s-stat-mini s-stat-mini-featured"><span className="s-stat-mini-icon"><FaFire /></span><span>{stats.featured}</span><span className="s-stat-mini-label">Featured</span></div>
        <div className="s-stat-mini s-stat-mini-out"><span className="s-stat-mini-icon"><FaExclamationCircle /></span><span>{stats.outOfStock}</span><span className="s-stat-mini-label">Out of Stock</span></div>
        <div className="s-stat-mini s-stat-mini-low"><span className="s-stat-mini-icon"><FaExclamationTriangle2 /></span><span>{stats.lowStock}</span><span className="s-stat-mini-label">Low Stock</span></div>
      </div>

      {/* Search */}
      <div className="s-toolbar">
        <div className="s-search-wrapper">
          <FaSearch className="s-search-icon" />
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="s-search-input" />
          {search && <button className="s-search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>
      </div>

      {error && <div className="s-alert s-alert-danger">⚠️ {error} <button onClick={loadProducts}>Retry</button></div>}

      {/* Product Grid */}
      <div className="s-product-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="s-product-card-skeleton"><div className="s-skel-img" /><div className="s-skel-line" /><div className="s-skel-line s-skel-short" /></div>)
        ) : products.length === 0 && !debouncedSearch ? (
          <div className="s-empty-modern">
            {/* Decorative background elements */}
            <div className="s-empty-bg-glow" />
            <div className="s-empty-bg-dots" />

            {/* Icon Section */}
            <div className="s-empty-icon-wrap">
              <div className="s-empty-icon-ring" />
              <div className="s-empty-icon-inner">
                <FaBox className="s-empty-icon-main" />
              </div>
            </div>

            {/* Text Content */}
            <div className="s-empty-text-section">
              <h2 className="s-empty-heading">Welcome to Your Product Catalog</h2>
              <p className="s-empty-description">
                Start building your online store by adding your first product.
                It's quick and easy — just fill in the details, upload images, and you're ready to sell!
              </p>
            </div>

            {/* Feature Benefit Cards */}
            <div className="s-empty-features">
              <div className="s-empty-feature-card s-efc-reach">
                <div className="s-efc-icon-wrap">
                  <FaGlobe />
                </div>
                <div className="s-efc-content">
                  <h4>Reach More Customers</h4>
                  <p>Sell your products to thousands of active buyers on our marketplace.</p>
                </div>
              </div>
              <div className="s-empty-feature-card s-efc-manage">
                <div className="s-efc-icon-wrap">
                  <FaCogs />
                </div>
                <div className="s-efc-content">
                  <h4>Easy Management</h4>
                  <p>Manage inventory, track orders, and update listings from one dashboard.</p>
                </div>
              </div>
              <div className="s-empty-feature-card s-efc-track">
                <div className="s-efc-icon-wrap">
                  <FaChartLine />
                </div>
                <div className="s-efc-content">
                  <h4>Track Performance</h4>
                  <p>Monitor sales, view analytics, and grow your business with real-time insights.</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="s-empty-cta-section">
              <Link to="/seller/products/new" className="s-btn s-btn-primary s-empty-cta-btn">
                <FaPlus /> Add Your First Product
              </Link>
              <p className="s-empty-cta-hint">No credit card required · Start selling in minutes</p>
            </div>
          </div>
        ) : products.length === 0 && debouncedSearch ? (
          <div className="s-empty-modern s-empty-search">
            <div className="s-empty-icon-wrap s-empty-search-icon-wrap">
              <div className="s-empty-icon-inner s-empty-search-icon-inner">
                <FaSearch className="s-empty-icon-main" />
              </div>
            </div>
            <div className="s-empty-text-section">
              <h2 className="s-empty-heading">No Results Found</h2>
              <p className="s-empty-description">
                No products matching <strong>"{debouncedSearch}"</strong>. Try adjusting your search terms or check for typos.
              </p>
            </div>
            <button className="s-btn s-btn-secondary" onClick={() => setSearch("")}>
              Clear Search
            </button>
          </div>
        ) : (
          <div className="s-table-wrapper">
            <table className="s-table s-table-full">
              <thead>
                <tr>
                  <th>Image</th><th>Product</th><th>Category</th><th>Brand</th><th>Price</th><th>Stock</th><th>Status</th><th>Featured</th><th>Sales</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="s-thumb-cell">
                        {p.thumbnail ? <img src={`http://localhost:5000/uploads/products/${p.thumbnail}`} alt={p.name} className="s-thumb-img" /> : <FaBox className="s-thumb-placeholder" />}
                      </div>
                    </td>
                    <td>
                      <div className="s-product-cell">
                        <div className="s-product-cell-info">
                          <span className="s-product-cell-name">{p.name}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      {p.category ? (
                        <span className="s-badge s-badge-category">{p.category.name}</span>
                      ) : (
                        <span className="s-text-muted">—</span>
                      )}
                    </td>
                    <td>
                      {p.brand ? (
                        <span className="s-badge s-badge-brand">{p.brand.name}</span>
                      ) : (
                        <span className="s-text-muted">—</span>
                      )}
                    </td>
                    <td><span className="s-price">KES {p.price.toLocaleString()}</span></td>
                    <td>
                      <span className={`s-stock-badge ${p.stock === 0 ? "s-stock-out" : p.stock <= 5 ? "s-stock-low" : "s-stock-ok"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`s-badge ${p.active ? "s-badge-delivered" : "s-badge-cancelled"}`}>
                        {p.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{p.featured ? <FaStar className="s-star-active" /> : <FaStar className="s-star-inactive" />}</td>
                    <td><span className="s-sales-count">{p._count?.orderItems || 0}</span></td>
                    <td>
                      <div className="s-action-btns">
                        <Link to={`/seller/products/edit/${p.id}`} className="s-action-btn s-action-edit" title="Edit"><FaEdit /></Link>
                        <button className="s-action-btn s-action-toggle" title="Toggle Status" onClick={() => handleToggleStatus(p.id)}>
                          {p.active ? <FaToggleOff /> : <FaToggleOn />}
                        </button>
                        <button className="s-action-btn s-action-star" title="Toggle Featured" onClick={() => handleToggleFeatured(p.id)}>
                          <FaStar />
                        </button>
                        <button className="s-action-btn s-action-copy" title="Duplicate" onClick={() => handleDuplicate(p)}><FaCopy /></button>
                        <button className="s-action-btn s-action-delete" title="Delete" onClick={() => handleDelete(p.id)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
