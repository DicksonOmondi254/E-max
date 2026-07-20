import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaTags,
  FaTrademark,
  FaUsers,
  FaStar,
  FaShoppingBag,
  FaMoneyBillWave,
  FaPlus,
  FaList,
  FaStore,
  FaComment,
  FaTachometerAlt,
  FaArrowRight,
  FaClipboardList,
  FaUserFriends,
  FaCog,
} from "react-icons/fa";

import { dashboardService } from "../../services/dashboardService";
import type { DashboardStats, RecentOrder } from "../../services/dashboardService";
import "./Dashboard.css";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "badge-order-pending" },
  PROCESSING: { label: "Processing", className: "badge-order-processing" },
  SHIPPED: { label: "Shipped", className: "badge-order-shipped" },
  DELIVERED: { label: "Delivered", className: "badge-order-delivered" },
  CANCELLED: { label: "Cancelled", className: "badge-order-cancelled" },
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getDashboard();
      setStats(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalOrders = stats?.orders ?? 0;
  const pendingOrders = stats?.pendingOrders ?? 0;
  const revenue = stats?.revenue ?? 0;
  const recentOrders = stats?.recentOrders ?? [];

  // ─────────────────────────────────────────────
  // Loading Skeleton
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="dashboard-welcome-skeleton">
          <div className="skeleton-line skeleton-line--title" />
          <div className="skeleton-line skeleton-line--subtitle" />
        </div>
        <div className="dashboard-stats-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-line skeleton-line--stat" />
          ))}
        </div>
        <div className="dashboard-bottom-grid">
          <div className="skeleton-line skeleton-line--table" />
          <div className="skeleton-line skeleton-line--actions-card" />
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Error State
  // ─────────────────────────────────────────────
  if (error) {
    return (
      <div className="admin-dashboard-page">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Failed to Load Dashboard</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={loadDashboard}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Main Dashboard Content
  // ─────────────────────────────────────────────
  return (
    <div className="admin-dashboard-page">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-content">
          <div className="welcome-icon">
            <FaTachometerAlt />
          </div>
          <div className="welcome-text">
            <h1>Admin Dashboard</h1>
            <p>
              Welcome back! Here's what's happening with your store today.
              You have <strong>{pendingOrders} pending order{pendingOrders !== 1 ? "s" : ""}</strong> and{" "}
              <strong>{stats?.products ?? 0} products</strong> in your catalog.
            </p>
          </div>
        </div>
        <div className="welcome-quick-stats">
          <div className="quick-stat-badge">
            <FaShoppingBag />
            <span>{totalOrders} Orders</span>
          </div>
          <div className="quick-stat-badge">
            <FaMoneyBillWave />
            <span>KES {revenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card dashboard-stat-card--products">
          <div className="dashboard-stat-icon">
            <FaBox />
          </div>
          <div className="dashboard-stat-info">
            <span className="dashboard-stat-value">{stats?.products ?? 0}</span>
            <span className="dashboard-stat-label">Total Products</span>
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-card--categories">
          <div className="dashboard-stat-icon">
            <FaTags />
          </div>
          <div className="dashboard-stat-info">
            <span className="dashboard-stat-value">{stats?.categories ?? 0}</span>
            <span className="dashboard-stat-label">Categories</span>
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-card--brands">
          <div className="dashboard-stat-icon">
            <FaTrademark />
          </div>
          <div className="dashboard-stat-info">
            <span className="dashboard-stat-value">{stats?.brands ?? 0}</span>
            <span className="dashboard-stat-label">Brands</span>
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-card--customers">
          <div className="dashboard-stat-icon">
            <FaUsers />
          </div>
          <div className="dashboard-stat-info">
            <span className="dashboard-stat-value">{stats?.customers ?? 0}</span>
            <span className="dashboard-stat-label">Customers</span>
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-card--featured">
          <div className="dashboard-stat-icon">
            <FaStar />
          </div>
          <div className="dashboard-stat-info">
            <span className="dashboard-stat-value">{stats?.featuredProducts ?? 0}</span>
            <span className="dashboard-stat-label">Featured Products</span>
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-card--reviews">
          <div className="dashboard-stat-icon">
            <FaComment />
          </div>
          <div className="dashboard-stat-info">
            <span className="dashboard-stat-value">{stats?.reviews ?? 0}</span>
            <span className="dashboard-stat-label">Reviews</span>
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-card--orders">
          <div className="dashboard-stat-icon">
            <FaShoppingBag />
          </div>
          <div className="dashboard-stat-info">
            <span className="dashboard-stat-value">{totalOrders}</span>
            <span className="dashboard-stat-label">Total Orders</span>
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-card--revenue">
          <div className="dashboard-stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="dashboard-stat-info">
            <span className="dashboard-stat-value">KES {revenue.toLocaleString()}</span>
            <span className="dashboard-stat-label">Revenue (excl. cancelled)</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Orders + Quick Actions */}
      <div className="dashboard-bottom-grid">
        {/* Recent Orders */}
        <div className="dashboard-card dashboard-recent-orders">
          <div className="dashboard-card-header">
            <div className="card-header-left">
              <FaClipboardList className="card-header-icon" />
              <h2>Recent Orders</h2>
            </div>
            <Link to="/admin/orders" className="card-header-link">
              View All <FaArrowRight />
            </Link>
          </div>

          <div className="dashboard-card-body">
            {recentOrders.length === 0 ? (
              <div className="dashboard-empty">
                <FaShoppingBag className="dashboard-empty-icon" />
                <p>No orders yet.</p>
              </div>
            ) : (
              <div className="recent-orders-table-wrapper">
                <table className="recent-orders-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order: RecentOrder) => {
                      const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["PENDING"];
                      return (
                        <tr key={order.id}>
                          <td>
                            <span className="recent-order-number">{order.orderNumber}</span>
                          </td>
                          <td>
                            <div className="recent-customer-info">
                              <div className="recent-customer-avatar">
                                {order.customerName.charAt(0)}
                              </div>
                              <div className="recent-customer-details">
                                <span className="recent-customer-name">{order.customerName}</span>
                                <span className="recent-customer-email">{order.customerEmail}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="recent-product-name">{order.productName}</span>
                          </td>
                          <td>
                            <span className={`badge ${statusCfg.className}`}>
                              {statusCfg.label}
                            </span>
                          </td>
                          <td>
                            <span className="recent-order-amount">
                              KES {Number(order.totalAmount).toLocaleString()}
                            </span>
                          </td>
                          <td>
                            <span className="recent-order-date">{formatDate(order.createdAt)}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card dashboard-quick-actions">
          <div className="dashboard-card-header">
            <div className="card-header-left">
              <FaCog className="card-header-icon" />
              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="dashboard-card-body">
            <div className="quick-actions-grid">
              <Link to="/admin/products/new" className="quick-action-card">
                <div className="quick-action-icon quick-action-icon--add">
                  <FaPlus />
                </div>
                <div className="quick-action-text">
                  <span className="quick-action-title">Add Product</span>
                  <span className="quick-action-desc">Create a new product listing</span>
                </div>
                <FaArrowRight className="quick-action-arrow" />
              </Link>

              <Link to="/admin/products" className="quick-action-card">
                <div className="quick-action-icon quick-action-icon--view">
                  <FaList />
                </div>
                <div className="quick-action-text">
                  <span className="quick-action-title">Manage Products</span>
                  <span className="quick-action-desc">View and edit all products</span>
                </div>
                <FaArrowRight className="quick-action-arrow" />
              </Link>

              <Link to="/admin/orders" className="quick-action-card">
                <div className="quick-action-icon quick-action-icon--orders">
                  <FaShoppingBag />
                </div>
                <div className="quick-action-text">
                  <span className="quick-action-title">View Orders</span>
                  <span className="quick-action-desc">{pendingOrders} pending order{pendingOrders !== 1 ? "s" : ""} need attention</span>
                </div>
                <FaArrowRight className="quick-action-arrow" />
              </Link>

              <Link to="/admin/customers" className="quick-action-card">
                <div className="quick-action-icon quick-action-icon--customers">
                  <FaUserFriends />
                </div>
                <div className="quick-action-text">
                  <span className="quick-action-title">Manage Customers</span>
                  <span className="quick-action-desc">{stats?.customers ?? 0} registered customers</span>
                </div>
                <FaArrowRight className="quick-action-arrow" />
              </Link>

              <Link to="/admin/categories" className="quick-action-card">
                <div className="quick-action-icon quick-action-icon--categories">
                  <FaTags />
                </div>
                <div className="quick-action-text">
                  <span className="quick-action-title">Categories</span>
                  <span className="quick-action-desc">{stats?.categories ?? 0} product categories</span>
                </div>
                <FaArrowRight className="quick-action-arrow" />
              </Link>

              <Link to="/admin/brands" className="quick-action-card">
                <div className="quick-action-icon quick-action-icon--brands">
                  <FaStore />
                </div>
                <div className="quick-action-text">
                  <span className="quick-action-title">Brands</span>
                  <span className="quick-action-desc">{stats?.brands ?? 0} brands in catalog</span>
                </div>
                <FaArrowRight className="quick-action-arrow" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
