import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTag, FaArrowLeft, FaSave, FaBox, FaPercent, FaDollarSign, FaCalendarAlt, FaClock, FaLayerGroup, FaInfoCircle } from "react-icons/fa";
import type { SellerProduct } from "../../services/sellerService";
import { sellerService } from "../../services/sellerService";

interface DiscountTier {
  id: number;
  minQuantity: number;
  maxQuantity: number;
  discountType: "percentage" | "flat";
  discountValue: number;
}

const SetDiscounts = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    startTime: "00:00",
    endDate: "",
    endTime: "23:59",
    appliesToAll: false,
  });

  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [discountTiers, setDiscountTiers] = useState<DiscountTier[]>([
    { id: 1, minQuantity: 2, maxQuantity: 5, discountType: "percentage", discountValue: 10 },
  ]);

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
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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

  const addTier = () => {
    const lastTier = discountTiers[discountTiers.length - 1];
    const newMin = lastTier ? lastTier.maxQuantity + 1 : 2;
    setDiscountTiers((prev) => [
      ...prev,
      {
        id: Date.now(),
        minQuantity: newMin,
        maxQuantity: newMin + 4,
        discountType: "percentage",
        discountValue: 15,
      },
    ]);
  };

  const removeTier = (id: number) => {
    if (discountTiers.length <= 1) {
      setError("You must have at least one discount tier.");
      return;
    }
    setDiscountTiers((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTier = (id: number, field: keyof DiscountTier, value: any) => {
    setDiscountTiers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      )
    );
  };

  const calculateDiscountedPrice = (originalPrice: number, tier: DiscountTier): number => {
    if (tier.discountType === "percentage") {
      return Math.round(originalPrice * (1 - tier.discountValue / 100));
    } else {
      return Math.max(0, originalPrice - tier.discountValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Please enter a discount name.");
      return;
    }

    if (!form.appliesToAll && selectedProductIds.length === 0) {
      setError("Please select at least one product or enable 'Applies to all products'.");
      return;
    }

    if (!form.startDate || !form.endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    const startDateTime = `${form.startDate}T${form.startTime}:00`;
    const endDateTime = `${form.endDate}T${form.endTime}:00`;

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      setError("End date/time must be after start date/time.");
      return;
    }

    // Validate tiers
    for (const tier of discountTiers) {
      if (tier.minQuantity < 2) {
        setError("Minimum quantity for tiers must be at least 2.");
        return;
      }
      if (tier.maxQuantity < tier.minQuantity) {
        setError("Max quantity must be greater than or equal to min quantity.");
        return;
      }
      if (tier.discountValue <= 0) {
        setError("Discount value must be greater than 0.");
        return;
      }
      if (tier.discountType === "percentage" && tier.discountValue > 100) {
        setError("Percentage discount cannot exceed 100%.");
        return;
      }
    }

    setLoading(true);
    try {
      const productIds = form.appliesToAll
        ? products.map((p) => p.id)
        : selectedProductIds;

      await sellerService.createBulkDiscount({
        name: form.name,
        description: form.description || undefined,
        startDate: startDateTime,
        endDate: endDateTime,
        productIds,
        tiers: discountTiers.map((t) => ({
          minQuantity: t.minQuantity,
          maxQuantity: t.maxQuantity,
          discountType: t.discountType,
          discountValue: t.discountValue,
        })),
      });
      navigate("/seller/promotions");
    } catch (err: any) {
      setError(err?.message || "Failed to create bulk discount.");
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
          <h1><FaTag className="s-page-icon" /> Set Bulk Discounts</h1>
          <p className="s-page-subtitle">Create volume-based tiered discounts to encourage larger purchases</p>
        </div>
        <button className="s-btn s-btn-secondary" onClick={() => navigate("/seller/promotions")}>
          <FaArrowLeft /> Back
        </button>
      </div>

      <div className="s-form-card">
        {error && <div className="s-alert s-alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="s-form">
          {/* Discount Name */}
          <div className="s-form-group">
            <label style={labelStyle}><FaTag /> Discount Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Summer Bulk Discount"
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div className="s-form-group">
            <label style={labelStyle}><FaInfoCircle /> Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your bulk discount promotion..."
              style={{ ...inputStyle, resize: "vertical" as const, fontFamily: "inherit" }}
            />
          </div>

          {/* Schedule */}
          <div style={{
            background: "#f8fafc",
            borderRadius: "10px",
            padding: "20px",
            border: "1px solid #e2e8f0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <FaCalendarAlt style={{ color: "#6366f1", fontSize: "16px" }} />
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>Schedule</h3>
            </div>
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
          </div>

          {/* Discount Tiers */}
          <div style={{
            background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
            borderRadius: "10px",
            padding: "20px",
            border: "1px solid #bbf7d0",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaLayerGroup style={{ color: "#059669", fontSize: "16px" }} />
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#065f46" }}>Discount Tiers</h3>
              </div>
              <button
                type="button"
                className="s-btn s-btn-sm s-btn-secondary"
                onClick={addTier}
                style={{ fontSize: "12px", padding: "6px 14px" }}
              >
                + Add Tier
              </button>
            </div>

            {discountTiers.map((tier, index) => (
              <div
                key={tier.id}
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  padding: "16px",
                  marginBottom: "12px",
                  border: "1px solid #e5e7eb",
                  position: "relative",
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#059669",
                    background: "#ecfdf5",
                    padding: "2px 12px",
                    borderRadius: "20px",
                  }}>
                    Tier {index + 1}
                  </span>
                  {discountTiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTier(tier.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: 600,
                        padding: "4px 8px",
                        borderRadius: "6px",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="s-form-row">
                  <div className="s-form-group">
                    <label style={labelStyle}>Min Quantity</label>
                    <input
                      type="number"
                      value={tier.minQuantity}
                      onChange={(e) => updateTier(tier.id, "minQuantity", parseInt(e.target.value) || 0)}
                      min="2"
                      style={inputStyle}
                    />
                  </div>
                  <div className="s-form-group">
                    <label style={labelStyle}>Max Quantity</label>
                    <input
                      type="number"
                      value={tier.maxQuantity}
                      onChange={(e) => updateTier(tier.id, "maxQuantity", parseInt(e.target.value) || 0)}
                      min={tier.minQuantity}
                      style={inputStyle}
                    />
                  </div>
                  <div className="s-form-group">
                    <label style={labelStyle}>Discount Type</label>
                    <select
                      value={tier.discountType}
                      onChange={(e) => updateTier(tier.id, "discountType", e.target.value)}
                      style={inputStyle}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (KES)</option>
                    </select>
                  </div>
                  <div className="s-form-group">
                    <label style={labelStyle}>
                      {tier.discountType === "percentage" ? <><FaPercent /> Discount %</> : <><FaDollarSign /> Discount (KES)</>}
                    </label>
                    <input
                      type="number"
                      value={tier.discountValue}
                      onChange={(e) => updateTier(tier.id, "discountValue", parseInt(e.target.value) || 0)}
                      min="1"
                      max={tier.discountType === "percentage" ? 100 : undefined}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Product Selection */}
          <div className="s-form-group">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                <input
                  type="checkbox"
                  name="appliesToAll"
                  checked={form.appliesToAll}
                  onChange={handleChange}
                />
                <FaBox /> Apply to all products
              </label>
            </div>

            {!form.appliesToAll && (
              <>
                <label style={labelStyle}><FaBox /> Select Products * ({selectedProductIds.length} selected)</label>
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
                        {/* Show discounted price for first tier */}
                        <div style={{
                          fontSize: "11px",
                          color: "#059669",
                          textAlign: "right" as const,
                        }}>
                          <div style={{ fontWeight: 600, fontSize: "12px" }}>
                            From KES {calculateDiscountedPrice(product.price, discountTiers[0]).toLocaleString()}
                          </div>
                          <div style={{ color: "#9ca3af" }}>
                            (tier 1)
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Summary */}
          {(selectedProductIds.length > 0 || form.appliesToAll) && form.startDate && form.endDate && form.name && (
            <div style={{
              background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
              borderRadius: "10px",
              padding: "16px",
              fontSize: "13px",
              color: "#374151",
              border: "1px solid #c7d2fe",
            }}>
              <strong style={{ color: "#4338ca" }}>
                <FaTag style={{ marginRight: "6px" }} />
                Bulk Discount Summary
              </strong>
              <div style={{ marginTop: "8px", lineHeight: "1.8" }}>
                <div>• Name: <strong>{form.name}</strong></div>
                <div>• Products: <strong>{form.appliesToAll ? products.length : selectedProductIds.length} product(s)</strong></div>
                <div>• Tiers: <strong>{discountTiers.length} tier(s)</strong></div>
                {discountTiers.map((tier, i) => (
                  <div key={tier.id}>
                    • Tier {i + 1}: <strong>{tier.minQuantity}-{tier.maxQuantity} qty</strong> → {tier.discountType === "percentage" ? `${tier.discountValue}% off` : `KES ${tier.discountValue} off`}
                  </div>
                ))}
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
              <FaSave /> {loading ? "Creating..." : "Create Bulk Discount"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetDiscounts;

