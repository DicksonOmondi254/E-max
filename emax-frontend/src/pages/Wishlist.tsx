import { useEffect, useMemo, useState } from "react";

type WishlistItem = {
  id: number;
  name: string;
  productId?: number;
};

type ApiWishlistItem = {
  id: number;
  name: string;
};

const API_BASE = "http://localhost:5000";

const Wishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useMemo(() => localStorage.getItem("token"), []);

  const authHeaders = useMemo(() => {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }, [token]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${API_BASE}/api/wishlist`,
        {
          headers: authHeaders,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to load wishlist.");
      }

      const json = await res.json();
      const data: ApiWishlistItem[] = json.data || [];

      // backend returns {id, name} where id is wishlistItem.id.
      // For delete we need productId; frontend will call dashboard endpoints
      // for remove via productId only if available in response.
      // In current backend, wishlist item response does not include productId,
      // so we store it as undefined and render a remove button only when present.
      setItems(
        data.map((d) => ({
          id: d.id,
          name: d.name,
          productId: (d as any).productId,
        }))
      );
    } catch (e: any) {
      setError(e?.message || "Failed to load wishlist.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      setError(null);
      const res = await fetch(
        `${API_BASE}/api/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to remove from wishlist.");
      }

      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to remove from wishlist.");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wishlist-page" style={{ padding: 24 }}>
      <h1>Your Wishlist</h1>

      {loading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: "red" }}>{error}</p> : null}

      {!loading && items.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : null}

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {items.map((it) => (
          <div
            key={it.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #eee",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <div>
              <strong>❤️ {it.name}</strong>
            </div>

            {typeof it.productId === "number" ? (
              <button
                className="btn"
                onClick={() => removeFromWishlist(it.productId!)}
              >
                Remove
              </button>
            ) : (
              <span style={{ fontSize: 12, color: "#666" }}>
                Remove unavailable (productId not returned)
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;

