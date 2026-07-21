import { Link } from "react-router-dom";

import { useStoreSettings } from "../../hooks/useStoreSettings";

const Logo = () => {
  const { logo, storeName } = useStoreSettings();

  return (
    <Link
      to="/"
      style={{
        textDecoration: "none",
        fontSize: "30px",
        fontWeight: "700",
        color: "#0057ff",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {logo ? (
        <img
          src={logo}
          alt={`${storeName} logo`}
          style={{
            height: "40px",
            width: "auto",
            maxWidth: "180px",
            objectFit: "contain",
          }}
        />
      ) : (
        "E-Max"
      )}
    </Link>
  );
};

export default Logo;
