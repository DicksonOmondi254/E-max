import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaBox,
  FaArrowLeft,
  FaUpload,
  FaTimes,
  FaImage,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { brandService } from "../../services/brandService";

import "./CreateProduct.css";

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

type ToastType = "success" | "error";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const [errors, setErrors] = useState<string[]>([]);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    brandId: "",
    featured: false,
  });

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadData = useCallback(async () => {
    try {
      setLoadingData(true);
      setFetchError(null);

      const [categoryData, brandData, product] = await Promise.all([
        categoryService.getAllCategories(),
        brandService.getAllBrands(),
        productService.getProduct(Number(id)),
      ]);

      setCategories(categoryData);
      setBrands(brandData);

      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: String(product.price),
        stock: String(product.stock),
        categoryId: String(product.category.id),
        brandId: String(product.brand.id),
        featured: product.featured,
      });

      if (product.thumbnail) {
        setPreview(`http://localhost:5000/uploads/products/${product.thumbnail}`);
      }
    } catch (error: any) {
      console.error(error);
      setFetchError(error?.message || "Failed to load product.");
    } finally {
      setLoadingData(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleImageChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors(["Please select a valid image file."]);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(["Image must be less than 5MB."]);
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setErrors([]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e.target.files?.[0] || null);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    handleImageChange(file);
  }, []);

  const removeImage = () => {
    setImage(null);
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const validationErrors: string[] = [];

    if (!form.name.trim()) validationErrors.push("Product name is required.");
    if (!form.description.trim()) validationErrors.push("Description is required.");
    if (!form.price || Number(form.price) <= 0) validationErrors.push("Please enter a valid price greater than 0.");
    if (!form.stock || Number(form.stock) < 0) validationErrors.push("Please enter a valid stock quantity.");
    if (!form.categoryId) validationErrors.push("Please select a category.");
    if (!form.brandId) validationErrors.push("Please select a brand.");

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", form.name);
      data.append("slug", form.slug);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("stock", form.stock);
      data.append("categoryId", form.categoryId);
      data.append("brandId", form.brandId);
      data.append("featured", String(form.featured));

      if (image) {
        data.append("image", image);
      }

      await productService.updateProduct(Number(id), data);

      showToast("success", "Product updated successfully!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 800);
    } catch (error: any) {
      console.error(error);

      if (error.errors) {
        setErrors(error.errors);
      } else {
        showToast("error", error.message || "Failed to update product.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Skeleton Loading ──
  if (loadingData) {
    return (
      <div className="create-product-page">
        <div className="skeleton-header">
          <div className="skeleton-line skeleton-line--title" />
          <div className="skeleton-line skeleton-line--subtitle" />
        </div>
        <div className="create-product-container">
          <div className="skeleton-body">
            <div className="skeleton-line skeleton-line--label" />
            <div className="skeleton-line skeleton-line--input" />
            <div className="skeleton-line skeleton-line--label" />
            <div className="skeleton-line skeleton-line--input" />
            <div className="skeleton-line skeleton-line--label" />
            <div className="skeleton-line skeleton-line--textarea" />
            <div className="skeleton-line skeleton-line--label" />
            <div className="skeleton-line skeleton-line--input" />
            <div className="skeleton-line skeleton-line--upload" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error State ──
  if (fetchError && !loadingData) {
    return (
      <div className="create-product-page">
        <div className="create-product-header">
          <Link to="/admin/products" className="btn-icon" title="Back to Products">
            <FaArrowLeft />
          </Link>
          <div className="create-product-header-info">
            <h1>
              <FaBox className="header-icon" />
              Edit Product
            </h1>
            <p className="header-subtitle">Update product details in your catalog.</p>
          </div>
        </div>
        <div className="create-product-container">
          <div className="alert alert-error" style={{ marginBottom: 0 }}>
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">
              <div className="alert-header">Failed to Load Product</div>
              <p style={{ margin: "4px 0 12px", fontSize: 14 }}>{fetchError}</p>
              <button className="btn btn-primary btn-sm" onClick={loadData}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-product-page">
      {/* Toast Notification */}
      {toast && (
        <div className={`create-product-toast create-product-toast--${toast.type}`}>
          <span>{toast.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}</span>
          <span>{toast.message}</span>
          <button className="create-product-toast-close" onClick={() => setToast(null)}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="create-product-header">
        <Link to="/admin/products" className="btn-icon" title="Back to Products">
          <FaArrowLeft />
        </Link>
        <div className="create-product-header-info">
          <h1>
            <FaBox className="header-icon" />
            Edit Product
          </h1>
          <p className="header-subtitle">
            Update the details for "{form.name || "this product"}" in your catalog.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errors.length > 0 && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">
            <div className="alert-header">
              <span>Please fix the following errors:</span>
            </div>
            <ul className="alert-list">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="create-product-container">
        <form className="create-product-form" onSubmit={handleSubmit} noValidate>
          {/* Row 1: Name & Slug */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Product Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.some((e) => e.toLowerCase().includes("name")) ? "form-input--error" : ""}`}
                placeholder="Enter product name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
              <span className="form-hint">A clear, descriptive name for your product.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Slug</label>
              <input
                type="text"
                className="form-input"
                placeholder="product-slug"
                value={form.slug}
                onChange={(e) =>
                  setForm({
                    ...form,
                    slug: e.target.value,
                  })
                }
              />
              <span className="form-hint">URL-friendly identifier.</span>
            </div>
          </div>

          {/* Row 2: Description */}
          <div className="form-group form-group--full">
            <label className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              className={`form-textarea ${errors.some((e) => e.toLowerCase().includes("description")) ? "form-input--error" : ""}`}
              placeholder="Describe your product in detail — features, benefits, specifications..."
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              rows={5}
            />
            <span className="form-hint">Provide a thorough description to help customers make informed decisions.</span>
          </div>

          {/* Row 3: Price & Stock */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Price (KES) <span className="required">*</span>
              </label>
              <input
                type="number"
                className={`form-input ${errors.some((e) => e.toLowerCase().includes("price")) ? "form-input--error" : ""}`}
                placeholder="0.00"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value,
                  })
                }
              />
              <span className="form-hint">Set the selling price in Kenyan Shillings.</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                Stock Quantity <span className="required">*</span>
              </label>
              <input
                type="number"
                className={`form-input ${errors.some((e) => e.toLowerCase().includes("stock")) ? "form-input--error" : ""}`}
                placeholder="0"
                min="0"
                value={form.stock}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stock: e.target.value,
                  })
                }
              />
              <span className="form-hint">Number of units available for sale.</span>
            </div>
          </div>

          {/* Row 4: Category & Brand */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                className={`form-select ${errors.some((e) => e.toLowerCase().includes("category")) ? "form-input--error" : ""}`}
                value={form.categoryId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    categoryId: e.target.value,
                  })
                }
              >
                <option value="">— Select Category —</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <span className="form-hint">Choose the most relevant category.</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                Brand <span className="required">*</span>
              </label>
              <select
                className={`form-select ${errors.some((e) => e.toLowerCase().includes("brand")) ? "form-input--error" : ""}`}
                value={form.brandId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    brandId: e.target.value,
                  })
                }
              >
                <option value="">— Select Brand —</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              <span className="form-hint">Select the manufacturer or brand.</span>
            </div>
          </div>

          {/* Row 5: Featured Toggle */}
          <div className="form-divider" />
          <div className="form-group">
            <label className="form-label">Product Visibility</label>
            <div className="toggle-wrapper">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      featured: e.target.checked,
                    })
                  }
                />
                <span className="toggle-slider" />
              </label>
              <span className="toggle-label">
                Mark as Featured Product
                <span className="toggle-label-badge">
                  {form.featured ? "⭐ Featured" : "Normal"}
                </span>
              </span>
            </div>
            <span className="form-hint">
              Featured products are highlighted and shown prominently on the storefront.
            </span>
          </div>
          <div className="form-divider" />

          {/* Row 6: Image Upload */}
          <div className="form-group form-group--full">
            <label className="form-label">Product Image</label>

            {!preview ? (
              <div
                className={`upload-zone ${dragOver ? "upload-zone--dragover" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <span className="upload-icon">
                  <FaImage />
                </span>
                <p className="upload-text">
                  Drag & drop an image here, or click to browse
                </p>
                <p className="upload-hint">
                  Supports: JPG, PNG, WEBP — Max size: 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  style={{ display: "none" }}
                />
              </div>
            ) : (
              <div className="image-preview-card">
                <div className="image-preview-container">
                  <img src={preview} alt="Product preview" className="image-preview-img" />
                </div>
                <div className="image-preview-actions">
                  <span className="image-filename">
                    {image?.name || "Current product image"}
                  </span>
                  <div className="image-actions-group">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaUpload /> Change
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={removeImage}
                    >
                      <FaTimes /> Remove
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            )}
            <span className="form-hint">
              A high-quality image helps attract customers. Leave empty to keep the current image.
            </span>
          </div>

          {/* Form Actions */}
          <div className="form-divider" />
          <div className="form-actions">
            <Link to="/admin/products" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="spin" />
                  Updating Product...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;

