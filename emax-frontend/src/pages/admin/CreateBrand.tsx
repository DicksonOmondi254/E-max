import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUpload,
  FaTrash,
  FaSave,
  FaSpinner,
  FaTrademark,
} from "react-icons/fa";

import { brandService } from "../../services/brandService";

const CreateBrand = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    name: "",
    logo: null as File | null,
    preview: "",
  });

  useEffect(() => {
    return () => {
      if (form.preview) URL.revokeObjectURL(form.preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateForm = () => {
    const validationErrors: string[] = [];

    if (!form.name.trim()) {
      validationErrors.push("Brand name is required.");
    } else if (form.name.trim().length < 2) {
      validationErrors.push("Brand name must be at least 2 characters.");
    } else if (form.name.trim().length > 100) {
      validationErrors.push("Brand name must be under 100 characters.");
    }

    if (!form.logo) {
      validationErrors.push("Brand logo is required.");
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
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors([]);

      const data = new FormData();
      data.append("name", form.name.trim());
      if (form.logo) data.append("logo", form.logo);

      await brandService.createBrand(data);

      navigate("/admin/brands");
    } catch (error: any) {
      console.error(error);
      setErrors([error?.message || "Failed to create brand."]);
    } finally {
      setLoading(false);
    }
  };

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
              Create Brand
            </h1>
            <p className="header-subtitle">
              Add a new brand to your catalog — it will be available for
              product assignments.
            </p>
          </div>
        </div>

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
              Brand Logo <span className="required">*</span>
            </label>

            {form.preview ? (
              <div className="logo-preview-card">
                <div className="logo-preview-container">
                  <img
                    src={form.preview}
                    alt={`${form.name || "Brand"} logo preview`}
                    className="logo-preview-img"
                  />
                </div>
                <div className="logo-preview-actions">
                  <span className="logo-filename">
                    {form.logo?.name || "Brand logo"}
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
          </div>

          {/* Divider */}
          <div className="form-divider" />

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/admin/brands")}
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
                  <FaSpinner className="spin" /> Saving Brand...
                </>
              ) : (
                <>
                  <FaSave /> Create Brand
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBrand;

