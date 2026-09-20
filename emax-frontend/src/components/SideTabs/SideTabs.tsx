import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import "./SideTabs.css";

type SideTabProps = {
  categoriesNode: React.ReactNode;
  brandsNode: React.ReactNode;
};

type TabKey = "categories" | "brands";

export default function SideTabs({
  categoriesNode,
  brandsNode,
}: SideTabProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read active tab from URL search params (persists across refresh)
  const activeTab = (searchParams.get("tab") as TabKey) || "categories";

  const handleTabChange = (tab: TabKey) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (tab === "categories") {
        newParams.delete("tab");
      } else {
        newParams.set("tab", tab);
      }
      return newParams;
    });
  };

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
          onClick={() => handleTabChange("categories")}
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
          onClick={() => handleTabChange("brands")}
        >
          Brands
        </button>
      </div>

      <div className="side-tabs__content">{content}</div>
    </aside>
  );
}

