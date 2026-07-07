import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/"
      style={{
        textDecoration: "none",
        fontSize: "30px",
        fontWeight: "700",
        color: "#0057ff",
      }}
    >
      E-Max
    </Link>
  );
};

export default Logo;