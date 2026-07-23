import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHistory } from "react-icons/fa";

interface RecentProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  thumbnail: string;
}

const RecentlyViewed = () => {
  const [products, setProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch {
        setProducts([]);
      }
    }
  }, []);

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div className="card-header-left">
          <FaHistory className="card-icon" />
          <h2>Recently Viewed</h2>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="card-empty">
          <FaHistory className="empty-icon" />
          <p>Your recently viewed items will appear here.</p>
        </div>
      ) : (
        <div className="recently-viewed-scroll">
          {products.slice(0, 6).map((product) => (
            <Link
              to={`/products/${product.slug}`}
              key={product.id}
              className="recently-viewed-item"
              style={{ textDecoration: "none" }}
            >
              <img
                src={product.thumbnail || "/images/no-image.svg"}
                alt={product.name}
              />
              <p>{product.name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyViewed;

