import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBullhorn, FaPlus, FaTag, FaFire, FaChartLine, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";

const Promotions = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<any[]>([
    { id: 1, code: "WELCOME10", discount: "10%", minOrder: "KES 1,000", usage: "45/100", expires: "2025-12-31", active: true },
    { id: 2, code: "FREESHIP", discount: "Free Shipping", minOrder: "KES 3,000", usage: "23/50", expires: "2025-11-30", active: true },
    { id: 3, code: "SALE20", discount: "20%", minOrder: "KES 5,000", usage: "12/30", expires: "2025-10-15", active: false },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: "", minOrder: "", maxUsage: "100", expires: "" });

  const handleAddCoupon = () => {
    if (!newCoupon.code) return;
    setCoupons((prev) => [...prev, { id: Date.now(), ...newCoupon, usage: "0/" + newCoupon.maxUsage, active: true }]);
    setNewCoupon({ code: "", discount: "", minOrder: "", maxUsage: "100", expires: "" });
    setShowForm(false);
  };

  const toggleCoupon = (id: number) => {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  };

  const deleteCoupon = (id: number) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="seller-page">
      <div className="s-page-header">
        <div>
          <h1><FaBullhorn className="s-page-icon" /> Promotions</h1>
          <p className="s-page-subtitle">Create coupons, manage campaigns, and boost sales</p>
        </div>
        <button className="s-btn s-btn-primary" onClick={() => setShowForm(!showForm)}>
          <FaPlus /> {showForm ? "Cancel" : "New Coupon"}
        </button>
      </div>

      {showForm && (
        <div className="s-form-card">
          <h3 style={{ margin: "0 0 16px" }}>Create New Coupon</h3>
          <div className="s-form">
            <div className="s-form-row">
              <div className="s-form-group">
                <label>Coupon Code *</label>
                <input type="text" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER20" />
              </div>
              <div className="s-form-group">
                <label>Discount *</label>
                <input type="text" value={newCoupon.discount} onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })} placeholder="10% or KES 500" />
              </div>
            </div>
            <div className="s-form-row">
              <div className="s-form-group">
                <label>Min. Order Amount</label>
                <input type="text" value={newCoupon.minOrder} onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })} placeholder="KES 1,000" />
              </div>
              <div className="s-form-group">
                <label>Max Usage</label>
                <input type="number" value={newCoupon.maxUsage} onChange={(e) => setNewCoupon({ ...newCoupon, maxUsage: e.target.value })} />
              </div>
              <div className="s-form-group">
                <label>Expiry Date</label>
                <input type="date" value={newCoupon.expires} onChange={(e) => setNewCoupon({ ...newCoupon, expires: e.target.value })} />
              </div>
            </div>
            <div className="s-form-actions">
              <button className="s-btn s-btn-primary" onClick={handleAddCoupon}><FaPlus /> Create Coupon</button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Cards */}
      <div className="s-promo-cards">
        <div className="s-promo-card">
          <FaFire className="s-promo-icon" />
          <h3>Flash Sale</h3>
          <p>Create time-limited flash sales with up to 70% off</p>
          <button className="s-btn s-btn-secondary" onClick={() => navigate("flash-sale/new")}>Create Flash Sale</button>
        </div>
        <div className="s-promo-card">
          <FaChartLine className="s-promo-icon" />
          <h3>Sponsored Ads</h3>
          <p>Boost your products to appear at the top of search results</p>
          <button className="s-btn s-btn-secondary" onClick={() => navigate("ad-campaign/new")}>Create Ad Campaign</button>
        </div>
        <div className="s-promo-card">
          <FaTag className="s-promo-icon" />
          <h3>Bulk Discount</h3>
          <p>Set volume-based discounts to encourage larger purchases</p>
          <button className="s-btn s-btn-secondary" onClick={() => navigate("bulk-discounts/new")}>Set Discounts</button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="s-card">
        <div className="s-card-header">
          <div className="s-card-header-left">
            <FaTag className="s-card-icon" />
            <h2>Your Coupons</h2>
          </div>
        </div>
        <div className="s-table-wrapper">
          <table className="s-table s-table-full">
            <thead>
              <tr>
                <th>Code</th><th>Discount</th><th>Min. Order</th><th>Usage</th><th>Expires</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td><span className="s-coupon-code">{c.code}</span></td>
                  <td>{c.discount}</td>
                  <td>{c.minOrder}</td>
                  <td>{c.usage}</td>
                  <td>{c.expires}</td>
                  <td><span className={`s-badge ${c.active ? "s-badge-delivered" : "s-badge-cancelled"}`}>{c.active ? "Active" : "Inactive"}</span></td>
                  <td>
                    <div className="s-action-btns">
                      <button className="s-action-btn" onClick={() => toggleCoupon(c.id)}>{c.active ? <FaToggleOff /> : <FaToggleOn />}</button>
                      <button className="s-action-btn s-action-delete" onClick={() => deleteCoupon(c.id)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Promotions;
