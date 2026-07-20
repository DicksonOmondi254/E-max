import { useEffect, useState } from "react";

const RewardPoints = () => {
  const [points, setPoints] = useState<number | null>(null);
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
          throw new Error("Failed to load reward points");
        }

        const json = await res.json();
        setPoints(json.data?.rewardPoints ?? 0);
      } catch {
        setPoints(0);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="dashboard-card">
      <h2>Reward Points</h2>

      {loading ? <p>Loading...</p> : <h1>{points?.toLocaleString()}</h1>}

      <p>You can redeem these points on your next purchase.</p>
    </div>
  );
};

export default RewardPoints;

