import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const UserMenu = () => {
  return (
    <Link className="nav-icon" to="/login">
      <FaUserCircle size={26} />
    </Link>
  );
};

export default UserMenu;