import "./CartIcon.css";

import  { FaShoppingCart } from "react-icons/fa";

import  { useAppSelector } from "../../redux/hooks";

interface Props {
  onClick: () => void;
}

const CartIcon = ({ onClick }: Props) => {
  const items = useAppSelector((state) => state.cart.items);

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div
      className="cart-icon"
      onClick={onClick}
    >
      <FaShoppingCart size={24} />

      {totalItems > 0 && (
        <span
          className="cart-badge"
          aria-live="polite"
          aria-label={`${totalItems} items in cart`}
        >
          {totalItems}
        </span>
      )}

    </div>

  );
};

export default CartIcon;