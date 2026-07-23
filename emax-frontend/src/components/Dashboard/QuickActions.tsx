import { Link } from "react-router-dom";
import { FaShoppingBag, FaHistory, FaHeart, FaUser, FaSearch, FaHeadset } from "react-icons/fa";

const actions = [
  {
    to: "/products",
    icon: FaSearch,
    label: "Browse Products",
    variant: "action-btn--primary",
  },
  {
    to: "/dashboard/orders",
    icon: FaShoppingBag,
    label: "My Orders",
    variant: "action-btn--secondary",
  },
  {
    to: "/dashboard/wishlist",
    icon: FaHeart,
    label: "Wishlist",
    variant: "action-btn--accent",
  },
  {
    to: "/profile",
    icon: FaUser,
    label: "My Profile",
    variant: "action-btn--secondary",
  },
  {
    to: "/dashboard/settings",
    icon: FaHistory,
    label: "Settings",
    variant: "action-btn--secondary",
  },
  {
    to: "#",
    icon: FaHeadset,
    label: "Help & Support",
    variant: "action-btn--success",
  },
];

const QuickActions = () => {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div className="card-header-left">
          <FaHistory className="card-icon" />
          <h2>Quick Actions</h2>
        </div>
      </div>

      <div className="quick-actions-grid">
        {actions.map(({ to, icon: Icon, label, variant }) => (
          <Link
            key={label}
            to={to}
            className={`action-btn ${variant}`}
          >
            <Icon />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;

