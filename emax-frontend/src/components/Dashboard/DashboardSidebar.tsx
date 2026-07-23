import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaShoppingBag,
  FaHeart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCog,
  FaSignOutAlt,
  FaShoppingCart,
} from "react-icons/fa";
import Logo from "../Logo/Logo";
import { useAppSelector } from "../../redux/hooks";
import { selectCartCount } from "../../redux/cartSlice";

const navItems = [
  { to: "/dashboard", icon: FaHome, label: "Dashboard" },
  { to: "/dashboard/orders", icon: FaShoppingBag, label: "My Orders" },
  { to: "/dashboard/wishlist", icon: FaHeart, label: "Wishlist" },
  { to: "/cart", icon: FaShoppingCart, label: "Cart", showBadge: true },
  { to: "/dashboard/addresses", icon: FaMapMarkerAlt, label: "Addresses" },
  { to: "/dashboard/payment-methods", icon: FaCreditCard, label: "Payment Methods" },
  { to: "/dashboard/settings", icon: FaCog, label: "Settings" },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const cartCount = useAppSelector(selectCartCount);

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ""}`
    : "C";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="dashboard-sidebar">
      {/* Decorative gradient orbs */}
      <div className="sidebar-orb sidebar-orb--1" />
      <div className="sidebar-orb sidebar-orb--2" />
      <div className="sidebar-orb sidebar-orb--3" />

      {/* Brand Section */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">
          <Logo />
        </div>
        <div className="sidebar-brand-text">
          <span>Premium Store</span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar-ring">
          <div className="sidebar-avatar">{initials.toUpperCase()}</div>
        </div>
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="sidebar-user-role">{user?.role || "Customer"}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul>
          {navItems.map(({ to, icon: Icon, label, showBadge }, idx) => {
            const isActive = location.pathname === to;
            return (
              <li
                key={to}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <Link to={to}>
                  <span className="nav-icon-wrapper">
                    <Icon />
                    {showBadge && cartCount > 0 && (
                      <span className="nav-cart-badge">{cartCount}</span>
                    )}
                  </span>
                  <span className="nav-label">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <div className="sidebar-logout" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

