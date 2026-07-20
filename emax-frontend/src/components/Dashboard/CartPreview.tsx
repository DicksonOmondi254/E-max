import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import { productService } from "../../services/productService";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addToCart,
  clearCart,
  selectCartItems,
  selectCartCount,
} from "../../redux/cartSlice";

const imageBaseUrl = "http://localhost:5000/uploads/products/";

type FeaturedProduct = {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  stock: number;
};

type CartTopItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

const CartPreview = () => {
  const dispatch = useAppDispatch();


  const items = useAppSelector(selectCartItems);
  const cartCount = useAppSelector(selectCartCount);

  const [featured, setFeatured] = useState<FeaturedProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productService.getFeaturedProducts();
        const list = Array.isArray(data) ? data : data?.items ?? [];

        setFeatured(
          list
            .slice(0, 4)
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              thumbnail: p.thumbnail,
              stock: p.stock,
            }))
        );
      } catch (e: any) {
        setProductsError(e?.message || "Failed to load products");
        setFeatured([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    load();
  }, []);

  const topItem = useMemo(() => items[0] as CartTopItem | undefined, [items]);

  const handleAdd = (p: FeaturedProduct) => {
    if (p.stock <= 0) return;

    dispatch(
      addToCart({
        id: p.id,
        name: p.name,
        image: `${imageBaseUrl}${p.thumbnail}`,
        price: p.price,
        quantity: 1,
      })
    );
  };

  return (
    <div
      className="dashboard-card"
      style={{
        background: "linear-gradient(180deg, rgba(0,87,255,0.08), rgba(255,255,255,1))",
        borderRadius: 16,
        padding: 16,
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18 }}>Cart</h2>

        <span
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            background: items.length
              ? "rgba(0,87,255,0.12)"
              : "rgba(0,0,0,0.05)",
            color: items.length ? "#0057ff" : "#666",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          {items.length ? `${cartCount} item(s)` : "Empty"}
        </span>
      </div>

      {items.length > 0 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
          }}
        >
          {topItem ? (
            <div>
              <strong style={{ display: "block", fontSize: 13 }}>
                {topItem.name || "Cart Item"}
              </strong>
              <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
                Qty: {topItem.quantity}
              </p>
            </div>
          ) : (
            <div />
          )}

          <span
            className="status processing"
            style={{ background: "#0057ff" }}
          >
            In Cart
          </span>
        </div>
      ) : null}

      {items.length > 1 ? (
        <p style={{ color: "#666", fontSize: 13, marginTop: -4, marginBottom: 12 }}>
          + {items.length - 1} more item(s)
        </p>
      ) : null}

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
        <Link
          to="/cart"
          className="action-btn"
          style={{
            textDecoration: "none",
            padding: "9px 12px",
            borderRadius: 10,
            fontSize: 13,
            background: "#f3f6ff",
            color: "#0057ff",
            border: "1px solid rgba(0,87,255,0.2)",
            flex: 1,
            textAlign: "center",
          }}
        >
          View Cart
        </Link>

        <button
          className="action-btn"
          style={{
            border: "1px solid rgba(0,0,0,0.08)",
            background: "#fff",
            color: "#111",
            cursor: items.length ? "pointer" : "not-allowed",
            padding: "9px 10px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 800,
            opacity: items.length ? 1 : 0.6,
          }}
          onClick={() => dispatch(clearCart())}
          disabled={!items.length}
        >
          Clear
        </button>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginTop: 6,
            marginBottom: 14,
          }}
        >
          <p style={{ margin: 0, color: "#666" }}>Your shopping cart is empty.</p>
          <a
            href="/products"
            className="action-btn"
            style={{
              textDecoration: "none",
              padding: "9px 12px",
              borderRadius: 10,
              fontSize: 13,
              background: "#0057ff",
              color: "#fff",
              fontWeight: 800,
            }}
          >
            Shop Now
          </a>
        </div>
      ) : null}

      {/* Shop & Add (removed) */}
      <div style={{ display: "none" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 14, color: "#222" }}>Shop & Add</h3>
          <span style={{ fontSize: 12, color: "#666", fontWeight: 700 }}>
            Featured
          </span>
        </div>


        {loadingProducts ? (
          <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: 13 }}>Loading...</p>
        ) : productsError ? (
          <p style={{ margin: "8px 0 0 0", color: "#dc3545", fontSize: 13 }}>
            {productsError}
          </p>
        ) : featured.length === 0 ? (
          <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: 13 }}>
            No products available.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            {featured.map((p) => {
              const imageUrl = `${imageBaseUrl}${p.thumbnail}`;
              const isOut = p.stock <= 0;

              return (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.06)",
                    background: "rgba(255,255,255,0.7)",
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={p.name}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      objectFit: "cover",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 900,
                        fontSize: 12,
                        color: "#222",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={p.name}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#0057ff",
                        fontWeight: 900,
                        marginTop: 2,
                      }}
                    >
                      KES {p.price.toLocaleString()}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: isOut ? "#dc3545" : "#28a745",
                        marginTop: 2,
                        fontWeight: 800,
                      }}
                    >
                      {isOut ? "Out of stock" : `${p.stock} available`}
                    </div>
                  </div>

                  <button
                    className="cart-btn"
                    style={{
                      width: "100%",
                      maxWidth: 104,
                      padding: "10px 8px",
                      fontSize: 12,
                      borderRadius: 10,
                      border: "none",
                      background: isOut ? "#e9ecef" : "#ff6b00",
                      backgroundColor: isOut ? "#f53333" : "#ff6b00",
                      color: "#fff",
                      cursor: isOut ? "not-allowed" : "pointer",
                      fontWeight: 900,
                      opacity: isOut ? 0.9 : 1,
                      transition: "transform 120ms ease, background 150ms ease",
                    }}
                    disabled={isOut}
                    onPointerDown={(e) => {
                      const el = e.currentTarget;
                      if (!isOut) el.style.transform = "scale(0.97)";
                    }}
                    onPointerUp={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                    onPointerLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                    onClick={() => handleAdd(p)}
                  >
                    {isOut ? "N/A" : "Add"}
                  </button>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Proceed CTA */}
      <div style={{ marginTop: 16 }}>
        <Link
          to="/checkout"
          className="action-btn"
          style={{
            textDecoration: "none",
            padding: "12px 14px",
            borderRadius: 12,
            fontSize: 13,
            background: "#0057ff",
            color: "#fff",
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: items.length === 0 ? 0.6 : 1,
            pointerEvents: items.length === 0 ? "none" : "auto",
          }}
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPreview;

