import { useMemo, useState } from "react";

import "./SideTabs.css";

type SideTabProps = {
  categoriesNode: React.ReactNode;
  brandsNode: React.ReactNode;
};

export default function SideTabs({
  categoriesNode,
  brandsNode,
}: SideTabProps) {
  const [activeTab, setActiveTab] = useState<
    "categories" | "brands"
  >("categories");

  const content = useMemo(() => {
    return activeTab === "categories" ? categoriesNode : brandsNode;
  }, [activeTab, categoriesNode, brandsNode]);

  return (
    <aside className="side-tabs">
      <div className="side-tabs__header">
        <button
          type="button"
          className={
            activeTab === "categories"
              ? "side-tabs__tab side-tabs__tab--active"
              : "side-tabs__tab"
          }
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
        <button
          type="button"
          className={
            activeTab === "brands"
              ? "side-tabs__tab side-tabs__tab--active"
              : "side-tabs__tab"
          }
          onClick={() => setActiveTab("brands")}
        >
          Brands
        </button>
      </div>

      <div className="side-tabs__content">{content}</div>
    </aside>
  );
}

