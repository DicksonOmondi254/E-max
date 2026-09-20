import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaStore,
  FaMoneyBillWave,
  FaUndo,
  FaComments,
  FaBullhorn,
  FaTrophy,
  FaCog,
} from "react-icons/fa";

const SellerSidebar = () => {
  return (
    <aside className="seller-sidebar">
      <div className="seller-sidebar-brand">
        <FaStore className="seller-sidebar-brand-icon" />
        <div className="seller-sidebar-brand-text">
          <h2>Seller Hub</h2>
          <span>E-Max Marketplace</span>
        </div>
      </div>

      <nav className="seller-sidebar-nav">
        <NavLink to="/seller" end>
          <FaTachometerAlt />
          Dashboard
        </NavLink>

        <NavLink to="/seller/products">
          <FaBox />
          Products
        </NavLink>

        <NavLink to="/seller/orders">
          <FaShoppingCart />
          Orders
        </NavLink>

        <NavLink to="/seller/earnings">
          <FaMoneyBillWave />
          Earnings
        </NavLink>

        <NavLink to="/seller/returns">
          <FaUndo />
          Returns & Refunds
        </NavLink>

        <NavLink to="/seller/messages">
          <FaComments />
          Messages & Reviews
        </NavLink>

        <NavLink to="/seller/promotions">
          <FaBullhorn />
          Promotions
        </NavLink>

        <NavLink to="/seller/performance">
          <FaTrophy />
          Performance
        </NavLink>

        <NavLink to="/seller/settings">
          <FaCog />
          Settings
        </NavLink>
      </nav>

      <div className="seller-sidebar-footer">
        <NavLink to="/admin" className="seller-sidebar-back-link">
          <FaStore />
          Back to Admin
        </NavLink>
      </div>
    </aside>
  );
};

export default SellerSidebar;

