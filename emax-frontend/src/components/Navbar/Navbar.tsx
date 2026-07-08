import "./Navbar.css";

import { useState } from "react";
import { Link } from "react-router-dom";

import Logo from "../Logo/Logo";
import SearchBar from "./SearchBar";
import CartIcon from "../Cart/CartIcon";
import CartDrawer from "../Cart/CartDrawer";
import WishlistIcon from "../Wishlist/WishlistIcon";
import NotificationBell from "../Notifications/NotificationBell";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
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

          <CartIcon onClick={() => setIsCartOpen(true)} />

          <NotificationBell />

          <UserMenu />
        </div>
      </header>

      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default Navbar;