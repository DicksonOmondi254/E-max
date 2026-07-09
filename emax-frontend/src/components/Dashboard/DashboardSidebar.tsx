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
  return (
    <aside className="dashboard-sidebar">

      <h2>E-Max</h2>

      <ul>

        <li><FaHome /> Dashboard</li>

        <li><FaShoppingBag /> My Orders</li>

        <li><FaHeart /> Wishlist</li>

        <li><FaMapMarkerAlt /> Addresses</li>

        <li><FaCreditCard /> Payment Methods</li>

        <li><FaCog /> Settings</li>

        <li><FaSignOutAlt /> Logout</li>

      </ul>

    </aside>
  );
};

export default DashboardSidebar;