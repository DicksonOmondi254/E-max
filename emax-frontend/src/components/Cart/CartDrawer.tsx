import "./CartDrawer.css";

import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

import { useAppSelector } from "../../redux/hooks";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: Props) => {
  const items = useAppSelector(
    (state) => state.cart.items
  );

  return (
    <>
      <div
        className={`drawer-overlay ${open ? "show" : ""}`}
        onClick={onClose}
      />

      <div
        className={`cart-drawer ${open ? "open" : ""}`}
      >
        <div className="drawer-header">
          <h2>Shopping Cart</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <h3>Your cart is empty</h3>
            <p>Add products to begin shopping.</p>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                />
              ))}
            </div>

            <CartSummary />
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;