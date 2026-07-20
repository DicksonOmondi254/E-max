import { useCallback } from "react";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../redux/cartSlice";

import {
  useAppDispatch,
} from "../../redux/hooks";

import type { CartItem as Item } from "../../redux/cartSlice";

const FALLBACK_IMAGE = "/images/no-image.svg";

interface Props {
  item: Item;
}

const CartItem = ({ item }: Props) => {
  const dispatch = useAppDispatch();

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.src = FALLBACK_IMAGE;
    },
    []
  );

  return (
    <div className="cart-item">

      <img
        src={item.image}
        alt={item.name}
        onError={handleImageError}
      />

      <div className="cart-info">

        <h3>{item.name}</h3>

        <p>
          KES {item.price.toLocaleString()}
        </p>

      </div>

      <div className="qty-controls">

        <button
          onClick={() =>
            dispatch(decreaseQuantity(item.id))
          }
        >
          -
        </button>

        <span>{item.quantity}</span>

        <button
          onClick={() =>
            dispatch(increaseQuantity(item.id))
          }
        >
          +
        </button>

      </div>

      <button
        className="remove-btn"
        onClick={() =>
          dispatch(removeFromCart(item.id))
        }
      >
        Remove
      </button>

    </div>
  );
};

export default CartItem;