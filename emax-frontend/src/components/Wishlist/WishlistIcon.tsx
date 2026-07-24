import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

const WishlistIcon = () => {
  const count = useAppSelector((state) => state.wishlist.items.length);

  return (
    <Link className="nav-icon" to="/dashboard/wishlist">
      <FaHeart />
      {count > 0 && (
        <span className="badge" aria-live="polite" aria-label={`${count} items in wishlist`}>
          {count}
        </span>
      )}
    </Link>
  );
};

export default WishlistIcon;

