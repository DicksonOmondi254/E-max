import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaArrowLeft, FaSave, FaBox, FaDollarSign, FaCalendarAlt, FaClock, FaBullhorn, FaMousePointer, FaEye } from "react-icons/fa";
import type { SellerProduct } from "../../services/sellerService";
import { sellerService } from "../../services/sellerService";

const CreateAdCampaign = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    bidType: "CPC",
    dailyBudget: "500",
    totalBudget: "5000",
    startDate: "",
    startTime: "00:00",
    endDate: "",
    endTime: "23:59",
    targetGender: "all",
    minAge: "18",
    maxAge: "65",
    targetLocation: "",
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

  const calculateDailyBudget = () => {
    const total = Number(form.totalBudget) || 0;
    const daily = Number(form.dailyBudget) || 0;
    if (daily > 0) {
      return Math.floor(total / daily);
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Please enter a campaign name.");
      return;
    }

    if (selectedProductIds.length === 0) {
      setError("Please select at least one product to advertise.");
      return;
    }

    const startDateTime = `${form.startDate}T${form.startTime}:00`;
    const endDateTime = `${form.endDate}T${form.endTime}:00`;

    if (!form.startDate || !form.endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      setError("End date/time must be after start date/time.");
      return;
    }

    if (Number(form.totalBudget) < Number(form.dailyBudget)) {
      setError("Total budget must be greater than or equal to daily budget.");
      return;
    }

    setLoading(true);
    try {
      // For now, simulate a successful API call
      // In the future, this will call sellerService.createAdCampaign()
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/seller/promotions");
    } catch (err: any) {
      setError(err?.message || "Failed to create ad campaign.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111827",
    background: "#fff",
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px",
  };

  return (
    <div className="seller-page">
      <div className="s-page-header">
        <div>
          <h1><FaChartLine className="s-page-icon" /> Create Ad Campaign</h1>
          <p className="s-page-subtitle">Boost your products with targeted sponsored ads</p>
        </div>
        <button className="s-btn s-btn-secondary" onClick={() => navigate("/seller/promotions")}>
          <FaArrowLeft /> Back
        </button>
      </div>

      <div className="s-form-card">
        {error && <div className="s-alert s-alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="s-form">
          {/* Campaign Name */}
          <div className="s-form-group">
            <label style={labelStyle}><FaBullhorn /> Campaign Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Summer Collection Promo"
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div className="s-form-group">
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your ad campaign goals and targeting..."
              style={{ ...inputStyle, resize: "vertical" as const, fontFamily: "inherit" }}
            />
          </div>

          {/* Bid Type & Budget Row */}
          <div className="s-form-row">
            <div className="s-form-group">
              <label style={labelStyle}><FaMousePointer /> Bid Type</label>
              <select
                name="bidType"
                value={form.bidType}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="CPC">CPC (Cost Per Click)</option>
                <option value="CPM">CPM (Cost Per 1,000 Impressions)</option>
              </select>
            </div>
            <div className="s-form-group">
              <label style={labelStyle}><FaDollarSign /> Daily Budget (KES)</label>
              <input
                type="number"
                name="dailyBudget"
                value={form.dailyBudget}
                onChange={handleChange}
                required
                min="100"
                style={inputStyle}
              />
            </div>
            <div className="s-form-group">
              <label style={labelStyle}><FaDollarSign /> Total Budget (KES)</label>
              <input
                type="number"
                name="totalBudget"
                value={form.totalBudget}
                onChange={handleChange}
                required
                min="1000"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Schedule Row */}
          <div className="s-form-row">
            <div className="s-form-group">
              <label style={labelStyle}><FaCalendarAlt /> Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div className="s-form-group">
              <label style={labelStyle}><FaClock /> Start Time</label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div className="s-form-group">
              <label style={labelStyle}><FaCalendarAlt /> End Date *</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div className="s-form-group">
              <label style={labelStyle}><FaClock /> End Time</label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Targeting Section */}
          <div style={{
            background: "#f8fafc",
            borderRadius: "10px",
            padding: "20px",
            border: "1px solid #e2e8f0",
            marginTop: "8px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <FaEye style={{ color: "#6366f1", fontSize: "16px" }} />
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>Audience Targeting</h3>
            </div>
            <div className="s-form-row">
              <div className="s-form-group">
                <label style={labelStyle}>Gender</label>
                <select
                  name="targetGender"
                  value={form.targetGender}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="s-form-group">
                <label style={labelStyle}>Min Age</label>
                <input
                  type="number"
                  name="minAge"
                  value={form.minAge}
                  onChange={handleChange}
                  min="13"
                  max="100"
                  style={inputStyle}
                />
              </div>
              <div className="s-form-group">
                <label style={labelStyle}>Max Age</label>
                <input
                  type="number"
                  name="maxAge"
                  value={form.maxAge}
                  onChange={handleChange}
                  min="13"
                  max="100"
                  style={inputStyle}
                />
              </div>
              <div className="s-form-group">
                <label style={labelStyle}>Location</label>
                <input
                  type="text"
                  name="targetLocation"
                  value={form.targetLocation}
                  onChange={handleChange}
                  placeholder="e.g. Nairobi, Kenya"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div className="s-form-group">
            <label style={labelStyle}><FaBox /> Select Products to Advertise * ({selectedProductIds.length} selected)</label>
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
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Campaign Summary */}
          {selectedProductIds.length > 0 && form.startDate && form.endDate && form.name && (
            <div style={{
              background: "linear-gradient(135deg, #fef3c7, #fde68a)",
              borderRadius: "10px",
              padding: "16px",
              fontSize: "13px",
              color: "#92400e",
              border: "1px solid #fcd34d",
            }}>
              <strong style={{ color: "#78350f" }}>
                <FaBullhorn style={{ marginRight: "6px" }} />
                Campaign Summary
              </strong>
              <div style={{ marginTop: "8px", lineHeight: "1.8" }}>
                <div>• Campaign: <strong>{form.name}</strong></div>
                <div>• {selectedProductIds.length} product(s) selected for advertising</div>
                <div>• Bidding: <strong>{form.bidType === "CPC" ? "Cost Per Click" : "Cost Per 1,000 Impressions"}</strong></div>
                <div>• Daily Budget: <strong>KES {Number(form.dailyBudget).toLocaleString()}</strong></div>
                <div>• Total Budget: <strong>KES {Number(form.totalBudget).toLocaleString()}</strong></div>
                <div>• Duration: <strong>{calculateDailyBudget()} day(s)</strong></div>
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
              <FaSave /> {loading ? "Creating..." : "Create Ad Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdCampaign;

