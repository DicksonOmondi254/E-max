import "./ProductCard.css";

import { useAppDispatch } from "../../redux/hooks";
import { addToCart } from "../../redux/cartSlice";

interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  stock: number;
  featured: boolean;
  active: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({
  product,
}: ProductCardProps) => {
  const dispatch = useAppDispatch();

  const image = product.thumbnail
    ? `http://localhost:5000/uploads/products/${product.thumbnail}`
    : "/images/no-image.png";

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
      <div className="product-image">
        <img
          src={image}
          alt={product.name}
        />

        {product.featured && (
          <span className="featured-badge">
            ⭐ Featured
          </span>
        )}
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="price">
          KES {product.price.toLocaleString()}
        </p>

        <p
          className={
            product.stock > 0
              ? "in-stock"
              : "out-of-stock"
          }
        >
          {product.stock > 0
            ? `In Stock (${product.stock})`
            : "Out of Stock"}
        </p>

        <button
          className="cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          {product.stock > 0
            ? "Add to Cart"
            : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;