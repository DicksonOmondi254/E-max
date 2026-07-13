import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaBox,
  FaTags,
  FaTrademark,
  FaShoppingCart,
  FaUsers,
  FaStar,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="sidebar">

      <h2>E-Max Admin</h2>

      <nav>

        <NavLink to="/admin">
          <FaTachometerAlt />
          Dashboard
        </NavLink>

        <NavLink to="/admin/products">
          <FaBox />
          Products
        </NavLink>

        <NavLink to="/admin/categories">
          <FaTags />
          Categories
        </NavLink>

        <NavLink to="/admin/brands">
          <FaTrademark />
          Brands
        </NavLink>

        <NavLink to="/admin/orders">
          <FaShoppingCart />
          Orders
        </NavLink>

        <NavLink to="/admin/customers">
          <FaUsers />
          Customers
        </NavLink>

        <NavLink to="/admin/reviews">
          <FaStar />
          Reviews
        </NavLink>

        <NavLink to="/admin/settings">
          <FaCog />
          Settings
        </NavLink>

      </nav>

    </aside>
  );
};

export default Sidebar;