import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import DashboardOverview from "../components/Dashboard/DashboardOverview";
import RecentOrders from "../components/Dashboard/RecentOrders";
import WishlistPreview from "../components/Dashboard/WishlistPreview";
import RecentlyViewed from "../components/Dashboard/RecentlyViewed";
import Notifications from "../components/Dashboard/Notifications";
import RewardPoints from "../components/Dashboard/RewardPoints";
import QuickActions from "../components/Dashboard/QuickActions";

import "../components/Dashboard/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">

      <DashboardSidebar />

      <div className="dashboard-content">

        <DashboardHeader />

        <DashboardOverview />

        <div className="dashboard-sections">

          <RecentOrders />

          <WishlistPreview />

          <RecentlyViewed />

          <RewardPoints />

          <Notifications />

          <QuickActions />

        </div>

      </div>

    </div>
  );
};

export default Dashboard;