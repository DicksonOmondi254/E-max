import CustomerShell from "./CustomerShell";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  product: string;
  status: string;
  total: number;
};

const CustomerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/dashboard/me/recent-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load orders");
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
    <CustomerShell title="My Orders">
      <div className="dashboard-card">
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
    </CustomerShell>
  );
};

export default CustomerOrders;

