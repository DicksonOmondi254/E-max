import PaymentMethods from "../components/Payment/PaymentMethods";
import PaymentSummary from "../components/Payment/PaymentSummary";

import "../components/Payment/Payment.css";

const Payment = () => {
  return (
    <div className="payment-page">

      <div className="payment-left">
        <PaymentMethods />
      </div>

      <div className="payment-right">
        <PaymentSummary />
      </div>

    </div>
  );
};

export default Payment;