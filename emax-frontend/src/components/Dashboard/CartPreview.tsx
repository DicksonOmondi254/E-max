import { Link } from "react-router-dom";
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  selectCartItems,
  selectCartCount,
  selectSubtotal,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../redux/cartSlice";

const CartPreview = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const cartCount = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectSubtotal);

  return (
    <div className="dashboard-card cart-preview-card">
      <div className="card-header-with-badge">
        <div className="card-title-wrapper">
          <FaShoppingCart className="card-icon cart-icon-color" />
          <h2>Shopping Cart</h2>
        </div>
        {cartCount > 0 && (
          <span className="cart-count-badge">{cartCount} items</span>
        )}
      </div>

      {cartCount === 0 ? (
        <div className="empty-cart-preview">
          <FaShoppingCart className="empty-cart-icon" />
          <p>Your cart is empty</p>
          <Link to="/products" className="action-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-preview-items">
            {items.slice(0, 1).map((item) => (
              <div className="cart-preview-item" key={item.id}>
                <div className="cart-item-image">
                  <img
                    src={item.image || "/images/no-image.svg"}
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/no-image.svg";
                    }}
                  />
                </div>
                <div className="cart-item-details">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">
                    KES {item.price.toLocaleString()}
                  </p>
                </div>
                <div className="cart-item-qty">
                  <button
                    className="qty-btn"
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => dispatch(increaseQuantity(item.id))}
                  >
                    <FaPlus />
                  </button>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            {items.length > 1 && (
              <p className="cart-more">+ {items.length - 1} more item{items.length - 1 > 1 ? 's' : ''} in cart</p>
            )}
          </div>

          <div className="cart-preview-footer">
            <div className="cart-preview-total">
              <span>Subtotal</span>
              <strong>KES {subtotal.toLocaleString()}</strong>
            </div>
            <Link to="/cart" className="action-btn view-cart-btn">
              View Full Cart
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPreview;
