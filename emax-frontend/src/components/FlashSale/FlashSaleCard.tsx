import { FaHeart, FaShoppingCart, FaEye, FaStar } from "react-icons/fa";

interface Props {
  name: string;
  image: string;
  price: number;
  oldPrice: number;
  rating: number;
  discount: number;
  soldPercent?: number;
}

const FlashSaleCard = ({
  name,
  image,
  price,
  oldPrice,
  rating,
  discount,
  soldPercent = 60,
}: Props) => {
  return (
    <div className="flash-card">
      <div className="discount-badge">-{discount}%</div>

      <button className="wishlist-btn">
        <FaHeart />
      </button>

      <img src={image} alt={name} />

      <h3>{name}</h3>

      <div className="rating">
        <FaStar color="#FFC107" />
        {rating}
      </div>

      <div className="prices">
        <span className="new-price">
          KES {price.toLocaleString()}
        </span>

        <span className="old-price">
          KES {oldPrice.toLocaleString()}
        </span>
      </div>

      {/* ── Inventory progress bar ── */}
      <div className="sold-bar">
        <div className="sold-bar__track">
          <div
            className="sold-bar__fill"
            style={{ width: `${soldPercent}%` }}
          />
        </div>
        <span className="sold-bar__label">{soldPercent}% Sold</span>
      </div>

      <div className="card-actions">
        <button>
          <FaShoppingCart /> Add
        </button>

        <button>
          <FaEye />
        </button>
      </div>
    </div>
  );
};

export default FlashSaleCard;
