import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../redux/cartSlice";

import {
  useAppDispatch,
} from "../../redux/hooks";

import type { CartItem as Item } from "../../redux/cartSlice";

interface Props {
  item: Item;
}

const CartItem = ({ item }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <div className="cart-item">

      <img
        src={item.image}
        alt={item.name}
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