import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeadset,
  FaCommentDots,
  FaShoppingCart,
  FaChevronUp,
  FaTimes,
  FaPlus,
} from "react-icons/fa";
import { useAppSelector } from "../../redux/hooks";
import "./FloatingActions.css";

// Consolidated floating widget: a single toggle expands Live Chat, Messages,
// Cart, and Scroll-to-Top to reduce bottom-right clutter.
const FloatingActions = () => {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((t, i) => t + i.quantity, 0)
  );

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`floating-widget ${open ? "floating-widget--open" : ""}`}>
      {/* Expandable action buttons */}
      <div className="floating-widget__actions">
        <button
          className="floating-widget__btn"
          title="Live Chat Support"
          aria-label="Live chat support"
        >
          <FaHeadset />
          <span className="floating-widget__label">Live Chat</span>
        </button>

        <button
          className="floating-widget__btn"
          title="Seller Messages"
          aria-label="Seller messages"
        >
          <FaCommentDots />
          <span className="floating-widget__label">Messages</span>
        </button>

        <Link to="/cart" className="floating-widget__btn" title="Shopping Cart">
          <FaShoppingCart />
          {cartCount > 0 && (
            <span className="floating-widget__badge">{cartCount}</span>
          )}
          <span className="floating-widget__label">Cart</span>
        </Link>

        <button
          className={`floating-widget__btn floating-widget__btn--top ${
            showTop ? "floating-widget__btn--visible" : ""
          }`}
          title="Back to top"
          aria-label="Back to top"
          onClick={scrollToTop}
        >
          <FaChevronUp />
          <span className="floating-widget__label">Top</span>
        </button>
      </div>

      {/* Main toggle button */}
      <button
        className="floating-widget__toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close actions" : "Open actions"}
        aria-expanded={open}
      >
        {open ? <FaTimes /> : <FaPlus />}
      </button>
    </div>
  );
};

export default FloatingActions;
