import AddressForm from "../components/Checkout/AddressForm";
import DeliveryMethod from "../components/Checkout/DeliveryMethod";
import OrderSummary from "../components/Checkout/OrderSummary";

import "../components/Checkout/Checkout.css";

const Checkout = () => {
  return (
    <div className="checkout-page">

      <div className="checkout-left">

        <AddressForm />

        <DeliveryMethod />

      </div>

      <div className="checkout-right">

        <OrderSummary />

      </div>

    </div>
  );
};

export default Checkout;