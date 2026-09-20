import { Link } from "react-router-dom";
import {
  FaStore,
  FaMobileAlt,
  FaHeadset,
} from "react-icons/fa";
import "./TopBar.css";

// Cart, Profile, and Wishlist are already in MainHeader — keep TopBar lean.
const TopBar = () => {
  return (
    <div className="topbar">
      <div className="topbar__max">
        <ul className="topbar__left">
          <li>
            <Link to="/seller">
              <FaStore className="topbar__icon" />
              Seller Center
            </Link>
          </li>
          <li>
            <a href="#">
              <FaMobileAlt className="topbar__icon" />
              Download App
            </a>
          </li>
        </ul>

        <ul className="topbar__right">
          <li>
            <a href="#">
              <FaHeadset className="topbar__icon" />
              Help Center
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TopBar;
