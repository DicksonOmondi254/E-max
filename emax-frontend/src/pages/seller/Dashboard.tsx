import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBox, FaShoppingCart, FaMoneyBillWave, FaClock, FaExclamationCircle,
  FaPlus, FaArrowRight, FaStore, FaTachometerAlt, FaChartLine, FaStar,
  FaUsers, FaEye, FaExclamationTriangle, FaDollarSign, FaCalendarAlt,
  FaChartBar, FaPercentage, FaTruck, FaCheckCircle, FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";
import { sellerService } from "../../services/sellerService";
import type { SellerDashboardStats, SalesTrendPoint, TopProduct } from "../../services/sellerService";
import "./Dashboard.css";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "s-badge-pending" },
  PROCESSING: { label: "Processing", className: "s-badge-processing" },
  SHIPPED: { label: "Shipped", className: "s-badge-shipped" },
  DELIVERED: { label: "Delivered", className: "s-badge-delivered" },
  CANCELLED: { label: "Cancelled", className: "s-badge-cancelled" },
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;

const SellerDashboard = () => {
  const [stats, setStats] = useState<SellerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sellerService.getDashboard();
      setStats(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load seller dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  if (loading) {
    return (
      <div className="seller-dashboard">
        <div className="s-loading-container">
          <div className="s-loading-spinner"><FaStore /></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-dashboard">
        <div className="s-error-state">
          <FaExclamationCircle className="s-error-icon" />
          <h2>Failed to Load Dashboard</h2>
          <p>{error}</p>
          <button className="s-btn s-btn-primary" onClick={loadDashboard}>Retry</button>
        </div>
      </div>
    );
  }

  const s = stats!;
  const maxSales = Math.max(...s.salesTrend.map((t: SalesTrendPoint) => t.sales), 1);

  return (
    <div className="seller-dashboard">
      {/* Welcome Banner */}
      <div className="s-welcome-banner">
        <div className="s-welcome-content">
          <div className="s-welcome-icon"><FaTachometerAlt /></div>
          <div className="s-welcome-text">
            <h1>Seller Dashboard</h1>
            <p>
              You have <strong>{s.activeProducts} active products</strong> and{" "}
              <strong>{s.pendingOrders} pending orders</strong>.
              {s.lowStockProducts > 0 && (
                <span className="s-warning-text"> {s.lowStockProducts} products are low on stock!</span>
              )}
            </p>
          </div>
        </div>
        <div className="s-welcome-actions">
          <Link to="/seller/products/new" className="s-btn s-btn-primary s-btn-glow">
            <FaPlus /> Add Product
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="s-stats-grid">
        <div className="s-stat-card s-stat-card--products">
          <div className="s-stat-icon"><FaBox /></div>
          <div className="s-stat-info">
            <span className="s-stat-value">{s.products}</span>
            <span className="s-stat-label">Total Products</span>
          </div>
          <div className="s-stat-trend">
            <span className="s-stat-trend-badge s-trend-active">{s.activeProducts} active</span>
          </div>
        </div>
        <div className="s-stat-card s-stat-card--orders">
          <div className="s-stat-icon"><FaShoppingCart /></div>
          <div className="s-stat-info">
            <span className="s-stat-value">{s.totalOrders}</span>
            <span className="s-stat-label">Total Orders</span>
          </div>
          <div className="s-stat-trend">
            <span className="s-stat-trend-badge s-trend-pending">{s.pendingOrders} pending</span>
          </div>
        </div>
        <div className="s-stat-card s-stat-card--revenue">
          <div className="s-stat-icon"><FaMoneyBillWave /></div>
          <div className="s-stat-info">
            <span className="s-stat-value">{formatCurrency(s.revenue)}</span>
            <span className="s-stat-label">Total Revenue</span>
          </div>
          <div className="s-stat-trend">
            <span className="s-stat-trend-badge s-trend-revenue">From delivered</span>
          </div>
        </div>
        <div className="s-stat-card s-stat-card--pending">
          <div className="s-stat-icon"><FaClock /></div>
          <div className="s-stat-info">
            <span className="s-stat-value">{s.pendingOrders}</span>
            <span className="s-stat-label">Pending Orders</span>
          </div>
          <div className="s-stat-trend">
            <span className="s-stat-trend-badge s-trend-urgent">Needs attention</span>
          </div>
        </div>
      </div>

      {/* Quick Overview - Modern Stats Section */}
      <div className="s-quick-overview">
        <div className="s-quick-overview-header">
          <FaTachometerAlt className="s-quick-overview-icon" />
          <h2>Quick Overview</h2>
        </div>
        <div className="s-quick-overview-groups">
          {/* Orders Group */}
          <div className="s-quick-group">
            <div className="s-quick-group-title">
              <FaShoppingCart className="s-quick-group-icon" />
              <span>Orders</span>
            </div>
            <div className="s-quick-group-cards">
              <div className="s-quick-card s-quick-card--orders-today">
                <div className="s-quick-card-icon-wrap">
                  <FaEye />
                </div>
                <div className="s-quick-card-info">
                  <span className="s-quick-card-value">{s.ordersToday}</span>
                  <span className="s-quick-card-label">Today</span>
                </div>
                <div className="s-quick-card-badge">24h</div>
              </div>
              <div className="s-quick-card s-quick-card--orders-week">
                <div className="s-quick-card-icon-wrap">
                  <FaCalendarAlt />
                </div>
                <div className="s-quick-card-info">
                  <span className="s-quick-card-value">{s.ordersWeek}</span>
                  <span className="s-quick-card-label">This Week</span>
                </div>
                <div className="s-quick-card-badge">7d</div>
              </div>
              <div className="s-quick-card s-quick-card--orders-month">
                <div className="s-quick-card-icon-wrap">
                  <FaChartBar />
                </div>
                <div className="s-quick-card-info">
                  <span className="s-quick-card-value">{s.ordersMonth}</span>
                  <span className="s-quick-card-label">This Month</span>
                </div>
                <div className="s-quick-card-badge">30d</div>
              </div>
            </div>
          </div>

          {/* Revenue Group */}
          <div className="s-quick-group">
            <div className="s-quick-group-title">
              <FaMoneyBillWave className="s-quick-group-icon" />
              <span>Revenue</span>
            </div>
            <div className="s-quick-group-cards">
              <div className="s-quick-card s-quick-card--revenue-today">
                <div className="s-quick-card-icon-wrap">
                  <FaDollarSign />
                </div>
                <div className="s-quick-card-info">
                  <span className="s-quick-card-value">{formatCurrency(s.revenueToday)}</span>
                  <span className="s-quick-card-label">Today</span>
                </div>
                <div className="s-quick-card-badge">24h</div>
              </div>
              <div className="s-quick-card s-quick-card--revenue-week">
                <div className="s-quick-card-icon-wrap">
                  <FaChartLine />
                </div>
                <div className="s-quick-card-info">
                  <span className="s-quick-card-value">{formatCurrency(s.revenueWeek)}</span>
                  <span className="s-quick-card-label">This Week</span>
                </div>
                <div className="s-quick-card-badge">7d</div>
              </div>
              <div className="s-quick-card s-quick-card--revenue-month">
                <div className="s-quick-card-icon-wrap">
                  <FaMoneyBillWave />
                </div>
                <div className="s-quick-card-info">
                  <span className="s-quick-card-value">{formatCurrency(s.revenueMonth)}</span>
                  <span className="s-quick-card-label">This Month</span>
                </div>
                <div className="s-quick-card-badge">30d</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="s-alerts-row">
        {s.lowStockProducts > 0 && (
          <div className="s-alert s-alert-warning">
            <FaExclamationTriangle /> {s.lowStockProducts} product{s.lowStockProducts > 1 ? "s" : ""} with low stock (≤5 units)
          </div>
        )}
        {s.pendingOrders > 0 && (
          <div className="s-alert s-alert-danger">
            <FaClock /> {s.pendingOrders} pending order{s.pendingOrders > 1 ? "s" : ""} waiting for processing
          </div>
        )}
        {s.averageRating > 0 && (
          <div className="s-alert s-alert-success">
            <FaStar /> Average rating: {s.averageRating.toFixed(1)} / 5 from {s.totalReviews} reviews
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="s-dashboard-grid">
        {/* Sales Trend Chart */}
        <div className="s-card s-chart-card">
          <div className="s-card-header">
            <div className="s-card-header-left">
              <FaChartLine className="s-card-icon" />
              <h2>Sales Trend (Last 7 Days)</h2>
            </div>
          </div>
          <div className="s-chart-body">
            <div className="s-bar-chart">
              {s.salesTrend.map((point: SalesTrendPoint, idx: number) => (
                <div key={idx} className="s-bar-item">
                  <div className="s-bar-label">{point.date.slice(5)}</div>
                  <div className="s-bar-track">
                    <div
                      className="s-bar-fill"
                      style={{ height: `${(point.sales / maxSales) * 100}%` }}
                      title={`KES ${point.sales.toLocaleString()}`}
                    />
                  </div>
                  <div className="s-bar-value">{point.orders}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payout Summary — Modern Financial Widget */}
        <div className="s-card s-payout-card">
          <div className="s-card-header">
            <div className="s-card-header-left">
              <FaDollarSign className="s-card-icon" />
              <h2>Payout Summary</h2>
            </div>
          </div>
          <div className="s-payout-body">
            {/* Hero Balance */}
            <div className="s-payout-hero">
              <div className="s-payout-hero-bg" />
              <div className="s-payout-hero-content">
                <span className="s-payout-hero-label">Available Balance</span>
                <span className="s-payout-hero-amount">{formatCurrency(s.payoutBalance)}</span>
                <div className="s-payout-hero-meta">
                  <span className="s-payout-hero-date">
                    <FaCalendarAlt /> Next payout: {s.nextPayoutDate ? formatDate(s.nextPayoutDate) : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="s-payout-progress-section">
              <div className="s-payout-progress-header">
                <span>Payout Progress</span>
                <span>85% of total revenue</span>
              </div>
              <div className="s-payout-progress-track">
                <div
                  className="s-payout-progress-fill"
                  style={{ width: `${Math.min((s.payoutBalance / (s.revenue || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Detailed Grid */}
            <div className="s-payout-grid">
              <div className="s-payout-grid-item">
                <div className="s-payout-grid-icon s-pgi-balance">
                  <FaMoneyBillWave />
                </div>
                <div className="s-payout-grid-info">
                  <span className="s-payout-grid-label">Pending Payout</span>
                  <span className="s-payout-grid-value">
                    {formatCurrency(s.revenue - s.payoutBalance)}
                  </span>
                </div>
              </div>
              <div className="s-payout-grid-item">
                <div className="s-payout-grid-icon s-pgi-revenue">
                  <FaChartLine />
                </div>
                <div className="s-payout-grid-info">
                  <span className="s-payout-grid-label">Total Revenue</span>
                  <span className="s-payout-grid-value">{formatCurrency(s.revenue)}</span>
                </div>
              </div>
              <div className="s-payout-grid-item">
                <div className="s-payout-grid-icon s-pgi-customers">
                  <FaUsers />
                </div>
                <div className="s-payout-grid-info">
                  <span className="s-payout-grid-label">Customers</span>
                  <span className="s-payout-grid-value">{s.totalCustomers}</span>
                </div>
              </div>
              <div className="s-payout-grid-item">
                <div className="s-payout-grid-icon s-pgi-rating">
                  <FaStar />
                </div>
                <div className="s-payout-grid-info">
                  <span className="s-payout-grid-label">Avg. Rating</span>
                  <span className="s-payout-grid-value">
                    {s.averageRating.toFixed(1)} <span className="s-payout-grid-sub">/ 5</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="s-payout-stats-row">
              <div className="s-payout-stat-chip">
                <FaPercentage className="s-payout-chip-icon" />
                <span>Commission: 10%</span>
              </div>
              <div className="s-payout-stat-chip">
                <FaTruck className="s-payout-chip-icon" />
                <span>Shipping: 5%</span>
              </div>
              <div className="s-payout-stat-chip">
                <FaCheckCircle className="s-payout-chip-icon" />
                <span>{s.deliveredOrders} delivered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Overview — Visual Pipeline */}
      <div className="s-card s-status-card">
        <div className="s-card-header">
          <div className="s-card-header-left">
            <FaShoppingCart className="s-card-icon" />
            <h2>Order Status Overview</h2>
          </div>
          <span className="s-status-total-badge">{s.totalOrders} total</span>
        </div>
        <div className="s-status-body">
          {/* Pipeline Flow */}
          <div className="s-status-pipeline">
            <div className="s-status-pipeline-item" data-status="pending">
              <div className="s-status-pipeline-icon">
                <FaClock />
              </div>
              <div className="s-status-pipeline-info">
                <span className="s-status-pipeline-count">{s.pendingOrders}</span>
                <span className="s-status-pipeline-label">Pending</span>
              </div>
              <span className="s-status-pipeline-arrow"><FaArrowRight /></span>
            </div>
            <div className="s-status-pipeline-item" data-status="processing">
              <div className="s-status-pipeline-icon">
                <FaSpinner />
              </div>
              <div className="s-status-pipeline-info">
                <span className="s-status-pipeline-count">{s.processingOrders}</span>
                <span className="s-status-pipeline-label">Processing</span>
              </div>
              <span className="s-status-pipeline-arrow"><FaArrowRight /></span>
            </div>
            <div className="s-status-pipeline-item" data-status="shipped">
              <div className="s-status-pipeline-icon">
                <FaTruck />
              </div>
              <div className="s-status-pipeline-info">
                <span className="s-status-pipeline-count">{s.shippedOrders}</span>
                <span className="s-status-pipeline-label">Shipped</span>
              </div>
              <span className="s-status-pipeline-arrow"><FaArrowRight /></span>
            </div>
            <div className="s-status-pipeline-item" data-status="delivered">
              <div className="s-status-pipeline-icon">
                <FaCheckCircle />
              </div>
              <div className="s-status-pipeline-info">
                <span className="s-status-pipeline-count">{s.deliveredOrders}</span>
                <span className="s-status-pipeline-label">Delivered</span>
              </div>
              <span className="s-status-pipeline-arrow"><FaArrowRight /></span>
            </div>
            <div className="s-status-pipeline-item" data-status="cancelled">
              <div className="s-status-pipeline-icon">
                <FaTimesCircle />
              </div>
              <div className="s-status-pipeline-info">
                <span className="s-status-pipeline-count">{s.cancelledOrders}</span>
                <span className="s-status-pipeline-label">Cancelled</span>
              </div>
            </div>
          </div>

          {/* Distribution Bar */}
          <div className="s-status-distribution">
            {s.totalOrders > 0 && (
              <>
                <div className="s-status-dist-bar" title={`Pending: ${((s.pendingOrders / s.totalOrders) * 100).toFixed(1)}%`} style={{ width: `${(s.pendingOrders / s.totalOrders) * 100}%`, background: '#f59e0b' }} />
                <div className="s-status-dist-bar" title={`Processing: ${((s.processingOrders / s.totalOrders) * 100).toFixed(1)}%`} style={{ width: `${(s.processingOrders / s.totalOrders) * 100}%`, background: '#6366f1' }} />
                <div className="s-status-dist-bar" title={`Shipped: ${((s.shippedOrders / s.totalOrders) * 100).toFixed(1)}%`} style={{ width: `${(s.shippedOrders / s.totalOrders) * 100}%`, background: '#8b5cf6' }} />
                <div className="s-status-dist-bar" title={`Delivered: ${((s.deliveredOrders / s.totalOrders) * 100).toFixed(1)}%`} style={{ width: `${(s.deliveredOrders / s.totalOrders) * 100}%`, background: '#10b981' }} />
                <div className="s-status-dist-bar" title={`Cancelled: ${((s.cancelledOrders / s.totalOrders) * 100).toFixed(1)}%`} style={{ width: `${(s.cancelledOrders / s.totalOrders) * 100}%`, background: '#ef4444' }} />
              </>
            )}
          </div>

          {/* Completion Ring + Rate */}
          <div className="s-status-completion">
            <div className="s-status-completion-ring">
              <svg viewBox="0 0 120 120" className="s-status-ring-svg">
                <circle cx="60" cy="60" r="52" className="s-status-ring-bg" />
                <circle
                  cx="60" cy="60" r="52"
                  className="s-status-ring-fill"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 52}`,
                    strokeDashoffset: `${2 * Math.PI * 52 * (1 - (s.deliveredOrders / (s.totalOrders || 1)))}`,
                  }}
                />
              </svg>
              <div className="s-status-ring-center">
                <span className="s-status-ring-pct">
                  {s.totalOrders > 0 ? ((s.deliveredOrders / s.totalOrders) * 100).toFixed(0) : 0}%
                </span>
                <span className="s-status-ring-label">Delivered</span>
              </div>
            </div>
            <div className="s-status-completion-info">
              <h3>Fulfillment Rate</h3>
              <p>
                <strong>{s.deliveredOrders}</strong> of <strong>{s.totalOrders}</strong> orders delivered successfully
              </p>
              <div className="s-status-completion-metrics">
                <div className="s-status-metric-badge">
                  <FaCheckCircle className="s-status-metric-icon success" />
                  <span>{((s.deliveredOrders / (s.totalOrders || 1)) * 100).toFixed(1)}% delivery rate</span>
                </div>
                <div className="s-status-metric-badge">
                  <FaTimesCircle className="s-status-metric-icon danger" />
                  <span>{((s.cancelledOrders / (s.totalOrders || 1)) * 100).toFixed(1)}% cancellation rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      {s.topProducts.length > 0 && (
        <div className="s-card">
          <div className="s-card-header">
            <div className="s-card-header-left">
              <FaBox className="s-card-icon" />
              <h2>Top Selling Products</h2>
            </div>
          </div>
          <div className="s-top-products-body">
            {s.topProducts.map((product: TopProduct) => (
              <div key={product.id} className="s-top-product-item">
                <div className="s-top-product-img">
                  {product.thumbnail ? (
                    <img src={`http://localhost:5000/uploads/products/${product.thumbnail}`} alt={product.name} />
                  ) : (
                    <FaBox />
                  )}
                </div>
                <div className="s-top-product-info">
                  <span className="s-top-product-name">{product.name}</span>
                  <span className="s-top-product-meta">{product.totalSold} sold · {formatCurrency(product.revenue)}</span>
                </div>
                <div className="s-top-product-stock">
                  <span className={product.stock <= 5 ? "s-stock-low" : "s-stock-ok"}>
                    {product.stock} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="s-recent-orders-card">
        <div className="s-card-header">
          <div className="s-card-header-left">
            <FaShoppingCart className="s-card-icon" />
            <h2>Recent Orders</h2>
          </div>
          <Link to="/seller/orders" className="s-card-link">View All <FaArrowRight /></Link>
        </div>
        <div className="s-card-body">
          {s.recentOrders.length === 0 ? (
            <div className="s-empty-state">
              <FaShoppingCart className="s-empty-icon" />
              <p>No orders for your products yet.</p>
            </div>
          ) : (
            <div className="s-table-wrapper">
              <table className="s-table">
                <thead>
                  <tr>
                    <th>Order</th><th>Customer</th><th>Product</th><th>Qty</th><th>Status</th><th>Amount</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {s.recentOrders.map((order) => {
                    const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["PENDING"];
                    return (
                      <tr key={order.id}>
                        <td><span className="s-order-number">{order.orderNumber}</span></td>
                        <td>
                          <div className="s-customer-info">
                            <div className="s-customer-avatar">{order.customerName.charAt(0)}</div>
                            <div className="s-customer-details">
                              <span className="s-customer-name">{order.customerName}</span>
                              <span className="s-customer-email">{order.customerEmail}</span>
                            </div>
                          </div>
                        </td>
                        <td><span className="s-product-name">{order.productName}</span></td>
                        <td><span className="s-quantity">{order.quantity}</span></td>
                        <td><span className={`s-badge ${statusCfg.className}`}>{statusCfg.label}</span></td>
                        <td><span className="s-amount">{formatCurrency(order.totalAmount)}</span></td>
                        <td><span className="s-date">{formatDate(order.createdAt)}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
