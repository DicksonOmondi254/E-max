import { useEffect, useMemo, useState, useCallback } from "react";
import {
  FaShoppingCart, FaSearch, FaEye, FaTimes,
  FaCheckCircle, FaHourglassHalf, FaBoxOpen, FaBan, FaPrint,
  FaTruck, FaUser, FaMoneyBillWave,
} from "react-icons/fa";
import { sellerService } from "../../services/sellerService";
import type { SellerOrder, SellerOrderItem } from "../../services/sellerService";

const PAGE_SIZE = 12;

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "s-badge-pending" },
  PROCESSING: { label: "Processing", className: "s-badge-processing" },
  SHIPPED: { label: "Shipped", className: "s-badge-shipped" },
  DELIVERED: { label: "Delivered", className: "s-badge-delivered" },
  CANCELLED: { label: "Cancelled", className: "s-badge-cancelled" },
};

const ORDER_STATUSES = ["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;

const SellerOrders = () => {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (toast) { const timer = setTimeout(() => setToast(null), 4000); return () => clearTimeout(timer); }
  }, [toast]);

  const showToast = (type: "success" | "error", message: string) => setToast({ type, message });

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await sellerService.getOrders({
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        search: debouncedSearch || undefined,
        page, limit: PAGE_SIZE,
      });
      setOrders(result.data);
    } catch (err: any) {
      setError(err?.message || "Failed to load orders.");
    } finally { setLoading(false); }
  }, [debouncedSearch, statusFilter, page]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "PENDING").length;
    const processing = orders.filter((o) => o.status === "PROCESSING").length;
    const shipped = orders.filter((o) => o.status === "SHIPPED").length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;
    const cancelled = orders.filter((o) => o.status === "CANCELLED").length;
    const revenue = orders.filter((o) => o.status !== "CANCELLED").reduce((sum, o) => sum + o.totalAmount, 0);
    return { total, pending, processing, shipped, delivered, cancelled, revenue };
  }, [orders]);

  const filtered = useMemo(() => {
    let result = [...orders];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, debouncedSearch]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      setActionLoading(orderId);
      await sellerService.updateOrderStatus(orderId, newStatus);
      showToast("success", `Order status updated.`);
      loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update status.");
    } finally { setActionLoading(null); }
  };

  return (
    <div className="seller-page">
      {toast && (
        <div className={`s-toast s-toast--${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          <span>{toast.message}</span>
          <button className="s-toast-close" onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      <div className="s-page-header">
        <div>
          <h1><FaShoppingCart className="s-page-icon" /> Orders</h1>
          <p className="s-page-subtitle">Manage orders containing your products</p>
        </div>
      </div>

      <div className="s-stats-grid">
        <div className="s-stat-card s-stat-card--total">
          <div className="s-stat-icon"><FaShoppingCart /></div>
          <div className="s-stat-info">
            <span className="s-stat-value">{stats.total}</span>
            <span className="s-stat-label">Total</span>
          </div>
        </div>
        <div className="s-stat-card s-stat-card--pending">
          <div className="s-stat-icon"><FaHourglassHalf /></div>
          <div className="s-stat-info">
            <span className="s-stat-value">{stats.pending}</span>
            <span className="s-stat-label">Pending</span>
          </div>
        </div>
        <div className="s-stat-card s-stat-card--processing">
          <div className="s-stat-icon"><FaBoxOpen /></div>
          <div className="s-stat-info">
            <span className="s-stat-value">{stats.processing}</span>
            <span className="s-stat-label">Processing</span>
          </div>
        </div>
        <div className="s-stat-card s-stat-card--shipped">
          <div className="s-stat-icon"><FaTruck /></div>
          <div className="s-stat-info">
            <span className="s-stat-value">{stats.shipped}</span>
            <span className="s-stat-label">Shipped</span>
          </div>
        </div>
        <div className="s-stat-card s-stat-card--delivered">
          <div className="s-stat-icon"><FaCheckCircle /></div>
          <div className="s-stat-info">
            <span className="s-stat-value">{stats.delivered}</span>
            <span className="s-stat-label">Delivered</span>
          </div>
        </div>
        <div className="s-stat-card s-stat-card--cancelled">
          <div className="s-stat-icon"><FaBan /></div>
          <div className="s-stat-info">
            <span className="s-stat-value">{stats.cancelled}</span>
            <span className="s-stat-label">Cancelled</span>
          </div>
        </div>
      </div>

      <div className="s-toolbar">
        <div className="s-search-wrapper">
          <FaSearch className="s-search-icon" />
          <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="s-search-input" />
          {search && <button className="s-search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="s-filter-select">
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s === "ALL" ? "All Status" : s}</option>)}
        </select>
      </div>

      {error && <div className="s-alert s-alert-danger">⚠️ {error} <button onClick={loadOrders}>Retry</button></div>}

      <div className="s-table-wrapper">
        <table className="s-table s-table-full">
          <thead>
            <tr>
              <th>Order</th><th>Customer</th><th>Items</th><th>Status</th><th>Amount</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={7}><div className="s-loading-row">Loading...</div></td></tr>
              ))
            ) : paginated.length === 0 ? (
              <tr><td colSpan={7}><div className="s-empty-state"><FaShoppingCart className="s-empty-icon" /><p>No orders found</p></div></td></tr>
            ) : (
              paginated.map((order) => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["PENDING"];
                const rowStatusClass = `s-table-row-${order.status.toLowerCase()}`;
                return (
                  <tr key={order.id} className={rowStatusClass}>
                    <td><span className="s-order-number">{order.orderNumber}</span></td>
                    <td>
                      <div className="s-customer-info">
                        <div className="s-customer-avatar">{order.customerName?.charAt(0) || "?"}</div>
                        <div className="s-customer-details">
                          <span className="s-customer-name">{order.customerName}</span>
                          <span className="s-customer-email">{order.customerEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="s-quantity">{order.items?.length || 0} items</span></td>
                    <td><span className={`s-badge ${cfg.className}`}>{cfg.label}</span></td>
                    <td><span className="s-amount">{formatCurrency(order.totalAmount)}</span></td>
                    <td><span className="s-date">{new Date(order.createdAt).toLocaleDateString()}</span></td>
                    <td>
                      <div className="s-action-btns">
                        <button className="s-action-btn s-action-view" title="View Details" onClick={() => setSelectedOrder(order)}><FaEye /></button>
                        {order.status === "PENDING" && (
                          <button className="s-action-btn s-action-ship" title="Mark Processing" onClick={() => handleUpdateStatus(order.id, "PROCESSING")} disabled={actionLoading === order.id}>
                            <FaBoxOpen />
                          </button>
                        )}
                        {order.status === "PROCESSING" && (
                          <button className="s-action-btn s-action-ship" title="Mark Shipped" onClick={() => handleUpdateStatus(order.id, "SHIPPED")} disabled={actionLoading === order.id}>
                            <FaTruck />
                          </button>
                        )}
                        {order.status === "SHIPPED" && (
                          <button className="s-action-btn s-action-deliver" title="Mark Delivered" onClick={() => handleUpdateStatus(order.id, "DELIVERED")} disabled={actionLoading === order.id}>
                            <FaCheckCircle />
                          </button>
                        )}
                        <button className="s-action-btn s-action-print" title="Print Invoice" onClick={() => window.print()}><FaPrint /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="s-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="s-modal" onClick={(e) => e.stopPropagation()}>
            <div className="s-modal-header">
              <h2>Order {selectedOrder.orderNumber}</h2>
              <button className="s-modal-close" onClick={() => setSelectedOrder(null)}><FaTimes /></button>
            </div>
            <div className="s-modal-body">
              <div className="s-detail-section s-detail-customer">
                <h3><FaUser /> Customer</h3>
                <p>{selectedOrder.customerName} · {selectedOrder.customerEmail} · {selectedOrder.customerPhone || "N/A"}</p>
              </div>
              <div className="s-detail-section s-detail-items">
                <h3><FaShoppingCart /> Items</h3>
                {selectedOrder.items?.map((item: SellerOrderItem) => (
                  <div key={item.id} className="s-order-item-row">
                    <span>{item.productName} × {item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="s-detail-section s-detail-total">
                <h3><FaMoneyBillWave /> Total: {formatCurrency(selectedOrder.totalAmount)}</h3>
              </div>
              <div className="s-detail-section s-detail-status">
                <h3><FaCheckCircle /> Update Status</h3>
                <div className="s-status-actions">
                  {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                    <button key={s} className={`s-status-btn ${selectedOrder.status === s ? "active" : ""}`}
                      onClick={() => handleUpdateStatus(selectedOrder.id, s)} disabled={selectedOrder.status === s || actionLoading === selectedOrder.id}>
                      {s}
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

export default SellerOrders;
