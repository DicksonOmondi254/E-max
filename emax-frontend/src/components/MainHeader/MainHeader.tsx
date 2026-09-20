import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaHeart, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useAppSelector } from "../../redux/hooks";
import "./MainHeader.css";

const TRENDING_TAGS = [
  "iPhone 16",
  "Gaming",
  "Headphones",
  "Smart TV",
];

const MainHeader = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((t, i) => t + i.quantity, 0)
  );
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const searchTag = (tag: string) => {
    setQuery(tag);
    navigate(`/products?search=${encodeURIComponent(tag)}`);
  };

  return (
    <header className="main-header">
      <div className="main-header__max">
        <Link to="/" className="main-header__logo">
          <span className="main-header__logo-mark">E</span>
          <span className="main-header__logo-text">E-Max</span>
        </Link>

        <div className="main-header__search">
          <form className="main-header__searchbar" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search genuine electronics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <FaSearch />
            </button>
          </form>
          <div className="main-header__tags">
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className="main-header__tag"
                onClick={() => searchTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="main-header__actions">
          <Link to="/dashboard/wishlist" className="main-header__action">
            <FaHeart />
            {wishlistCount > 0 && (
              <span className="main-header__badge">{wishlistCount}</span>
            )}
          </Link>
          <Link to="/cart" className="main-header__action">
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="main-header__badge">{cartCount}</span>
            )}
          </Link>
          <Link to="/login" className="main-header__action">
            <FaUserCircle />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
