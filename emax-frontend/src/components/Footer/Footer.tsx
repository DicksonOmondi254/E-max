import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        {/* Brand */}
        <div>
          <span className="site-footer__brand">E-Max</span>
          <p className="site-footer__desc">
            Your trusted source for genuine electronics, accessories and
            gadgets. Fast delivery across East Africa.
          </p>
          <div className="site-footer__social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?category=phones">Phones</Link></li>
            <li><Link to="/products?category=laptops">Laptops</Link></li>
            <li><Link to="/products?category=gaming">Gaming</Link></li>
            <li><Link to="/products?category=audio">Audio</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/dashboard">My Account</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        &copy; {new Date().getFullYear()} E-Max. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

