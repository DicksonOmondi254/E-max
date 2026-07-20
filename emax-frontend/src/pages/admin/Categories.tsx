import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTags,
  FaBox,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaTimes,
  FaCheck,
  FaLayerGroup,
} from "react-icons/fa";

import { categoryService } from "../../services/categoryService";

interface Category {
  id: number;
  name: string;
  description?: string | null;
  _count?: {
    products: number;
  };
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error: any) {
      console.error(error);
      setFetchError(error?.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast(null);
    setTimeout(() => setToast({ type, message }), 10);
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await categoryService.deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setConfirmDeleteId(null);
      showToast("success", "Category deleted successfully.");
    } catch (error: any) {
      showToast("error", error?.message || "Failed to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return categories;
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        (cat.description ?? "").toLowerCase().includes(q) ||
        (cat._count?.products ?? 0).toString().includes(q)
    );
  }, [categories, search]);

  const totalProducts = useMemo(() => {
    return categories.reduce(
      (sum, cat) => sum + (cat._count?.products ?? 0),
      0
    );
  }, [categories]);

  // ─────────────────────────────────────────────
  // Loading Skeleton
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="categories-page">
        <div className="page-header">
          <div className="skeleton-line skeleton-line--title" />
          <div className="skeleton-line skeleton-line--subtitle" />
        </div>
        <div className="categories-stats-grid">
          {[1, 2].map((i) => (
            <div key={i} className="skeleton-line skeleton-line--stat" />
          ))}
        </div>
        <div className="table-toolbar">
          <div className="skeleton-line skeleton-line--search" />
        </div>
        <table className="categories-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="skeleton-row">
                <td>
                  <div className="skeleton-cell skeleton-cell--name" />
                </td>
                <td>
                  <div className="skeleton-cell skeleton-cell--desc" />
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
      <div className="categories-page">
        <div className="page-header">
          <h1>
            <FaTags className="page-header-icon" />
            Categories
          </h1>
          <p className="page-subtitle">Manage your product categories.</p>
        </div>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Failed to Load Categories</h2>
          <p>{fetchError}</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={loadCategories}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      {/* Toast Notification */}
      {toast && (
        <div className={`categories-toast categories-toast--${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          <span>{toast.message}</span>
          <button
            className="categories-toast-close"
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
            <FaTags className="page-header-icon" />
            Categories
          </h1>
          <p className="page-subtitle">
            Manage your product categories — add, edit, or remove categories.
          </p>
        </div>
        <Link to="/admin/categories/new" className="btn btn-primary">
          <FaPlus /> New Category
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="categories-stats-grid">
        <div className="categories-stat-card categories-stat-card--total">
          <div className="categories-stat-icon">
            <FaTags />
          </div>
          <div className="categories-stat-info">
            <span className="categories-stat-value">{categories.length}</span>
            <span className="categories-stat-label">Total Categories</span>
          </div>
        </div>
        <div className="categories-stat-card categories-stat-card--products">
          <div className="categories-stat-icon">
            <FaBox />
          </div>
          <div className="categories-stat-info">
            <span className="categories-stat-value">{totalProducts}</span>
            <span className="categories-stat-label">Total Products</span>
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
            placeholder="Search categories by name, description..."
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
          {filteredCategories.length} / {categories.length} categories
        </span>
      </div>

      {/* Categories Table */}
      <div className="table-responsive">
        <table className="categories-table">
          <thead>
            <tr>
              <th className="th-name">Category Name</th>
              <th className="th-desc">Description</th>
              <th className="th-products">Products</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={4}>
                  <div className="empty-state">
                    <FaLayerGroup className="empty-icon" />
                    <h3>
                      {search
                        ? "No categories match your search"
                        : "No categories yet"}
                    </h3>
                    <p>
                      {search
                        ? "Try a different search term."
                        : "Get started by adding your first category."}
                    </p>
                    {!search && (
                      <Link
                        to="/admin/categories/new"
                        className="btn btn-primary"
                        style={{ marginTop: 16, display: "inline-flex" }}
                      >
                        <FaPlus /> Add Category
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredCategories.map((cat) => (
                <tr key={cat.id} className="category-row">
                  {/* Name */}
                  <td>
                    <div className="category-name-cell">
                      <div className="category-name-icon">
                        <FaTags />
                      </div>
                      <span className="category-name-text">{cat.name}</span>
                    </div>
                  </td>

                  {/* Description */}
                  <td>
                    <span className="category-desc-text">
                      {cat.description || "-"}
                    </span>
                  </td>

                  {/* Products Count */}
                  <td>
                    <span className="badge badge-products">
                      <FaBox />
                      {cat._count?.products ?? 0} products
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="category-actions-group">
                      <Link
                        to={`/admin/categories/edit/${cat.id}`}
                        className="category-action-btn category-action-btn--edit"
                        title="Edit category"
                      >
                        <FaEdit />
                      </Link>

                      {confirmDeleteId === cat.id ? (
                        <div className="category-delete-confirm">
                          <span className="delete-confirm-text">Delete?</span>
                          <div className="delete-confirm-actions">
                            <button
                              className="delete-confirm-yes"
                              onClick={() => handleDelete(cat.id)}
                              disabled={deletingId === cat.id}
                            >
                              {deletingId === cat.id ? (
                                <FaSpinner className="spin" />
                              ) : (
                                <FaCheck />
                              )}
                            </button>
                            <button
                              className="delete-confirm-no"
                              onClick={cancelDelete}
                              disabled={deletingId === cat.id}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="category-action-btn category-action-btn--delete"
                          title="Delete category"
                          onClick={() => setConfirmDeleteId(cat.id)}
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

export default Categories;

