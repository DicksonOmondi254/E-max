import { useAppSelector } from "../../redux/hooks";

const PaymentSummary = () => {
  const items = useAppSelector(
    state => state.cart.items
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = 500;

  const total = subtotal + shipping;

  return (
    <div className="payment-summary">

      <h2>Payment Summary</h2>

      <div className="summary-row">
        <span>Subtotal</span>
        <strong>KES {subtotal.toLocaleString()}</strong>
      </div>

      <div className="summary-row">
        <span>Shipping</span>
        <strong>KES {shipping.toLocaleString()}</strong>
      </div>

      <hr />

      <div className="summary-row total">
        <span>Total</span>
        <strong>KES {total.toLocaleString()}</strong>
      </div>

    </div>
  );
};

export default PaymentSummary;