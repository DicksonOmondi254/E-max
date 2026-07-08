import "./ProductCard.css";

import { useAppDispatch } from "../../redux/hooks";
import { addToCart } from "../../redux/cartSlice";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
}

const ProductCard = ({
  id,
  name,
  price,
  image,
}: ProductCardProps) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id,
        name,
        image,
        price,
        quantity: 1,
      })
    );
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} />
      </div>

      <div className="product-info">
        <h3>{name}</h3>

        <p className="price">
          KES {price.toLocaleString()}
        </p>

        <button
          className="cart-btn"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;