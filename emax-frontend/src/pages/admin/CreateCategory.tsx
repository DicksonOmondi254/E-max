import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaSpinner,
  FaTags,
} from "react-icons/fa";

import { categoryService } from "../../services/categoryService";

const CreateCategory = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

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

    try {
      setLoading(true);
      setErrors([]);
      setSuccess(null);

      await categoryService.createCategory({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
      });

      setSuccess("Category created successfully!");
      setTimeout(() => {
        navigate("/admin/categories");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      setErrors([error?.message || "Failed to create category."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-category-page">
      <div className="create-category-container">
        {/* Header */}
        <div className="create-category-header">
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
              Create Category
            </h1>
            <p className="header-subtitle">
              Add a new product category — it will appear across the store.
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
        <form onSubmit={handleSubmit} className="create-category-form">
          {/* Category Name */}
          <div className="form-group">
            <label htmlFor="catName" className="form-label">
              Category Name <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                id="catName"
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
            <label htmlFor="catDesc" className="form-label">
              Description
            </label>
            <div className="input-wrapper">
              <textarea
                id="catDesc"
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
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="spin" /> Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;

