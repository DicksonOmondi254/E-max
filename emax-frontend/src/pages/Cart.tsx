import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaTrash,
  FaArrowLeft,
  FaTruck,
  FaLock,
  FaShieldAlt,
  FaTag,
  FaTimes,
  FaMinus,
  FaPlus,
  FaHeart,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  clearCart,
  applyDiscount,
  selectCartItems,
  selectCartCount,
  selectSubtotal,
  selectCartTotal,
  selectShipping,
  selectDiscount,
} from "../redux/cartSlice";

import "../styles/cart.css";

const FALLBACK_IMAGE = "/images/no-image.svg";
const FREE_SHIPPING_THRESHOLD = 10000;

const Cart = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const cartCount = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectSubtotal);
  const total = useAppSelector(selectCartTotal);
  const shipping = useAppSelector(selectShipping);
  const discount = useAppSelector(selectDiscount);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [couponError, setCouponError] = useState("");

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.src = FALLBACK_IMAGE;
    },
    []
  );

  // Free shipping progress
  const shippingProgress = useMemo(() => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 100;
    return Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  }, [subtotal]);

  const remainingForFreeShipping = useMemo(() => {
    const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
    return remaining > 0 ? remaining : 0;
  }, [subtotal]);

  // Coupon handling
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }
    // Mock coupons — in production, this would call an API
    const validCoupons: Record<string, number> = {
      "WELCOME10": 0.1,   // 10% off
      "SAVE20": 0.2,      // 20% off
      "FREESHIP": 0,      // handled separately
    };

    if (validCoupons[code] !== undefined) {
      const discountAmount = Math.round(subtotal * validCoupons[code]);
      dispatch(applyDiscount(discountAmount));
      setAppliedCoupon(code);
      setCouponError("");
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(applyDiscount(0));
    setAppliedCoupon(null);
    setCouponError("");
  };

  // Remove item with animation
  const handleRemoveItem = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      dispatch(removeFromCart(id));
      setRemovingId(null);
    }, 350);
  };

  // Quantity update handler
  const handleQuantityInput = (id: number, value: string) => {
    const qty = parseInt(value, 10);
    if (!isNaN(qty) && qty >= 1) {
      dispatch(updateQuantity({ id, quantity: qty }));
    }
  };

  // Clear cart with confirmation
  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      dispatch(clearCart());
    }
  };

  // ── EMPTY STATE ──
  if (items.length === 0) {
    return (
      <div className="cart-page-wrapper">
        <div className="cart-empty-state">
          <FaShoppingCart className="cart-empty-icon" />
          <h2>Your Cart is Empty</h2>
          <p>
            Looks like you haven't added anything to your cart yet.
            Browse our products and discover amazing deals!
          </p>
          <Link to="/products" className="btn-shop-now">
            <FaShoppingCart />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── MAIN CART VIEW ──
  return (
    <div className="cart-page-wrapper">
      {/* Breadcrumb */}
      <div className="cart-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Shopping Cart</span>
      </div>

      {/* Header */}
      <div className="cart-header">
        <div className="cart-header-left">
          <h1>
            <FaShoppingCart className="cart-header-icon" />
            Shopping Cart
            <span className="cart-item-count-badge">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </span>
          </h1>
        </div>

        <div className="cart-actions-top">
          <Link to="/products" className="btn-continue-shopping">
            <FaArrowLeft />
            Continue Shopping
          </Link>
          <button className="btn-clear-cart" onClick={handleClearCart}>
            <FaTrash />
            Clear Cart
          </button>
        </div>
      </div>

      {/* Free Shipping Progress Bar */}
      {remainingForFreeShipping > 0 ? (
        <div className="free-shipping-bar">
          <FaTruck className="free-shipping-icon" />
          <span className="free-shipping-text">
            Add <strong>KES {remainingForFreeShipping.toLocaleString()}</strong> more
            to qualify for <strong>FREE shipping</strong>!
          </span>
          <div className="shipping-progress-track">
            <div
              className="shipping-progress-fill"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="free-shipping-bar" style={{ background: "linear-gradient(135deg, #d1fae5, #ecfdf5)", borderColor: "#6ee7b7" }}>
          <FaTruck className="free-shipping-icon" style={{ color: "#10b981" }} />
          <span className="free-shipping-text" style={{ color: "#065f46" }}>
            You've unlocked <strong>FREE shipping</strong>! 🎉
          </span>
        </div>
      )}

      {/* Main Layout */}
      <div className="cart-layout">
        {/* ── Left: Cart Items ── */}
        <div className="cart-items-container">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`cart-item-card ${removingId === item.id ? "removing" : ""}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Image */}
              <div className="cart-item-img-wrapper">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>

              {/* Details */}
              <div className="cart-item-details">
                <div>
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">
                    KES {item.price.toLocaleString()}
                    <span className="cart-item-unit-price">/ each</span>
                  </p>
                </div>

                <div className="cart-item-actions-row">
                  {/* Quantity Selector */}
                  <div className="qty-selector-modern">
                    <button
                      className="qty-btn-modern"
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus />
                    </button>
                    <input
                      className="qty-value-modern"
                      type="text"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityInput(item.id, e.target.value)
                      }
                      aria-label="Item quantity"
                    />
                    <button
                      className="qty-btn-modern"
                      onClick={() => dispatch(increaseQuantity(item.id))}
                      aria-label="Increase quantity"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  {/* Save for Later (wishlist redirect) */}
                  <button
                    className="cart-item-action-btn save"
                    onClick={() => {
                      // In a full implementation, this would add to wishlist
                      alert(`${item.name} saved to wishlist!`);
                    }}
                  >
                    <FaHeart />
                    Save
                  </button>

                  {/* Remove */}
                  <button
                    className="cart-item-action-btn remove"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <FaTrash />
                    Remove
                  </button>
                </div>
              </div>

              {/* Line Total */}
              <div className="cart-item-line-total">
                <span className="line-total-label">Total</span>
                <span className="line-total-value">
                  KES {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Right: Order Summary Sidebar ── */}
        <div className="cart-sidebar">
          {/* Order Summary Card */}
          <div className="order-summary-card">
            <h2>
              <FaTag />
              Order Summary
            </h2>

            <div className="summary-rows">
              <div className="summary-row">
                <span className="label">Subtotal</span>
                <span className="value">KES {subtotal.toLocaleString()}</span>
              </div>

              <div className="summary-row">
                <span className="label">
                  <FaTruck />
                  Shipping
                </span>
                <span className="value">
                  {shipping === 0 ? (
                    <span style={{ color: "#10b981" }}>FREE</span>
                  ) : (
                    `KES ${shipping.toLocaleString()}`
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="summary-row discount">
                  <span className="label">Discount ({appliedCoupon})</span>
                  <span className="value">-KES {discount.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Coupon Section */}
            <div className="coupon-section">
              {appliedCoupon ? (
                <div className="coupon-applied">
                  <span>✅ Coupon "{appliedCoupon}" applied!</span>
                  <button
                    className="coupon-remove-btn"
                    onClick={handleRemoveCoupon}
                    aria-label="Remove coupon"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <>
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleApplyCoupon();
                      }}
                    />
                    <button
                      className="coupon-apply-btn"
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "13px",
                        margin: "8px 0 0",
                      }}
                    >
                      {couponError}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Total */}
            <div className="summary-row total">
              <span>Total</span>
              <span className="value">KES {total.toLocaleString()}</span>
            </div>

            {/* Checkout Button */}
            <Link to="/checkout" className="checkout-btn-modern">
              <FaLock />
              Proceed to Checkout
            </Link>

            {/* Payment Methods */}
            <div className="payment-badges">
              <span>We accept</span>
              <FaCcVisa />
              <FaCcMastercard />
              <FaCcPaypal />
              <span style={{ fontWeight: 600, color: "#6366f1", fontSize: 11 }}>
                M-PESA
              </span>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="trust-item">
              <FaLock />
              <span>Secure checkout with SSL encryption</span>
            </div>
            <div className="trust-item">
              <FaShieldAlt />
              <span>Buyer protection on all orders</span>
            </div>
            <div className="trust-item">
              <FaTruck />
              <span>Free delivery on orders over KES 10,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

