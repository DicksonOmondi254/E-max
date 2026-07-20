import { useEffect, useState } from "react";

const WishlistPreview = () => {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/dashboard/me/wishlist",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load wishlist");
        }

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
    <div className="dashboard-card">
      <h2>Wishlist</h2>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <ul>
          {items.map((name) => (
            <li key={name}>❤️ {name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default WishlistPreview;