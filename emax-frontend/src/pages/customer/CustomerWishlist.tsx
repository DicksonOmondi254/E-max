import { useEffect, useState } from "react";
import CustomerShell from "./CustomerShell";

type WishlistItem = {
  id: string | number;
  name: string;
};

const CustomerWishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/dashboard/me/wishlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load wishlist");
        const json = await res.json();
        setItems(json.data || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <CustomerShell title="Wishlist">
      <div className="dashboard-card">
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No wishlist items yet.</p>
        ) : (
          <ul className="wishlist-list">
            {items.map((it) => (
              <li key={it.id}>❤️ {it.name}</li>
            ))}
          </ul>
        )}
      </div>
    </CustomerShell>
  );
};

export default CustomerWishlist;

