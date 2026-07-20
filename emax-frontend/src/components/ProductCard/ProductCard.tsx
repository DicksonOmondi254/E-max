import { Link } from "react-router-dom";
import "./ProductCard.css";

import type { Product as ApiProduct } from "../../types/product";

import { useAppDispatch } from "../../redux/hooks";
import { addToCart } from "../../redux/cartSlice";

// Full API-backed product (used around the app)
export type Product = Omit<ApiProduct, "active"> & { active?: boolean };

// Lightweight product objects used in FeaturedProducts/ProductGrid
export type ProductCardLite = {
  id: number;
  name: string;
  price: number;
  image?: string;
  thumbnail?: string;
  slug?: string;
  stock?: number;
  featured?: boolean;
  active?: boolean;
};

export type ProductCardProps = {
  product: Product | ProductCardLite;
};

const FALLBACK_IMAGE = "/images/no-image.svg";

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  const thumb = "thumbnail" in product ? product.thumbnail : undefined;
  const img = "image" in product ? product.image : undefined;

  const image = thumb
    ? `http://localhost:5000/uploads/products/${thumb}`
    : img ?? FALLBACK_IMAGE;

  const slugOrId =
    ("slug" in product && product.slug) || (product as any).id;

  const stock = product.stock ?? 0;
  const featured = product.featured ?? false;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        image,
        price: product.price,
        quantity: 1,
      })
    );
  };

  return (
    <div className="product-card">
      {featured && (
        <span className="featured-badge">
          ⭐ Featured
        </span>
      )}

      <Link to={`/products/${slugOrId}`} className="product-image">
        <img src={image} alt={product.name} loading="lazy" />
      </Link>

      <div className="product-info">
        <Link to={`/products/${slugOrId}`} className="product-link">
          <h3>{product.name}</h3>
        </Link>

        <p className="price">KES {product.price.toLocaleString()}</p>

        <p className={stock > 0 ? "in-stock" : "out-of-stock"}>
          {stock > 0 ? `${stock} items available` : "Out of Stock"}
        </p>

        <button
          className="cart-btn"
          disabled={stock <= 0}
          onClick={handleAddToCart}
        >
          {stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>

      </div>
    </div>
  );
};

export default ProductCard;

