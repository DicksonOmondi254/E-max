import { useState } from "react";
import Specifications from "./Specifications";
import Reviews from "./Reviews";

const ProductTabs = () => {

  const [tab, setTab] = useState("description");

  return (
    <section className="tabs">

      <button onClick={() => setTab("description")}>
        Description
      </button>

      <button onClick={() => setTab("specs")}>
        Specifications
      </button>

      <button onClick={() => setTab("reviews")}>
        Reviews
      </button>

      <div className="tab-content">

        {tab === "description" && (
          <p>
            Genuine Apple product with official warranty,
            secure payments, and nationwide delivery.
          </p>
        )}

        {tab === "specs" && <Specifications />}

        {tab === "reviews" && <Reviews />}

      </div>

    </section>
  );
};

export default ProductTabs;