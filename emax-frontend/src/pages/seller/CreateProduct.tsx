import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaSave, FaArrowLeft, FaUpload } from "react-icons/fa";
import { productService } from "../../services/productService";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", price: "", stock: "",
    categoryId: "", brandId: "", featured: false, discount: "0",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch("http://localhost:5000/api/categories"),
          fetch("http://localhost:5000/api/brands"),
        ]);
        const catData = await catRes.json();
        const brandData = await brandRes.json();
        setCategories(catData.data || []);
        setBrands(brandData.data || []);
      } catch (err) {
        console.error("Failed to load categories/brands", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (name === "name" && !form.slug) {
      setForm((prev) => ({ ...prev, slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug || form.name.toLowerCase().replace(/\s+/g, "-"));
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("categoryId", form.categoryId);
      formData.append("brandId", form.brandId);
      formData.append("featured", String(form.featured));
      formData.append("discount", form.discount);
      if (thumbnail) formData.append("image", thumbnail);
      await productService.createProduct(formData);
      navigate("/seller/products");
    } catch (err: any) {
      setError(err?.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-page">
      <div className="s-page-header">
        <div>
          <h1><FaBox className="s-page-icon" /> Add New Product</h1>
          <p className="s-page-subtitle">List a new product in your catalog</p>
        </div>
        <button className="s-btn s-btn-secondary" onClick={() => navigate("/seller/products")}>
          <FaArrowLeft /> Back
        </button>
      </div>

      <div className="s-form-card">
        {error && <div className="s-alert s-alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="s-form">
          <div className="s-form-row">
            <div className="s-form-group">
              <label>Product Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Enter product name" />
            </div>
            <div className="s-form-group">
              <label>Slug *</label>
              <input type="text" name="slug" value={form.slug} onChange={handleChange} required placeholder="product-slug" />
            </div>
          </div>
          <div className="s-form-group">
            <label>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe your product..." />
          </div>
          <div className="s-form-row">
            <div className="s-form-group">
              <label>Price (KES) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" />
            </div>
            <div className="s-form-group">
              <label>Stock *</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} required min="0" />
            </div>
            <div className="s-form-group">
              <label>Discount (%)</label>
              <input type="number" name="discount" value={form.discount} onChange={handleChange} min="0" max="100" />
            </div>
          </div>
          <div className="s-form-row">
            <div className="s-form-group">
              <label>Category *</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="s-form-group">
              <label>Brand *</label>
              <select name="brandId" value={form.brandId} onChange={handleChange} required>
                <option value="">Select Brand</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="s-form-group s-form-checkbox">
              <label>
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                Featured Product
              </label>
            </div>
          </div>
          <div className="s-form-group">
            <label>Product Image</label>
            <div className="s-file-upload">
              {preview ? <img src={preview} alt="Preview" className="s-upload-preview" /> : <FaUpload className="s-upload-icon" />}
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <span>{thumbnail ? thumbnail.name : "Click to upload image"}</span>
            </div>
          </div>
          <div className="s-form-actions">
            <button type="submit" className="s-btn s-btn-primary" disabled={loading}>
              <FaSave /> {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
