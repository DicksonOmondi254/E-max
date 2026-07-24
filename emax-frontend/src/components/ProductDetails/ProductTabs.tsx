import { useState } from "react";
import Specifications from "./Specifications";
import Reviews from "./Reviews";

interface ProductTabsProps {
  productId: number;
  description: string;
}

const ProductTabs = ({ productId, description }: ProductTabsProps) => {

  const [tab, setTab] = useState("reviews");

  return (
    <section className="tabs">

      <button
        className={tab === "description" ? "tab-active" : ""}
        onClick={() => setTab("description")}
      >
        Description
      </button>

      <button
        className={tab === "specs" ? "tab-active" : ""}
        onClick={() => setTab("specs")}
      >
        Specifications
      </button>

      <button
        className={tab === "reviews" ? "tab-active" : ""}
        onClick={() => setTab("reviews")}
      >
        Reviews
      </button>

      <div className="tab-content">

        {tab === "description" && (
          <p>{description}</p>
        )}

        {tab === "specs" && <Specifications />}

        {tab === "reviews" && <Reviews productId={productId} />}

      </div>

    </section>
  );
};

export default ProductTabs;
