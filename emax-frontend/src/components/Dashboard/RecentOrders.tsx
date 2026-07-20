import { useEffect, useState } from "react";

const RecentOrders = () => {
  const [orders, setOrders] = useState<
    { id: string; product: string; status: string; total: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/dashboard/me/recent-orders",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load recent orders");
        }

        const json = await res.json();
        setOrders(json.data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="dashboard-card">
      <h2>Recent Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div className="order-item" key={order.id}>
            <div>
              <strong>{order.product}</strong>
              <p>{order.id}</p>
            </div>
            <div>
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
              <h4>KES {order.total.toLocaleString()}</h4>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentOrders;

