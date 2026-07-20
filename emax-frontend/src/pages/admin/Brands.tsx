import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTrademark,
  FaBox,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaImage,
  FaTimes,
  FaCheck,
  FaStore,
} from "react-icons/fa";

import { brandService } from "../../services/brandService";

const API_BASE = "http://localhost:5000";

interface Brand {
  id: number;
  name: string;
  logo?: string | null;
  _count?: {
    products: number;
  };
}

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadBrands = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await brandService.getAllBrands();
      setBrands(data);
    } catch (error: any) {
      console.error(error);
      setFetchError(error?.message || "Failed to load brands.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast(null); // Reset to re-trigger useEffect
    setTimeout(() => setToast({ type, message }), 10);
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await brandService.deleteBrand(id);
      setBrands((prev) => prev.filter((brand) => brand.id !== id));
      setConfirmDeleteId(null);
      showToast("success", "Brand deleted successfully.");
    } catch (error: any) {
      showToast("error", error?.message || "Failed to delete brand.");
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const filteredBrands = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return brands;
    return brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(q) ||
        (brand._count?.products ?? 0).toString().includes(q)
    );
  }, [brands, search]);

  const totalProducts = useMemo(() => {
    return brands.reduce(
      (sum, brand) => sum + (brand._count?.products ?? 0),
      0
    );
  }, [brands]);

  // ─────────────────────────────────────────────
  // Loading Skeleton
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="brands-page">
        <div className="page-header">
          <div className="skeleton-line skeleton-line--title" />
          <div className="skeleton-line skeleton-line--subtitle" />
        </div>
        <div className="brands-stats-grid">
          {[1, 2].map((i) => (
            <div key={i} className="skeleton-line skeleton-line--stat" />
          ))}
        </div>
        <div className="table-toolbar">
          <div className="skeleton-line skeleton-line--search" />
        </div>
        <table className="brands-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="skeleton-row">
                <td>
                  <div className="skeleton-cell skeleton-cell--logo" />
                </td>
                <td>
                  <div className="skeleton-cell skeleton-cell--name" />
                </td>
                <td>
                  <div className="skeleton-cell skeleton-cell--badge" />
                </td>
                <td>
                  <div className="skeleton-cell skeleton-cell--actions" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Error State
  // ─────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="brands-page">
        <div className="page-header">
          <h1>
            <FaTrademark className="page-header-icon" />
            Brands
          </h1>
          <p className="page-subtitle">Manage your brand catalog.</p>
        </div>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Failed to Load Brands</h2>
          <p>{fetchError}</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={loadBrands}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="brands-page">
      {/* Toast Notification */}
      {toast && (
        <div className={`brands-toast brands-toast--${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          <span>{toast.message}</span>
          <button
            className="brands-toast-close"
            onClick={() => setToast(null)}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>
            <FaTrademark className="page-header-icon" />
            Brands
          </h1>
          <p className="page-subtitle">
            Manage your brand catalog — add, edit, or remove brands.
          </p>
        </div>
        <Link to="/admin/brands/new" className="btn btn-primary">
          <FaPlus /> New Brand
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="brands-stats-grid">
        <div className="brands-stat-card brands-stat-card--total">
          <div className="brands-stat-icon">
            <FaTrademark />
          </div>
          <div className="brands-stat-info">
            <span className="brands-stat-value">{brands.length}</span>
            <span className="brands-stat-label">Total Brands</span>
          </div>
        </div>
        <div className="brands-stat-card brands-stat-card--products">
          <div className="brands-stat-icon">
            <FaBox />
          </div>
          <div className="brands-stat-info">
            <span className="brands-stat-value">{totalProducts}</span>
            <span className="brands-stat-label">Total Products</span>
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
            placeholder="Search brands by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="search-clear"
              onClick={() => setSearch("")}
            >
              <FaTimes />
            </button>
          )}
        </div>
        <span className="toolbar-info">
          {filteredBrands.length} / {brands.length} brands
        </span>
      </div>

      {/* Brands Table */}
      <div className="table-responsive">
        <table className="brands-table">
          <thead>
            <tr>
              <th className="th-logo">Logo</th>
              <th className="th-name">Brand Name</th>
              <th className="th-products">Products</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={4}>
                  <div className="empty-state">
                    <FaStore className="empty-icon" />
                    <h3>{search ? "No brands match your search" : "No brands yet"}</h3>
                    <p>
                      {search
                        ? "Try a different search term."
                        : "Get started by adding your first brand."}
                    </p>
                    {!search && (
                      <Link
                        to="/admin/brands/new"
                        className="btn btn-primary"
                        style={{ marginTop: 16, display: "inline-flex" }}
                      >
                        <FaPlus /> Add Brand
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredBrands.map((brand) => (
                <tr key={brand.id} className="brand-row">
                  {/* Logo */}
                  <td>
                    <div className="brand-logo-cell">
                      {brand.logo ? (
                        <img
                          src={`${API_BASE}/uploads/brands/${brand.logo}`}
                          alt={brand.name}
                          className="brand-logo-img"
                        />
                      ) : (
                        <div className="brand-logo-placeholder">
                          <FaImage />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td>
                    <span className="brand-name-text">{brand.name}</span>
                  </td>

                  {/* Products Count */}
                  <td>
                    <span className="badge badge-products">
                      <FaBox />
                      {brand._count?.products ?? 0} products
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="brand-actions-group">
                      <Link
                        to={`/admin/brands/edit/${brand.id}`}
                        className="brand-action-btn brand-action-btn--edit"
                        title="Edit brand"
                      >
                        <FaEdit />
                      </Link>

                      {confirmDeleteId === brand.id ? (
                        <div className="brand-delete-confirm">
                          <span className="delete-confirm-text">Delete?</span>
                          <div className="delete-confirm-actions">
                            <button
                              className="delete-confirm-yes"
                              onClick={() => handleDelete(brand.id)}
                              disabled={deletingId === brand.id}
                            >
                              {deletingId === brand.id ? (
                                <FaSpinner className="spin" />
                              ) : (
                                <FaCheck />
                              )}
                            </button>
                            <button
                              className="delete-confirm-no"
                              onClick={cancelDelete}
                              disabled={deletingId === brand.id}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="brand-action-btn brand-action-btn--delete"
                          title="Delete brand"
                          onClick={() => setConfirmDeleteId(brand.id)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Brands;

