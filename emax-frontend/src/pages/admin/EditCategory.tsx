import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaSpinner,
  FaTags,
} from "react-icons/fa";

import { categoryService } from "../../services/categoryService";

interface CategoryData {
  id: number;
  name: string;
  description?: string | null;
  _count?: { products: number };
  createdAt?: string;
  updatedAt?: string;
}

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setFetchError(null);
        const catId = parseInt(id, 10);
        if (isNaN(catId)) {
          setFetchError("Invalid category ID.");
          return;
        }
        const data: CategoryData = await categoryService.getCategoryById(catId);
        setForm({
          name: data.name || "",
          description: data.description || "",
        });
      } catch (error: any) {
        console.error(error);
        setFetchError(error?.message || "Failed to load category details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const validateForm = () => {
    const validationErrors: string[] = [];

    if (!form.name.trim()) {
      validationErrors.push("Category name is required.");
    }

    if (form.name.trim().length < 2) {
      validationErrors.push("Category name must be at least 2 characters.");
    }

    if (form.name.trim().length > 50) {
      validationErrors.push("Category name must be under 50 characters.");
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!id) return;

    try {
      setSaving(true);
      setErrors([]);
      setSuccess(null);

      const catId = parseInt(id, 10);

      await categoryService.updateCategory(catId, {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
      });

      setSuccess("Category updated successfully!");
      setTimeout(() => {
        navigate("/admin/categories");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      setErrors([error?.message || "Failed to update category."]);
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────
  // Loading Skeleton
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="edit-category-page">
        <div className="edit-category-container">
          <div className="skeleton-header">
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line skeleton-line--subtitle" />
          </div>
          <div className="skeleton-body">
            <div className="skeleton-line skeleton-line--label" />
            <div className="skeleton-line skeleton-line--input" />
            <div className="skeleton-line skeleton-line--label" />
            <div className="skeleton-line skeleton-line--input" />
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Fetch Error State
  // ─────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="edit-category-page">
        <div className="edit-category-container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Failed to Load Category</h2>
            <p>{fetchError}</p>
            <div className="error-actions">
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/admin/categories")}
              >
                <FaArrowLeft /> Back to Categories
              </button>
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-category-page">
      <div className="edit-category-container">
        {/* Header */}
        <div className="edit-category-header">
          <button
            className="btn btn-icon"
            onClick={() => navigate("/admin/categories")}
            title="Back to categories"
          >
            <FaArrowLeft />
          </button>
          <div className="header-info">
            <h1>
              <FaTags className="header-icon" />
              Edit Category
            </h1>
            <p className="header-subtitle">
              Update category details — changes will be visible across all products.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✓</span>
            <span>{success}</span>
          </div>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="alert alert-error">
            <div className="alert-header">
              <span className="alert-icon">✕</span>
              <span>Please fix the following errors:</span>
            </div>
            <ul className="alert-list">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="edit-category-form">
          {/* Category Name */}
          <div className="form-group">
            <label htmlFor="editCatName" className="form-label">
              Category Name <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                id="editCatName"
                type="text"
                className="form-input"
                placeholder="Enter category name (e.g. Electronics, Clothing)"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                autoFocus
                maxLength={50}
              />
            </div>
            <span className="form-hint">
              {form.name.length}/50 characters
            </span>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="editCatDesc" className="form-label">
              Description
            </label>
            <div className="input-wrapper">
              <textarea
                id="editCatDesc"
                className="form-input form-textarea"
                placeholder="Enter a brief description of this category (optional)"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                maxLength={500}
              />
            </div>
            <span className="form-hint">
              {form.description.length}/500 characters
            </span>
          </div>

          {/* Divider */}
          <div className="form-divider" />

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/admin/categories")}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving || loading}
            >
              {saving ? (
                <>
                  <FaSpinner className="spin" /> Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;

