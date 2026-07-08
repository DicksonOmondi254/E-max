import {
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaBolt,
} from "react-icons/fa";

const ProductInfo = () => {
  return (
    <div className="product-info">

      <h1>Apple iPhone 16 Pro</h1>

      <div className="rating">

        <FaStar />

        4.9 (1,268 Reviews)

      </div>

      <h2>KES 185,000</h2>

      <p className="availability">
        ✔ In Stock
      </p>

      <p>
        Genuine Apple iPhone with official warranty,
        Face ID, USB-C, Apple Intelligence support,
        and fast nationwide delivery.
      </p>

      <div className="buttons">

        <button className="buy">
          <FaBolt />
          Buy Now
        </button>

        <button className="cart">
          <FaShoppingCart />
          Add to Cart
        </button>

        <button className="wishlist">
          <FaHeart />
        </button>

      </div>

    </div>
  );
};

export default ProductInfo;