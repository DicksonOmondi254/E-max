import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaUpload, FaTrash, FaSave, FaSpinner, FaTrademark } from "react-icons/fa";

import { brandService } from "../../services/brandService";

const API_BASE = "http://localhost:5000";

interface BrandData {
  id: number;
  name: string;
  logo?: string | null;
  _count?: { products: number };
  createdAt?: string;
  updatedAt?: string;
}

const EditBrand = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    logo: null as File | null,
    preview: "",
    existingLogo: null as string | null,
    removeLogo: false,
  });

  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    return () => {
      if (form.preview) URL.revokeObjectURL(form.preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchBrand = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setFetchError(null);
        const brandId = parseInt(id, 10);
        if (isNaN(brandId)) {
          setFetchError("Invalid brand ID.");
          return;
        }
        const data: BrandData = await brandService.getBrandById(brandId);
        setForm((prev) => ({
          ...prev,
          name: data.name || "",
          existingLogo: data.logo || null,
        }));
      } catch (error: any) {
        console.error(error);
        setFetchError(error?.message || "Failed to load brand details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBrand();
  }, [id]);

  const validateForm = () => {
    const validationErrors: string[] = [];
    if (!form.name.trim()) {
      validationErrors.push("Brand name is required.");
    }
    if (form.name.trim().length < 2) {
      validationErrors.push("Brand name must be at least 2 characters.");
    }
    if (form.name.trim().length > 100) {
      validationErrors.push("Brand name must be under 100 characters.");
    }
    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleLogoChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors(["Please select a valid image file (JPEG, PNG, WEBP)."]);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(["Logo image must be under 5MB."]);
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    // Revoke old preview if exists
    if (form.preview) URL.revokeObjectURL(form.preview);

    setErrors([]);
    setForm((prev) => ({
      ...prev,
      logo: file,
      preview: previewUrl,
      removeLogo: false,
    }));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleLogoChange(e.target.files?.[0] || null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    handleLogoChange(e.dataTransfer.files?.[0] || null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleRemoveLogo = () => {
    if (form.preview) URL.revokeObjectURL(form.preview);
    setForm((prev) => ({
      ...prev,
      logo: null,
      preview: "",
      removeLogo: true,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!id) return;

    try {
      setSaving(true);
      setErrors([]);
      setSuccess(null);

      const brandId = parseInt(id, 10);
      const data = new FormData();
      data.append("name", form.name.trim());

      if (form.logo) {
        data.append("logo", form.logo);
      } else if (form.removeLogo) {
        data.append("logo", "");
      }

      await brandService.updateBrand(brandId, data);

      setSuccess("Brand updated successfully!");
      setTimeout(() => {
        navigate("/admin/brands");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      setErrors([error?.message || "Failed to update brand."]);
    } finally {
      setSaving(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="edit-brand-page">
        <div className="edit-brand-container">
          <div className="skeleton-header">
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line skeleton-line--subtitle" />
          </div>
          <div className="skeleton-body">
            <div className="skeleton-line skeleton-line--label" />
            <div className="skeleton-line skeleton-line--input" />
            <div className="skeleton-line skeleton-line--label" />
            <div className="skeleton-line skeleton-line--upload" />
          </div>
        </div>
      </div>
    );
  }

  // Fetch error
  if (fetchError) {
    return (
      <div className="edit-brand-page">
        <div className="edit-brand-container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Failed to Load Brand</h2>
            <p>{fetchError}</p>
            <div className="error-actions">
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/admin/brands")}
              >
                <FaArrowLeft /> Back to Brands
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

  // Check if there's a current logo to display
  const currentLogoUrl = form.existingLogo && !form.removeLogo && !form.logo
    ? `${API_BASE}/uploads/brands/${form.existingLogo}`
    : null;

  const displayPreview = form.preview || currentLogoUrl;

  return (
    <div className="edit-brand-page">
      <div className="edit-brand-container">
        {/* Header */}
        <div className="edit-brand-header">
          <button
            className="btn btn-icon"
            onClick={() => navigate("/admin/brands")}
            title="Back to brands"
          >
            <FaArrowLeft />
          </button>
          <div className="header-info">
            <h1>
              <FaTrademark className="header-icon" />
              Edit Brand
            </h1>
            <p className="header-subtitle">
              Update brand details — changes will be visible across all products.
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
        <form onSubmit={handleSubmit} className="edit-brand-form">
          {/* Brand Name */}
          <div className="form-group">
            <label htmlFor="brandName" className="form-label">
              Brand Name <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                id="brandName"
                type="text"
                className="form-input"
                placeholder="Enter brand name (e.g. Nike, Apple, Samsung)"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                autoFocus
                maxLength={100}
              />
            </div>
            <span className="form-hint">
              {form.name.length}/100 characters
            </span>
          </div>

          {/* Brand Logo */}
          <div className="form-group">
            <label className="form-label">
              Brand Logo
            </label>

            {displayPreview ? (
              <div className="logo-preview-card">
                <div className="logo-preview-container">
                  <img
                    src={displayPreview}
                    alt={`${form.name || "Brand"} logo`}
                    className="logo-preview-img"
                  />
                </div>
                <div className="logo-preview-actions">
                  <span className="logo-filename">
                    {form.logo
                      ? form.logo.name
                      : form.existingLogo || "Current logo"}
                  </span>
                  <div className="logo-actions-group">
                    <label className="btn btn-sm btn-outline change-logo-btn">
                      <FaUpload /> Change
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileInput}
                        hidden
                      />
                    </label>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={handleRemoveLogo}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`upload-zone ${dragOver ? "upload-zone--dragover" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById("logoUpload")?.click()}
              >
                <FaUpload className="upload-icon" />
                <p className="upload-text">
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p className="upload-hint">
                  JPEG, PNG, or WEBP. Max 5MB.
                </p>
                <input
                  id="logoUpload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileInput}
                  hidden
                />
              </div>
            )}

            {form.removeLogo && !form.logo && (
              <span className="form-hint form-hint--warning">
                Current logo will be removed on save.
              </span>
            )}
          </div>

          {/* Meta info */}
          <div className="form-divider" />

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/admin/brands")}
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

export default EditBrand;

