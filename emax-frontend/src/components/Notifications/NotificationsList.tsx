import "./NotificationsList.css";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaCheckDouble,
  FaSpinner,
} from "react-icons/fa";
import { notificationService, type NotificationData } from "../../services/notificationService";
import { useAppSelector } from "../../redux/hooks";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  INFO: <FaInfoCircle />,
  SUCCESS: <FaCheckCircle />,
  WARNING: <FaExclamationTriangle />,
  ERROR: <FaTimesCircle />,
};

const TYPE_COLORS: Record<string, string> = {
  INFO: "#3b82f6",
  SUCCESS: "#10b981",
  WARNING: "#f59e0b",
  ERROR: "#ef4444",
};

const NotificationsList = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.auth.user);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Poll every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
      );
    } catch {
      // silently fail
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
    } catch {
      // silently fail
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <div className="notification-dropdown-wrapper" ref={dropdownRef}>
      <button
        className="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
                <FaCheckDouble /> Mark all read
              </button>
            )}
          </div>

          <div className="notification-dropdown-body">
            {loading ? (
              <div className="notification-loading">
                <FaSpinner className="spin" /> Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <FaBell />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <div
                  key={n.id}
                  className={`notification-dropdown-item ${!n.isRead ? "unread" : ""}`}
                  onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                >
                  <div
                    className="notification-item-icon"
                    style={{ color: TYPE_COLORS[n.type] || TYPE_COLORS.INFO }}
                  >
                    {TYPE_ICONS[n.type] || TYPE_ICONS.INFO}
                  </div>
                  <div className="notification-item-content">
                    <div className="notification-item-title">{n.title}</div>
                    <p className="notification-item-message">{n.message}</p>
                    <span className="notification-item-time">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                  {!n.isRead && <span className="notification-unread-dot" />}
                </div>
              ))
            )}
          </div>

          <div className="notification-dropdown-footer">
            {isAdmin ? (
              <Link to="/admin/notifications" onClick={() => setIsOpen(false)}>
                View All Notifications
              </Link>
            ) : (
              <Link to="/dashboard/settings" onClick={() => setIsOpen(false)}>
                Notification Settings
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
