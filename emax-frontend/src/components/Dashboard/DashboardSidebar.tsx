import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaShoppingBag,
  FaHeart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const DashboardSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="dashboard-sidebar">
      <h2>E-Max</h2>

      <ul>
        <li>
          <FaHome />
          <Link to="/dashboard">Dashboard</Link>
        </li>

        <li>
          <FaShoppingBag />
          <Link to="/dashboard/orders">My Orders</Link>
        </li>

        <li>
          <FaHeart />
          <Link to="/dashboard/wishlist">Wishlist</Link>
        </li>

        <li>
          <FaMapMarkerAlt />
          <Link to="/dashboard/addresses">Addresses</Link>
        </li>

        <li>
          <FaCreditCard />
          <Link to="/dashboard/payment-methods">
            Payment Methods
          </Link>
        </li>

        <li>
          <FaCog />
          <Link to="/dashboard/settings">Settings</Link>
        </li>

        <li onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </li>
      </ul>
    </aside>
  );
};

export default DashboardSidebar;
