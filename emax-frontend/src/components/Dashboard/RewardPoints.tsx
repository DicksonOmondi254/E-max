import { useEffect, useState } from "react";
import { FaCoins, FaGift } from "react-icons/fa";
import { customerDashboardService } from "../../services/dashboardCustomerService";

const RewardPoints = () => {
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await customerDashboardService.getOverview();
        setPoints(data.rewardPoints);
      } catch {
        setPoints(0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const nextTier = 5000;
  const progress = Math.min((points / nextTier) * 100, 100);

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div className="card-header-left">
          <FaCoins className="card-icon" style={{ color: "#f59e0b" }} />
          <h2>Reward Points</h2>
        </div>
      </div>

      {loading ? (
        <div className="card-skeleton">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      ) : (
        <div className="reward-content">
          <p className="reward-points-value">
            {points.toLocaleString()}
          </p>
          <p className="reward-label">Earned Points</p>

          <div className="reward-progress">
            <div
              className="reward-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="reward-next">
            <FaGift style={{ marginRight: 4, verticalAlign: "middle" }} />
            {points >= nextTier
              ? "You've unlocked Gold Tier! 🎉"
              : `${(nextTier - points).toLocaleString()} points to Gold Tier`}
          </p>
        </div>
      )}
    </div>
  );
};

export default RewardPoints;

