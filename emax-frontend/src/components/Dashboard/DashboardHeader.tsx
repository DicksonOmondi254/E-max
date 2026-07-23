import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useAppSelector } from "../../redux/hooks";
import { selectCartCount } from "../../redux/cartSlice";

const DashboardHeader = () => {
  const user = useAppSelector((state) => state.auth.user);
  const cartCount = useAppSelector(selectCartCount);

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ""}`
    : "C";

  return (
    <header className="dashboard-header">
      <div className="header-greeting">
        <h1>
          Welcome back, {user?.firstName || "Customer"}! 👋
        </h1>
        <p>Here&apos;s what&apos;s happening with your E-Max account today.</p>
      </div>

      <div className="header-actions">
        <Link to="/cart" className="header-icon-btn">
          <FaShoppingCart />
          {cartCount > 0 && (
            <span className="header-badge">{cartCount}</span>
          )}
        </Link>

        <div className="header-avatar-wrapper">
          {user?.firstName ? (
            <div className="sidebar-avatar header-avatar">
              {initials.toUpperCase()}
            </div>
          ) : (
            <img
              src="/images/avatar.png"
              alt="avatar"
              className="avatar"
            />
          )}
          <span className="online-dot" />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

