import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">

      <h2>E-Max Admin</h2>

      <nav>

        <NavLink to="/admin">
          Dashboard
        </NavLink>

        <NavLink to="/admin/products">
          Products
        </NavLink>

        <NavLink to="/admin/categories">
          Categories
        </NavLink>

        <NavLink to="/admin/brands">
          Brands
        </NavLink>

        <NavLink to="/admin/orders">
          Orders
        </NavLink>

        <NavLink to="/admin/customers">
          Customers
        </NavLink>

      </nav>

    </aside>
  );
};

export default Sidebar;