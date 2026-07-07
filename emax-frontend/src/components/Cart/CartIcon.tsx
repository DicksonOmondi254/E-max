import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartIcon = () => {
  return (
    <Link className="nav-icon" to="/cart">
      <FaShoppingCart />
      <span className="badge">0</span>
    </Link>
  );
};

export default CartIcon;