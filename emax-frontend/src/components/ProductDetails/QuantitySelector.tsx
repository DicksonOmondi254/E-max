import { useState } from "react";

const QuantitySelector = () => {

  const [qty, setQty] = useState(1);

  return (
    <div className="qty">

      <button
        onClick={() =>
          qty > 1 && setQty(qty - 1)
        }
      >
        -
      </button>

      <span>{qty}</span>

      <button
        onClick={() =>
          setQty(qty + 1)
        }
      >
        +
      </button>

    </div>
  );
};

export default QuantitySelector;