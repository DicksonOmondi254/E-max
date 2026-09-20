import { useEffect, useState } from "react";
import { FaMoneyBillWave, FaCalendarAlt, FaArrowDown, FaArrowUp, FaDownload, FaPercent, FaBox, FaExclamationTriangle, FaCheckCircle, FaCalendarCheck, FaChartLine } from "react-icons/fa";
import { sellerService } from "../../services/sellerService";
import type { SellerEarnings, Transaction } from "../../services/sellerService";

const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;

const SellerEarnings = () => {
  const [data, setData] = useState<SellerEarnings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const d = await sellerService.getEarnings();
        setData(d);
      } catch (err: any) {
        setError(err?.message || "Failed to load earnings.");
      } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="seller-page"><div className="s-loading-container"><p>Loading earnings...</p></div></div>;
  if (error) return <div className="seller-page"><div className="s-alert s-alert-danger">{error}</div></div>;
  if (!data) return null;

  return (
    <div className="seller-page">
      <div className="s-page-header">
        <div>
          <h1><FaMoneyBillWave className="s-page-icon" /> Earnings & Finance</h1>
          <p className="s-page-subtitle">Track your revenue, payouts, and transaction history</p>
        </div>
      </div>

      <div className="s-stats-grid">
        <div className="s-stat-card s-stat-card--revenue">
          <div className="s-stat-icon"><FaMoneyBillWave /></div>
          <div className="s-stat-info">
            <span className="s-stat-value">{formatCurrency(data.totalRevenue)}</span>
            <span className="s-stat-label">Total Revenue</span>
          </div>
        </div>
        <div className="s-stat-card s-stat-card--orders">
          <div className="s-stat-icon"><FaCalendarAlt /></div>
          <div className="s-stat-info">
            <span className="s-stat-value">{formatCurrency(data.revenueThisMonth)}</span>
            <span className="s-stat-label">This Month</span>
          </div>
        </div>
        <div className="s-stat-card s-stat-card--products">
          <div className="s-stat-icon"><FaMoneyBillWave /></div>
          <div className="s-stat-info">
            <span className="s-stat-value">{formatCurrency(data.pendingPayout)}</span>
            <span className="s-stat-label">Pending Payout</span>
          </div>
        </div>
        <div className="s-stat-card s-stat-card--pending">
          <div className="s-stat-icon"><FaArrowUp /></div>
          <div className="s-stat-info">
            <span className="s-stat-value">{formatCurrency(data.availableForPayout)}</span>
            <span className="s-stat-label">Available for Payout</span>
          </div>
        </div>
      </div>

      <div className="s-dashboard-grid">
        {/* ── Fee Breakdown Card ── */}
        <div className="s-card">
          <div className="s-card-header">
            <div className="s-card-header-left">
              <FaPercent className="s-card-icon" />
              <h2>Fee Breakdown</h2>
            </div>
          </div>
          <div className="s-payout-grid">
            <div className="s-payout-grid-item">
              <div className="s-payout-grid-icon s-pgi-revenue">
                <FaMoneyBillWave />
              </div>
              <div className="s-payout-grid-info">
                <span className="s-payout-grid-label">Total Commission</span>
                <span className="s-payout-grid-value">{formatCurrency(data.totalCommission)}</span>
              </div>
            </div>
            <div className="s-payout-grid-item">
              <div className="s-payout-grid-icon s-pgi-customers">
                <FaBox />
              </div>
              <div className="s-payout-grid-info">
                <span className="s-payout-grid-label">Total Shipping Fees</span>
                <span className="s-payout-grid-value">{formatCurrency(data.totalShippingFees)}</span>
              </div>
            </div>
            <div className="s-payout-grid-item">
              <div className="s-payout-grid-icon s-pgi-balance">
                <FaExclamationTriangle />
              </div>
              <div className="s-payout-grid-info">
                <span className="s-payout-grid-label">Total Penalties</span>
                <span className="s-payout-grid-value" style={{ color: "#dc2626" }}>{formatCurrency(data.totalPenalties)}</span>
              </div>
            </div>
            <div className="s-payout-grid-item">
              <div className="s-payout-grid-icon s-pgi-revenue" style={{ background: "#d1fae5", color: "#059669" }}>
                <FaCheckCircle />
              </div>
              <div className="s-payout-grid-info">
                <span className="s-payout-grid-label">Net Revenue (after fees)</span>
                <span className="s-payout-grid-value" style={{ color: "#059669" }}>{formatCurrency(data.totalRevenue - data.totalCommission - data.totalPenalties)}</span>
              </div>
            </div>
          </div>
          <div className="s-payout-stats-row">
            <div className="s-payout-stat-chip">
              <FaPercent className="s-payout-chip-icon" />
              Commission: {data.totalRevenue > 0 ? ((data.totalCommission / data.totalRevenue) * 100).toFixed(1) : "0"}%
            </div>
            <div className="s-payout-stat-chip">
              <FaBox className="s-payout-chip-icon" />
              Shipping: {data.totalRevenue > 0 ? ((data.totalShippingFees / data.totalRevenue) * 100).toFixed(1) : "0"}%
            </div>
            <div className="s-payout-stat-chip">
              <FaExclamationTriangle className="s-payout-chip-icon" />
              Penalties: {data.totalRevenue > 0 ? ((data.totalPenalties / data.totalRevenue) * 100).toFixed(1) : "0"}%
            </div>
          </div>
        </div>

        {/* ── Payout Summary Card ── */}
        <div className="s-card">
          <div className="s-card-header">
            <div className="s-card-header-left">
              <FaDownload className="s-card-icon" />
              <h2>Payout Summary</h2>
            </div>
          </div>
          {/* Hero Balance */}
          <div className="s-payout-hero">
            <div className="s-payout-hero-bg" />
            <div className="s-payout-hero-content">
              <span className="s-payout-hero-label">Net Revenue Balance</span>
              <span className="s-payout-hero-amount">{formatCurrency(data.totalRevenue - data.totalCommission - data.totalPenalties)}</span>
              <div className="s-payout-hero-meta">
                <span className="s-payout-hero-date">
                  <FaCalendarCheck /> Available for payout
                </span>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          {data.revenueLastMonth > 0 && (
            <div className="s-payout-progress-section">
              <div className="s-payout-progress-header">
                <span>Monthly Growth Progress</span>
                <span>
                  {data.revenueThisMonth > data.revenueLastMonth
                    ? `+${((data.revenueThisMonth - data.revenueLastMonth) / data.revenueLastMonth * 100).toFixed(1)}%`
                    : `${((data.revenueThisMonth / data.revenueLastMonth) * 100).toFixed(1)}%`}
                </span>
              </div>
              <div className="s-payout-progress-track">
                <div
                  className="s-payout-progress-fill"
                  style={{
                    width: `${Math.min((data.revenueThisMonth / (data.revenueLastMonth * 1.5)) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          )}
          {/* Payout Grid */}
          <div className="s-payout-grid">
            <div className="s-payout-grid-item">
              <div className="s-payout-grid-icon s-pgi-rating">
                <FaCalendarAlt />
              </div>
              <div className="s-payout-grid-info">
                <span className="s-payout-grid-label">Last Month</span>
                <span className="s-payout-grid-value">{formatCurrency(data.revenueLastMonth)}</span>
              </div>
            </div>
            <div className="s-payout-grid-item">
              <div className="s-payout-grid-icon s-pgi-revenue">
                <FaChartLine />
              </div>
              <div className="s-payout-grid-info">
                <span className="s-payout-grid-label">This Month</span>
                <span className="s-payout-grid-value">{formatCurrency(data.revenueThisMonth)}</span>
              </div>
            </div>
            <div className="s-payout-grid-item">
              <div className="s-payout-grid-icon" style={{ background: data.revenueLastMonth > 0 ? "#d1fae5" : "#fee2e2", color: data.revenueLastMonth > 0 ? "#059669" : "#dc2626" }}>
                {data.revenueLastMonth > 0 ? <FaArrowUp /> : <FaArrowDown />}
              </div>
              <div className="s-payout-grid-info">
                <span className="s-payout-grid-label">Growth</span>
                <span className="s-payout-grid-value" style={{ color: data.revenueLastMonth > 0 ? "#059669" : "#dc2626" }}>
                  {data.revenueLastMonth > 0
                    ? `${((data.revenueThisMonth - data.revenueLastMonth) / data.revenueLastMonth * 100).toFixed(1)}%`
                    : "N/A"}
                </span>
              </div>
            </div>
            <div className="s-payout-grid-item">
              <div className="s-payout-grid-icon s-pgi-customers">
                <FaMoneyBillWave />
              </div>
              <div className="s-payout-grid-info">
                <span className="s-payout-grid-label">Expected Payout</span>
                <span className="s-payout-grid-value">{formatCurrency(data.availableForPayout)}</span>
                <span className="s-payout-grid-sub">Pending: {formatCurrency(data.pendingPayout)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="s-card">
        <div className="s-card-header">
          <div className="s-card-header-left">
            <FaMoneyBillWave className="s-card-icon" />
            <h2>Transaction History</h2>
          </div>
        </div>
        <div className="s-table-wrapper">
          <table className="s-table s-table-full">
            <thead>
              <tr><th>Order</th><th>Amount</th><th>Commission</th><th>Shipping</th><th>Penalty</th><th>Net</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {data.transactions.length === 0 ? (
                <tr><td colSpan={8}><div className="s-empty-state"><p>No transactions yet.</p></div></td></tr>
              ) : (
                data.transactions.map((t: Transaction, i: number) => (
                  <tr key={t.id || i}>
                    <td><span className="s-order-number">{t.orderNumber}</span></td>
                    <td>{formatCurrency(t.amount)}</td>
                    <td>{formatCurrency(t.commission)}</td>
                    <td>{formatCurrency(t.shippingFee)}</td>
                    <td>{formatCurrency(t.penalty)}</td>
                    <td><strong>{formatCurrency(t.netAmount)}</strong></td>
                    <td><span className={`s-badge ${t.status === "paid" ? "s-badge-delivered" : "s-badge-pending"}`}>{t.status}</span></td>
                    <td><span className="s-date">{new Date(t.date).toLocaleDateString()}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerEarnings;
