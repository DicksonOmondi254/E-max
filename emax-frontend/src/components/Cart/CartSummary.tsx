import { useAppSelector } from "../../redux/hooks";
import { Link } from "react-router-dom";

const CartSummary = () => {
  const items = useAppSelector(
    (state) => state.cart.items
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 500 : 0;

  const total = subtotal + shipping;

  return (
    <div className="cart-summary">

      <h2>Order Summary</h2>

      <p>
        Subtotal:
        <strong>
          KES {subtotal.toLocaleString()}
        </strong>
      </p>

      <p>
        Shipping:
        <strong>
          KES {shipping.toLocaleString()}
        </strong>
      </p>

      <hr />

      <h3>
        Total:
        KES {total.toLocaleString()}
      </h3>

      <Link to="/cart">
  <button className="view-cart-btn">
    View Full Cart
  </button>
</Link>

<button className="checkout-btn">
  Proceed to Checkout
</button>

    </div>
  );
};

export default CartSummary;
