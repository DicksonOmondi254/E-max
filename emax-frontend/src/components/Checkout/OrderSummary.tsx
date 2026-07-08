import { useAppSelector } from "../../redux/hooks";
import { Link } from "react-router-dom";

const OrderSummary = () => {
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
    <section className="checkout-card">

      <h2>Order Summary</h2>

      {items.map((item) => (
        <div
          key={item.id}
          className="summary-item"
        >
          <span>
            {item.name} × {item.quantity}
          </span>

          <strong>
            KES {(item.price * item.quantity).toLocaleString()}
          </strong>
        </div>
      ))}

      <hr />

      <div className="summary-row">

        <span>Subtotal</span>

        <strong>
          KES {subtotal.toLocaleString()}
        </strong>

      </div>

      <div className="summary-row">

        <span>Shipping</span>

        <strong>
          KES {shipping.toLocaleString()}
        </strong>

      </div>

      <div className="summary-row total">

        <span>Total</span>

        <strong>
          KES {total.toLocaleString()}
        </strong>

      </div>

      <Link to="/payment">
        <button className="checkout-btn">
          Continue to Payment
        </button>
      </Link>

    </section>
  );
};

export default OrderSummary;