import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const WishlistIcon = () => {
  return (
    <Link className="nav-icon" to="/wishlist">
      <FaHeart />
    </Link>
  );
};

export default WishlistIcon;