import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import "../styles/cart.css";

import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  selectCartItems,
  selectCartCount,
  selectSubtotal,
  selectCartTotal,
} from "../redux/cartSlice";

const FALLBACK_IMAGE = "/images/no-image.svg";

const Cart = () => {
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectCartItems);
  const cartCount = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectSubtotal);
  const total = useAppSelector(selectCartTotal);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.src = FALLBACK_IMAGE;
    },
    []
  );

  if (items.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <h1>Your Cart</h1>

        <p>Your shopping cart is empty.</p>

        <Link className="btn-primary" to="/products">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>

        <p>{cartCount} item(s)</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div
              key={item.id}
              className="cart-item"
            >
              <img
                src={item.image}
                alt={item.name}
                className="cart-image"
                onError={handleImageError}
              />

              <div className="cart-info">
                <h3>{item.name}</h3>

                <p>
                  KES {item.price.toLocaleString()}
                </p>
              </div>

              <div className="cart-qty">
                <button
                  onClick={() =>
                    dispatch(
                      decreaseQuantity(item.id)
                    )
                  }
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    dispatch(
                      increaseQuantity(item.id)
                    )
                  }
                >
                  +
                </button>
              </div>

              <div className="cart-total">
                KES{" "}
                {(
                  item.price * item.quantity
                ).toLocaleString()}
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
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>

            <span>
              KES {subtotal.toLocaleString()}
            </span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>

            <span>FREE</span>
          </div>

          <div className="summary-row total">
            <strong>Total</strong>

            <strong>
              KES {total.toLocaleString()}
            </strong>
          </div>

          <Link
            className="checkout-btn"
            to="/checkout"
          >
            Proceed to Checkout
          </Link>

          <button
            className="clear-btn"
            onClick={() =>
              dispatch(clearCart())
            }
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;