import { useState } from "react";
import { FaBell, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

interface Notification {
  id: number;
  type: "info" | "success" | "warning" | "error";
  message: string;
  time: string;
}

const defaultNotifications: Notification[] = [
  {
    id: 1,
    type: "info",
    message: "Welcome to your new dashboard! Explore your orders and wishlist.",
    time: "Just now",
  },
  {
    id: 2,
    type: "success",
    message: "Your E-Max account is fully set up and ready to use.",
    time: "2 hours ago",
  },
  {
    id: 3,
    type: "warning",
    message: "Complete your profile to unlock personalized recommendations.",
    time: "1 day ago",
  },
];

const iconMap = {
  info: FaInfoCircle,
  success: FaCheckCircle,
  warning: FaExclamationTriangle,
  error: FaTimesCircle,
};

const Notifications = () => {
  const [notifications] = useState<Notification[]>(defaultNotifications);

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

      {notifications.length === 0 ? (
        <div className="card-empty">
          <FaBell className="empty-icon" />
          <p>No new notifications</p>
        </div>
      ) : (
        notifications.map((n) => {
          const Icon = iconMap[n.type];
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

