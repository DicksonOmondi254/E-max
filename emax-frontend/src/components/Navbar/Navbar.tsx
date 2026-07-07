import "./Navbar.css";

import { Link } from "react-router-dom";

import Logo from "../Logo/Logo";
import SearchBar from "./SearchBar";
import CartIcon from "../Cart/CartIcon";
import WishlistIcon from "../Wishlist/WishlistIcon";
import NotificationBell from "../Notifications/NotificationBell";
import UserMenu from "./UserMenu";

const Navbar = () => {
  return (
    <header className="navbar">

      <Logo />

      <SearchBar />

      <nav>

        <ul className="nav-links">

          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/products">Products</Link>
          </li>

          <li>
            <Link to="/deals">Deals</Link>
          </li>

          <li>
            <Link to="/brands">Brands</Link>
          </li>

        </ul>

      </nav>

      <div className="nav-right">

        <WishlistIcon />

        <CartIcon />

        <NotificationBell />

        <UserMenu />

      </div>

    </header>
  );
};

export default Navbar;