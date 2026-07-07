import "./ProductCard.css";

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
}

const ProductCard = ({ name, price, image }: ProductCardProps) => {
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

        <button className="cart-btn">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;