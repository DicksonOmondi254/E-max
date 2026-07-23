import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { customerDashboardService, type CustomerWishlistItem } from "../../services/dashboardCustomerService";

const WishlistPreview = () => {
  const [items, setItems] = useState<CustomerWishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await customerDashboardService.getWishlist();
        setItems(data);
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
      <div className="card-header">
        <div className="card-header-left">
          <FaHeart className="card-icon" />
          <h2>Wishlist</h2>
        </div>
        {items.length > 0 && (
          <span className="card-badge">{items.length} items</span>
        )}
      </div>

      {loading ? (
        <div className="card-skeleton">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      ) : items.length === 0 ? (
        <div className="card-empty">
          <FaHeart className="empty-icon" />
          <p>Your wishlist is empty</p>
          <Link to="/products" className="action-btn action-btn--primary">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.slice(0, 4).map((item) => (
            <Link
              to={`/products/${item.slug || ""}`}
              key={item.id}
              className="wishlist-item"
              style={{ textDecoration: "none" }}
            >
              <img
                src={
                  item.image
                    ? `http://localhost:5000/uploads/products/${item.image}`
                    : "/images/no-image.svg"
                }
                alt={item.name}
                className="wishlist-item-img"
              />
              <div className="wishlist-item-info">
                <p className="wishlist-item-name">{item.name}</p>
                {item.brand && (
                  <p className="wishlist-item-brand">{item.brand}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPreview;

