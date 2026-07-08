import { useState } from "react";

import MpesaPayment from "./MpesaPayment";
import CardPayment from "./CardPayment";
import PaypalPayment from "./PaypalPayment";
import BankTransfer from "./BankTransfer";

const PaymentMethods = () => {
  const [method, setMethod] = useState("mpesa");

  return (
    <div className="payment-card">

      <h2>Select Payment Method</h2>

      <div className="payment-tabs">

        <button onClick={() => setMethod("mpesa")}>
          M-Pesa
        </button>

        <button onClick={() => setMethod("card")}>
          Visa / Mastercard
        </button>

        <button onClick={() => setMethod("paypal")}>
          PayPal
        </button>

        <button onClick={() => setMethod("bank")}>
          Bank Transfer
        </button>

      </div>

      {method === "mpesa" && <MpesaPayment />}
      {method === "card" && <CardPayment />}
      {method === "paypal" && <PaypalPayment />}
      {method === "bank" && <BankTransfer />}

    </div>
  );
};

export default PaymentMethods;