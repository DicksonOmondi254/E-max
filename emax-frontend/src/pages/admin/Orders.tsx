import { useEffect, useMemo, useState, useCallback } from "react";
import {
  FaShoppingBag,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaTimes,
  FaTrash,
  FaCheckCircle,
  FaHourglassHalf,
  FaShippingFast,
  FaBoxOpen,
  FaBan,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMoneyBillWave,
} from "react-icons/fa";

import { orderService } from "../../services/orderService";
import type { Order, OrderItem } from "../../services/orderService";

type SortField = "orderNumber" | "status" | "paymentStatus" | "totalAmount" | "createdAt" | "user";
type SortOrder = "asc" | "desc";

const PAGE_SIZE = 12;

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  PENDING: { label: "Pending", className: "badge-order-pending", icon: <FaHourglassHalf /> },
  PROCESSING: { label: "Processing", className: "badge-order-processing", icon: <FaBoxOpen /> },
  SHIPPED: { label: "Shipped", className: "badge-order-shipped", icon: <FaShippingFast /> },
  DELIVERED: { label: "Delivered", className: "badge-order-delivered", icon: <FaCheckCircle /> },
  CANCELLED: { label: "Cancelled", className: "badge-order-cancelled", icon: <FaBan /> },
};

const PAYMENT_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "badge-payment-pending" },
  PAID: { label: "Paid", className: "badge-payment-paid" },
  FAILED: { label: "Failed", className: "badge-payment-failed" },
  REFUNDED: { label: "Refunded", className: "badge-payment-refunded" },
};

const ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateFull = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [statusDropdown, setStatusDropdown] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Success/error toast state
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await orderService.getAllOrders();
      setOrders(result.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Compute stats
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "PENDING").length;
    const processing = orders.filter((o) => o.status === "PROCESSING").length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;
    const cancelled = orders.filter((o) => o.status === "CANCELLED").length;
    const revenue = orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    return { total, pending, processing, delivered, cancelled, revenue };
  }, [orders]);

  // Filter & Sort
  const filtered = useMemo(() => {
    let result = [...orders];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((o) => {
        const orderNum = o.orderNumber.toLowerCase();
        const name = `${o.user?.firstName ?? ""} ${o.user?.lastName ?? ""}`.toLowerCase();
        const email = (o.user?.email ?? "").toLowerCase();
        return orderNum.includes(q) || name.includes(q) || email.includes(q);
      });
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "orderNumber":
          cmp = a.orderNumber.localeCompare(b.orderNumber);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        case "paymentStatus":
          cmp = a.paymentStatus.localeCompare(b.paymentStatus);
          break;
        case "totalAmount":
          cmp = a.totalAmount - b.totalAmount;
          break;
        case "createdAt":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "user":
          cmp = `${a.user?.firstName ?? ""} ${a.user?.lastName ?? ""}`.localeCompare(
            `${b.user?.firstName ?? ""} ${b.user?.lastName ?? ""}`
          );
          break;
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  }, [orders, debouncedSearch, sortBy, sortOrder]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) return <FaSort className="sort-icon" />;
    return sortOrder === "asc" ? <FaSortUp className="sort-icon active" /> : <FaSortDown className="sort-icon active" />;
  };

  // Actions
  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      setActionLoading(orderId);
      await orderService.updateOrderStatus(orderId, newStatus);
      showToast("success", `Order status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}.`);
      loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as Order["status"] } : null));
      }
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update status.");
    } finally {
      setActionLoading(null);
      setStatusDropdown(null);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      setActionLoading(orderId);
      await orderService.cancelOrder(orderId);
      showToast("success", "Order cancelled successfully.");
      loadOrders();
    } catch (err: any) {
      showToast("error", err?.message || "Failed to cancel order.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    try {
      setActionLoading(orderId);
      await orderService.deleteOrder(orderId);
      showToast("success", "Order deleted successfully.");
      setDeleteConfirm(null);
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
      loadOrders();
    } catch (err: any) {
      showToast("error", err?.message || "Failed to delete order.");
    } finally {
      setActionLoading(null);
    }
  };

  const canCancel = (status: string) => !["DELIVERED", "CANCELLED"].includes(status);

  return (
    <div className="admin-page orders-page">
      {/* Toast Notification */}
      {toast && (
        <div className={`orders-toast orders-toast--${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          <span>{toast.message}</span>
          <button className="orders-toast-close" onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <FaShoppingBag className="page-header-icon" />
            Orders
          </h1>
          <p className="page-subtitle">
            {loading ? "Loading orders..." : `Manage ${orders.length} customer order${orders.length !== 1 ? "s" : ""}.`}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="orders-stats-grid">
        <div className="orders-stat-card orders-stat-card--total">
          <div className="orders-stat-icon">
            <FaShoppingBag />
          </div>
          <div className="orders-stat-info">
            <span className="orders-stat-value">{stats.total}</span>
            <span className="orders-stat-label">Total Orders</span>
          </div>
        </div>
        <div className="orders-stat-card orders-stat-card--pending">
          <div className="orders-stat-icon">
            <FaHourglassHalf />
          </div>
          <div className="orders-stat-info">
            <span className="orders-stat-value">{stats.pending}</span>
            <span className="orders-stat-label">Pending</span>
          </div>
        </div>
        <div className="orders-stat-card orders-stat-card--processing">
          <div className="orders-stat-icon">
            <FaBoxOpen />
          </div>
          <div className="orders-stat-info">
            <span className="orders-stat-value">{stats.processing}</span>
            <span className="orders-stat-label">Processing</span>
          </div>
        </div>
        <div className="orders-stat-card orders-stat-card--delivered">
          <div className="orders-stat-icon">
            <FaCheckCircle />
          </div>
          <div className="orders-stat-info">
            <span className="orders-stat-value">{stats.delivered}</span>
            <span className="orders-stat-label">Delivered</span>
          </div>
        </div>
        <div className="orders-stat-card orders-stat-card--cancelled">
          <div className="orders-stat-icon">
            <FaBan />
          </div>
          <div className="orders-stat-info">
            <span className="orders-stat-value">{stats.cancelled}</span>
            <span className="orders-stat-label">Cancelled</span>
          </div>
        </div>
        <div className="orders-stat-card orders-stat-card--revenue">
          <div className="orders-stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="orders-stat-info">
            <span className="orders-stat-value">KES {stats.revenue.toLocaleString()}</span>
            <span className="orders-stat-label">Revenue (excl. cancelled)</span>
          </div>
        </div>
      </div>

      {/* Search & Toolbar */}
      <div className="table-toolbar">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by order number, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>
        <span className="toolbar-info">
          {loading ? "Loading..." : `${filtered.length} order${filtered.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Error State */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
          <button className="alert-retry" onClick={loadOrders}>Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table className="admin-table orders-table">
          <thead>
            <tr>
              <th className="th-order" onClick={() => handleSort("orderNumber")}>
                Order {getSortIcon("orderNumber")}
              </th>
              <th className="th-customer" onClick={() => handleSort("user")}>
                Customer {getSortIcon("user")}
              </th>
              <th className="th-status" onClick={() => handleSort("status")}>
                Status {getSortIcon("status")}
              </th>
              <th className="th-payment" onClick={() => handleSort("paymentStatus")}>
                Payment {getSortIcon("paymentStatus")}
              </th>
              <th className="th-items">Items</th>
              <th className="th-total" onClick={() => handleSort("totalAmount")}>
                Total {getSortIcon("totalAmount")}
              </th>
              <th className="th-date" onClick={() => handleSort("createdAt")}>
                Date {getSortIcon("createdAt")}
              </th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={`skel-${idx}`} className="skeleton-row">
                  <td><div className="skeleton-cell skeleton-cell--order" /></td>
                  <td><div className="skeleton-cell skeleton-cell--customer" /></td>
                  <td><div className="skeleton-cell skeleton-cell--badge" /></td>
                  <td><div className="skeleton-cell skeleton-cell--badge" /></td>
                  <td><div className="skeleton-cell skeleton-cell--num" /></td>
                  <td><div className="skeleton-cell skeleton-cell--amount" /></td>
                  <td><div className="skeleton-cell skeleton-cell--date" /></td>
                  <td><div className="skeleton-cell skeleton-cell--actions" /></td>
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={8}>
                  <div className="empty-state">
                    <FaShoppingBag className="empty-icon" />
                    <h3>No orders found</h3>
                    <p>
                      {debouncedSearch
                        ? `No orders matching "${debouncedSearch}".`
                        : "No orders have been placed yet."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((order) => {
                const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["PENDING"];
                const paymentCfg = PAYMENT_CONFIG[order.paymentStatus] || PAYMENT_CONFIG["PENDING"];
                const totalItems = order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

                return (
                  <tr
                    key={order.id}
                    className={`order-row ${selectedOrder?.id === order.id ? "selected" : ""}`}
                  >
                    {/* Order Number */}
                    <td className="td-order">
                      <span
                        className="order-number-link"
                        onClick={() => setSelectedOrder(order)}
                        title="View details"
                      >
                        {order.orderNumber}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="td-customer">
                      <div className="customer-info-cell">
                        <div className="customer-avatar-sm">
                          {(order.user?.firstName?.charAt(0) ?? "?")}
                          {(order.user?.lastName?.charAt(0) ?? "")}
                        </div>
                        <div className="customer-details-sm">
                          <span className="customer-name-sm">
                            {order.user?.firstName ?? ""} {order.user?.lastName ?? ""}
                          </span>
                          <span className="customer-email-sm">{order.user?.email ?? ""}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="td-status">
                      <span className={`badge ${statusCfg.className}`}>
                        {statusCfg.icon}
                        {statusCfg.label}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="td-payment">
                      <span className={`badge ${paymentCfg.className}`}>
                        {paymentCfg.label}
                      </span>
                    </td>

                    {/* Items Count */}
                    <td className="td-items">
                      <span className="items-count">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
                    </td>

                    {/* Total */}
                    <td className="td-total">
                      <span className="order-amount">KES {Number(order.totalAmount).toLocaleString()}</span>
                    </td>

                    {/* Date */}
                    <td className="td-date">
                      <span className="date-text">{formatDate(order.createdAt)}</span>
                    </td>

                    {/* Actions */}
                    <td className="td-actions">
                      <div className="order-actions-group">
                        <button
                          className="order-action-btn order-action-btn--view"
                          title="View Details"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <FaEye />
                        </button>

                        {/* Status Update Dropdown */}
                        <div className="order-status-dropdown-wrapper">
                          <button
                            className="order-action-btn order-action-btn--status"
                            title="Update Status"
                            onClick={() => setStatusDropdown(statusDropdown === order.id ? null : order.id)}
                            disabled={actionLoading === order.id}
                          >
                            {actionLoading === order.id ? "..." : <FaCheckCircle />}
                          </button>
                          {statusDropdown === order.id && (
                            <div className="order-status-dropdown-menu">
                              {ORDER_STATUSES.map((s) => (
                                <button
                                  key={s}
                                  className={`order-status-option ${order.status === s ? "active" : ""}`}
                                  onClick={() => handleUpdateStatus(order.id, s)}
                                  disabled={order.status === s}
                                >
                                  {STATUS_CONFIG[s]?.icon}
                                  {STATUS_CONFIG[s]?.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Cancel Button */}
                        {canCancel(order.status) && (
                          <button
                            className="order-action-btn order-action-btn--cancel"
                            title="Cancel Order"
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={actionLoading === order.id}
                          >
                            <FaBan />
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          className="order-action-btn order-action-btn--delete"
                          title="Delete Order"
                          onClick={() => setDeleteConfirm(order.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>

                      {/* Delete Confirm */}
                      {deleteConfirm === order.id && (
                        <div className="order-delete-confirm">
                          <span className="delete-confirm-text">Delete this order?</span>
                          <div className="delete-confirm-actions">
                            <button
                              className="delete-confirm-yes"
                              onClick={() => handleDeleteOrder(order.id)}
                              disabled={actionLoading === order.id}
                            >
                              {actionLoading === order.id ? "..." : "Yes"}
                            </button>
                            <button
                              className="delete-confirm-no"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <FaChevronLeft /> Previous
          </button>

          <div className="pagination-pages">
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, idx) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = idx + 1;
              } else if (page <= 4) {
                pageNum = idx + 1;
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + idx;
              } else {
                pageNum = page - 3 + idx;
              }
              return (
                <button
                  key={pageNum}
                  className={`pagination-page ${page === pageNum ? "active" : ""}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="pagination-btn"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="order-detail-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-detail-header">
              <div className="order-detail-title">
                <h2>Order {selectedOrder.orderNumber}</h2>
                <span className={`badge ${STATUS_CONFIG[selectedOrder.status]?.className}`}>
                  {STATUS_CONFIG[selectedOrder.status]?.icon}
                  {STATUS_CONFIG[selectedOrder.status]?.label}
                </span>
              </div>
              <button className="order-detail-close" onClick={() => setSelectedOrder(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="order-detail-body">
              {/* Customer Info */}
              <div className="order-detail-section">
                <h3 className="order-detail-section-title">
                  <FaUser /> Customer Information
                </h3>
                <div className="order-detail-info-grid">
                  <div className="order-detail-info-item">
                    <FaUser className="info-icon" />
                    <span>{selectedOrder.user?.firstName ?? ""} {selectedOrder.user?.lastName ?? ""}</span>
                  </div>
                  <div className="order-detail-info-item">
                    <FaEnvelope className="info-icon" />
                    <span>{selectedOrder.user?.email ?? "-"}</span>
                  </div>
                  <div className="order-detail-info-item">
                    <FaPhone className="info-icon" />
                    <span>{selectedOrder.user?.phone ?? "-"}</span>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="order-detail-section">
                <h3 className="order-detail-section-title">
                  <FaShoppingBag /> Order Details
                </h3>
                <div className="order-detail-info-grid">
                  <div className="order-detail-info-item">
                    <FaCalendarAlt className="info-icon" />
                    <span>Placed on {formatDateFull(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="order-detail-info-item">
                    <FaMoneyBillWave className="info-icon" />
                    <span>Total: KES {Number(selectedOrder.totalAmount).toLocaleString()}</span>
                  </div>
                  <div className="order-detail-info-item">
                    <span className={`badge ${PAYMENT_CONFIG[selectedOrder.paymentStatus]?.className}`}>
                      Payment: {PAYMENT_CONFIG[selectedOrder.paymentStatus]?.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-detail-section">
                <h3 className="order-detail-section-title">
                  <FaBoxOpen /> Order Items ({selectedOrder.items?.length || 0})
                </h3>
                <div className="order-items-list">
                  {selectedOrder.items?.map((item: OrderItem) => (
                    <div key={item.id} className="order-item-card">
                      <div className="order-item-image">
                        {item.product?.thumbnail ? (
                          <img
                            src={`http://localhost:5000/uploads/products/${item.product.thumbnail}`}
                            alt={item.product.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/48?text=N/A";
                            }}
                          />
                        ) : (
                          <div className="order-item-image-placeholder">
                            <FaBoxOpen />
                          </div>
                        )}
                      </div>
                      <div className="order-item-info">
                        <span className="order-item-name">{item.product?.name || `Product #${item.productId}`}</span>
                        <span className="order-item-meta">
                          Qty: {item.quantity} × KES {Number(item.price).toLocaleString()}
                        </span>
                      </div>
                      <div className="order-item-total">
                        KES {Number(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Inline */}
              <div className="order-detail-section">
                <h3 className="order-detail-section-title">
                  <FaCheckCircle /> Update Status
                </h3>
                <div className="order-detail-status-actions">
                  {ORDER_STATUSES.map((s) => (
                    <button
                      key={s}
                      className={`order-detail-status-btn ${selectedOrder.status === s ? "active" : ""}`}
                      onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                      disabled={selectedOrder.status === s || actionLoading === selectedOrder.id}
                    >
                      {STATUS_CONFIG[s]?.icon}
                      {STATUS_CONFIG[s]?.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

