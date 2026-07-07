import { FaSearch } from "react-icons/fa";
import "./Navbar.css";

const SearchBar = () => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search genuine electronics..."
      />

      <button>
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;