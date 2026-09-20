import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../../services/categoryService";
import type { CategoryData } from "../../services/categoryService";
import { getCategoryIcon } from "../../data/categoryIcons";
import "./Categories.css";

// Sub-category chips shown under each category to make browsing visually
// engaging rather than text-heavy.
const SUB_CATEGORY_CHIPS: Record<string, string[]> = {
  Electronics: ["Headphones", "TVs", "Speakers"],
  Headphones: ["Wireless", "Over-Ear", "Noise Cancel"],
"Smart Home": ["Cameras", "Speakers", "Automation"],
  Gaming: ["Consoles", "Games", "Accessories"],
  Wearables: ["Smartwatches", "Fitness", "Bands"],
};

const Categories = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (e) {
        console.error("Failed to load categories:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <section className="cat-section">
        <div className="page-wrapper">
          <div className="section-title">
            <h2>Browse Categories</h2>
            <Link to="/products">View All →</Link>
          </div>
          <div className="cat-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="cat-skeleton">
                <div className="cat-skeleton__circle" />
                <div className="cat-skeleton__label" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="cat-section">
      <div className="page-wrapper">
        <div className="section-title">
          <h2>Browse Categories</h2>
          <Link to="/products">View All →</Link>
        </div>
<div className="cat-grid">
          {categories.slice(0, 12).map((cat) => {
            const icon = getCategoryIcon(cat.name);
            const count = cat._count?.products ?? 0;
            const chips = SUB_CATEGORY_CHIPS[cat.name] ?? [];
            return (
              <Link
                key={cat.id}
                to={`/categories/${cat.id}`}
                className="cat-item"
              >
                <div className="cat-icon-wrap">
                  <span className="cat-icon">{icon}</span>
                </div>
                <span className="cat-name">{cat.name}</span>
                {count > 0 && <span className="cat-count">{count} items</span>}
                {chips.length > 0 && (
                  <span className="cat-chips">
                    {chips.map((chip) => (
                      <span key={chip} className="cat-chip">
                        {chip}
                      </span>
                    ))}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;

