import { useEffect, useState } from "react";
import { FaBell, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";
import { customerDashboardService, type CustomerNotification } from "../../services/dashboardCustomerService";

const iconMap = {
  info: FaInfoCircle,
  success: FaCheckCircle,
  warning: FaExclamationTriangle,
  error: FaTimesCircle,
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await customerDashboardService.getNotifications();
        setNotifications(data);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div className="card-header-left">
          <FaBell className="card-icon" />
          <h2>Notifications</h2>
        </div>
        {notifications.length > 0 && (
          <span className="card-badge">{notifications.length}</span>
        )}
      </div>

      {loading ? (
        <div className="card-skeleton">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="card-empty">
          <FaBell className="empty-icon" />
          <p>No new notifications</p>
        </div>
      ) : (
        notifications.map((n) => {
          const Icon = iconMap[n.type] || FaInfoCircle;
          return (
            <div className="notification-item" key={n.id}>
              <div className={`notification-icon ${n.type}`}>
                <Icon />
              </div>
              <div className="notification-content">
                <p>{n.message}</p>
                <p className="notification-time">{n.time}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Notifications;

