import { useEffect, useState } from "react";

const DashboardOverview = () => {
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [rewardPoints, setRewardPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/dashboard/me/overview",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load dashboard overview");
        }

        const json = await res.json();
        setOrdersCount(json.data?.ordersCount ?? 0);
        setWishlistCount(json.data?.wishlistCount ?? 0);
        setRewardPoints(json.data?.rewardPoints ?? 0);
      } catch {
        setOrdersCount(0);
        setWishlistCount(0);
        setRewardPoints(0);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <h3>Orders</h3>
        <h1>{loading ? "..." : ordersCount}</h1>
      </div>

      <div className="dashboard-card">
        <h3>Wishlist</h3>
        <h1>{loading ? "..." : wishlistCount}</h1>
      </div>

      <div className="dashboard-card">
        <h3>Coupons</h3>
        <h1>0</h1>
      </div>

      <div className="dashboard-card">
        <h3>Reward Points</h3>
        <h1>{loading ? "..." : rewardPoints.toLocaleString()}</h1>
      </div>
    </div>
  );
};

export default DashboardOverview;
