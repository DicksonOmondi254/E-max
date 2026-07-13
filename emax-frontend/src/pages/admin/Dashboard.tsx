import { useEffect, useState } from "react";

import StatsCard from "../../components/Admin/StatsCard";

import { dashboardService } from "../../services/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    dashboardService.getDashboard().then(setStats);
  }, []);

  if (!stats) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>

      <div className="stats-grid">

        <StatsCard
          title="Products"
          value={stats.products}
        />

        <StatsCard
          title="Orders"
          value={stats.orders}
        />

        <StatsCard
          title="Users"
          value={stats.users}
        />

        <StatsCard
          title="Revenue"
          value={`KES ${stats.revenue}`}
        />

      </div>

    </div>
  );
};

export default Dashboard;