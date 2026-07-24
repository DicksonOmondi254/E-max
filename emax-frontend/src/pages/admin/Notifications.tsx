import { useEffect, useState } from "react";
import {
  FaBell,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaTrash,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";
import { notificationService, type NotificationData } from "../../services/notificationService";

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

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"INFO" | "WARNING" | "SUCCESS" | "ERROR">("INFO");
  const [target, setTarget] = useState<"ALL" | "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN">("ALL");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    try {
      setSubmitting(true);
      await notificationService.create({
        title: title.trim(),
        message: message.trim(),
        type,
        target,
      });
      setTitle("");
      setMessage("");
      setType("INFO");
      setTarget("ALL");
      setShowForm(false);
      await loadNotifications();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create notification");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await notificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete notification");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTargetLabel = (target: string) => {
    const labels: Record<string, string> = {
      ALL: "All Users",
      CUSTOMER: "Customers",
      SELLER: "Sellers",
      ADMIN: "Admins",
      SUPER_ADMIN: "Super Admins",
    };
    return labels[target] || target;
  };

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <FaBell className="page-header-icon" />
            Notifications
          </h1>
          <p className="page-subtitle">
            Create and manage notifications sent to users
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Create Notification"}
        </button>
      </div>

      {/* Create Notification Form */}
      {showForm && (
        <div className="notification-form-card">
          <h3>Send New Notification</h3>
          <form onSubmit={handleSubmit} className="notification-form">
            <div className="form-group">
              <label className="form-label">
                Title <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., New Sale Announcement"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Message <span className="required">*</span>
              </label>
              <textarea
                className="form-input form-textarea"
                placeholder="Write your notification message..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  className="form-input"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="INFO">Info</option>
                  <option value="SUCCESS">Success</option>
                  <option value="WARNING">Warning</option>
                  <option value="ERROR">Error</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <select
                  className="form-input"
                  value={target}
                  onChange={(e) => setTarget(e.target.value as any)}
                >
                  <option value="ALL">All Users</option>
                  <option value="CUSTOMER">Customers Only</option>
                  <option value="SELLER">Sellers Only</option>
                  <option value="ADMIN">Admins Only</option>
                  <option value="SUPER_ADMIN">Super Admins Only</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || !title.trim() || !message.trim()}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="spin" /> Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane /> Send Notification
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications List */}
      {loading ? (
        <div className="notifications-skeleton">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-line skeleton-line--stat" />
          ))}
        </div>
      ) : error ? (
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Failed to Load Notifications</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={loadNotifications}>
              Retry
            </button>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <FaBell className="empty-icon" />
          <h3>No notifications yet</h3>
          <p>
            Create your first notification to send updates to users.
          </p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="notification-card"
              style={{
                borderLeftColor: TYPE_COLORS[notification.type] || TYPE_COLORS.INFO,
              }}
            >
              <div className="notification-card-header">
                <div className="notification-card-title">
                  <span
                    className="notification-type-icon"
                    style={{ color: TYPE_COLORS[notification.type] || TYPE_COLORS.INFO }}
                  >
                    {TYPE_ICONS[notification.type] || TYPE_ICONS.INFO}
                  </span>
                  <h4>{notification.title}</h4>
                  <span className="notification-target-badge">
                    {getTargetLabel(notification.target)}
                  </span>
                </div>
                <div className="notification-card-actions">
                  <span className="notification-date">
                    {formatDate(notification.createdAt)}
                  </span>
                  <button
                    className="notification-delete-btn"
                    onClick={() => handleDelete(notification.id)}
                    title="Delete notification"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="notification-card-message">{notification.message}</p>
              <div className="notification-card-footer">
                <span className="notification-sender">
                  Sent by: {notification.createdBy?.firstName}{" "}
                  {notification.createdBy?.lastName || "Admin"}
                </span>
                {notification._count && (
                  <span className="notification-recipients">
                    Delivered to {notification._count.users} user
                    {notification._count.users !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
