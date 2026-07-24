import { useEffect, useState } from "react";
import { FaShoppingBag, FaHeart, FaTicketAlt, FaCoins } from "react-icons/fa";
import { customerDashboardService, type CustomerDashboardStats } from "../../services/dashboardCustomerService";

const DashboardOverview = () => {
  const [stats, setStats] = useState<CustomerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await customerDashboardService.getOverview();
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    {
      label: "Total Orders",
      value: stats?.ordersCount ?? 0,
      icon: FaShoppingBag,
      className: "stat-card--orders",
      change: "+12%",
      changeType: "positive",
    },
    {
      label: "Wishlist Items",
      value: stats?.wishlistCount ?? 0,
      icon: FaHeart,
      className: "stat-card--wishlist",
      change: "+5%",
      changeType: "positive",
    },
    {
      label: "Coupons",
      value: stats?.couponsCount ?? 0,
      icon: FaTicketAlt,
      className: "stat-card--coupons",
      change: "Available",
      changeType: "positive",
    },
    {
      label: "Reward Points",
      value: stats?.rewardPoints?.toLocaleString() ?? "0",
      icon: FaCoins,
      className: "stat-card--rewards",
      change: "Earn more",
      changeType: "positive",
    },
  ];

  return (
    <div className="dashboard-grid">
      {cards.map((card) => (
        <div key={card.label} className={`stat-card ${card.className}`}>
          <div className="stat-card-header">
            <span className="stat-card-icon">
              <card.icon />
            </span>
          </div>
          <p className="stat-card-label">{card.label}</p>
          <h1 className="stat-card-value">
            {loading ? (
              <span style={{ fontSize: 24, color: "#cbd5e1" }}>...</span>
            ) : (
              card.value
            )}
          </h1>
          <span className={`stat-card-change ${card.changeType}`}>
            {card.change}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DashboardOverview;

