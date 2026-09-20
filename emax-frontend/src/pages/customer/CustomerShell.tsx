import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../../components/Dashboard/DashboardSidebar";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";

// Shared styles used by all customer dashboard sub-pages.
// Importing here guarantees the CSS loads even on a hard refresh of any /dashboard/* route
// (e.g. /dashboard/orders, /dashboard/wishlist) without needing to visit /dashboard first.
import "../../components/Dashboard/Dashboard.css";

const CustomerShell = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="dashboard">
      <DashboardSidebar />

      <div className="dashboard-content">
        <div className="dashboard-hero customer-hero">
          <DashboardHeader />
        </div>

        <div className="customer-page-body">
          <div className="dashboard-page-title">
            <h2>{title}</h2>
            <div className="dashboard-breadcrumbs">
              <Link to="/dashboard">Dashboard</Link>
              <span>/</span>
              <span>{title}</span>
            </div>
          </div>

          <div className="dashboard-page-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerShell;
