import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFire, FaArrowLeft, FaSave, FaBox, FaPercent, FaCalendarAlt, FaClock } from "react-icons/fa";
import type { SellerProduct } from "../../services/sellerService";
import { sellerService } from "../../services/sellerService";

const CreateFlashSale = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    discountPercentage: "20",
    startDate: "",
    startTime: "00:00",
    endDate: "",
    endTime: "23:59",
  });

  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const result = await sellerService.getProducts({ limit: 100 });
        setProducts(result.data || []);
      } catch (err: any) {
        console.error("Failed to load products", err);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleProduct = (id: number) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(products.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError("Please enter a flash sale title.");
      return;
    }

    if (selectedProductIds.length === 0) {
      setError("Please select at least one product.");
      return;
    }

    const startDateTime = `${form.startDate}T${form.startTime}:00`;
    const endDateTime = `${form.endDate}T${form.endTime}:00`;

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      setError("End date/time must be after start date/time.");
      return;
    }

    if (new Date(startDateTime) <= new Date()) {
      setError("Start date/time must be in the future.");
      return;
    }

    setLoading(true);
    try {
      await sellerService.createFlashSale({
        title: form.title,
        description: form.description || undefined,
        discountPercentage: Number(form.discountPercentage),
        startDate: startDateTime,
        endDate: endDateTime,
        productIds: selectedProductIds,
      });
      navigate("/seller/promotions");
    } catch (err: any) {
      setError(err?.message || "Failed to create flash sale.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-page">
      <div className="s-page-header">
        <div>
          <h1><FaFire className="s-page-icon" /> Create Flash Sale</h1>
          <p className="s-page-subtitle">Set up a time-limited flash sale promotion</p>
        </div>
        <button className="s-btn s-btn-secondary" onClick={() => navigate("/seller/promotions")}>
          <FaArrowLeft /> Back
        </button>
      </div>

      <div className="s-form-card">
        {error && <div className="s-alert s-alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="s-form">
          {/* Title */}
          <div className="s-form-group">
            <label>Sale Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Weekend Mega Sale"
            />
          </div>

          {/* Description */}
          <div className="s-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your flash sale promotion..."
            />
          </div>

          {/* Discount & Schedule Row */}
          <div className="s-form-row">
            <div className="s-form-group">
              <label><FaPercent /> Discount Percentage *</label>
              <input
                type="number"
                name="discountPercentage"
                value={form.discountPercentage}
                onChange={handleChange}
                required
                min="1"
                max="100"
              />
            </div>
            <div className="s-form-group">
              <label><FaCalendarAlt /> Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="s-form-group">
              <label><FaClock /> Start Time *</label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="s-form-row">
            <div className="s-form-group">
              <label><FaCalendarAlt /> End Date *</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="s-form-group">
              <label><FaClock /> End Time *</label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Product Selection */}
          <div className="s-form-group">
            <label><FaBox /> Select Products * ({selectedProductIds.length} selected)</label>
            {productsLoading ? (
              <div className="s-loading-container">
                <p>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="s-alert s-alert-warning">
                No products found. Create some products first.
              </div>
            ) : (
              <div style={{
                border: "1.5px solid #e5e7eb",
                borderRadius: "10px",
                maxHeight: "300px",
                overflowY: "auto",
                padding: "8px",
              }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderBottom: "1px solid #f3f4f6",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "#374151",
                }}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  Select All Products
                </label>
                {products.map((product) => (
                  <label
                    key={product.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 12px",
                      borderBottom: "1px solid #f3f4f6",
                      cursor: "pointer",
                      transition: "background 0.1s",
                      background: selectedProductIds.includes(product.id) ? "#eef2ff" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedProductIds.includes(product.id)) {
                        e.currentTarget.style.background = "#f9fafb";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedProductIds.includes(product.id)) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedProductIds.includes(product.id)}
                      onChange={() => toggleProduct(product.id)}
                    />
                    <img
                      src={product.thumbnail || "/images/no-image.svg"}
                      alt={product.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        objectFit: "cover",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#111827",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                        {product.name}
                      </div>
                      <div style={{
                        fontSize: "11px",
                        color: "#6b7280",
                      }}>
                        KES {product.price.toLocaleString()} | Stock: {product.stock}
                      </div>
                    </div>
                    <div style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#059669",
                      whiteSpace: "nowrap",
                    }}>
                      KES {Math.round(product.price * (1 - Number(form.discountPercentage) / 100)).toLocaleString()}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {selectedProductIds.length > 0 && form.startDate && form.endDate && (
            <div style={{
              background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
              borderRadius: "10px",
              padding: "16px",
              fontSize: "13px",
              color: "#374151",
              border: "1px solid #c7d2fe",
            }}>
              <strong style={{ color: "#4338ca" }}>Flash Sale Summary</strong>
              <div style={{ marginTop: "8px", lineHeight: "1.8" }}>
                <div>• {selectedProductIds.length} product(s) will be discounted by <strong>{form.discountPercentage}%</strong></div>
                <div>• Starts: <strong>{new Date(`${form.startDate}T${form.startTime}`).toLocaleString()}</strong></div>
                <div>• Ends: <strong>{new Date(`${form.endDate}T${form.endTime}`).toLocaleString()}</strong></div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="s-form-actions">
            <button
              type="button"
              className="s-btn s-btn-secondary"
              onClick={() => navigate("/seller/promotions")}
            >
              Cancel
            </button>
            <button type="submit" className="s-btn s-btn-primary" disabled={loading}>
              <FaSave /> {loading ? "Creating..." : "Create Flash Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFlashSale;

