import "./Navbar.css";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import { FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";
import Button from "../common/Button/Button";

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <Link to="/" className="logo-link">
          E-Max
        </Link>
      </div>

      {/* Search */}
      <SearchBar />

      {/* Navigation */}
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/products">Products</Link>
        </li>

        <li>
          <Link to="/categories">Categories</Link>
        </li>

        <li>
          <Link to="/deals">Deals</Link>
        </li>

        <li>
          <Link to="/about">About</Link>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>

      {/* Right Side */}
      <div className="actions">
        <Link to="/wishlist">
          <FaHeart />
        </Link>

        <Link to="/cart">
          <FaShoppingCart />
        </Link>

        <Link to="/profile">
          <FaUser />
        </Link>

        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </div>
    </nav>
  );
}