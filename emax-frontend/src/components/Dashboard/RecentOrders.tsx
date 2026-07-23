import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import { customerDashboardService, type CustomerRecentOrder } from "../../services/dashboardCustomerService";

const RecentOrders = () => {
  const [orders, setOrders] = useState<CustomerRecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await customerDashboardService.getRecentOrders();
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatusClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("delivered")) return "delivered";
    if (s.includes("shipped")) return "shipped";
    if (s.includes("process")) return "processing";
    if (s.includes("cancel")) return "cancelled";
    return "pending";
  };

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div className="card-header-left">
          <FaShoppingBag className="card-icon" />
          <h2>Recent Orders</h2>
        </div>
        {orders.length > 0 && (
          <Link to="/dashboard/orders" className="view-all">
            View All
          </Link>
        )}
      </div>

      {loading ? (
        <div className="card-skeleton">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      ) : orders.length === 0 ? (
        <div className="card-empty">
          <FaShoppingBag className="empty-icon" />
          <p>No orders yet. Start shopping!</p>
          <Link to="/products" className="action-btn action-btn--primary">
            Browse Products
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <div className="order-item" key={order.id}>
            <div className="order-item-left">
              <div className="order-product-icon">
                <FaShoppingBag />
              </div>
              <div className="order-item-info">
                <strong>{order.product}</strong>
                <p>#{order.id}</p>
              </div>
            </div>
            <div className="order-item-right">
              <span className={`status ${getStatusClass(order.status)}`}>
                {order.status}
              </span>
              <h4>KES {order.total.toLocaleString()}</h4>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentOrders;

