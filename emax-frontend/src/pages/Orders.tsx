import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type OrderListItem = {
  id: string;
  product: string;
  status: string;
  total: number;
};

const API_BASE = "http://localhost:5000";

const Orders = () => {
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headers = useMemo(() => {
    const h: Record<string, string> = {};
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/dashboard/me/recent-orders`,
        { headers }
      );

      if (!res.ok) {
        throw new Error("Failed to load orders.");
      }

      const json = await res.json();
      setOrders(json.data || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
        <h1 style={{ margin: 0 }}>My Orders</h1>
        <Link to="/products" style={{ fontSize: 14 }}>
          Continue Shopping
        </Link>
      </div>

      {loading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: "red" }}>{error}</p> : null}

      {!loading && !error && orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : null}

      {!loading && orders.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: 12,
            marginTop: 16,
          }}
        >
          {orders.map((o) => (
            <div
              key={o.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div>
                <strong>{o.product}</strong>
                <div style={{ fontSize: 12, color: "#666" }}>{o.id}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600 }}>{o.status}</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  KES {o.total.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Orders;

