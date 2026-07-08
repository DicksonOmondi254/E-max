import CartItem from "../components/Cart/CartItem";
import CartSummary from "../components/Cart/CartSummary";

import { useAppSelector } from "../redux/hooks";

import "../components/Cart/Cart.css";

const Cart = () => {
  const items = useAppSelector(
    (state) => state.cart.items
  );

  return (
    <div className="cart-page">

      <div className="cart-items">

        <h1>Shopping Cart</h1>

        {items.length === 0 ? (
          <h2>Your cart is empty.</h2>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
            />
          ))
        )}

      </div>

      <CartSummary />

    </div>
  );
};

export default Cart;