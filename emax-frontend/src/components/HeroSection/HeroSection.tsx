import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import HeroSlider from "../HeroSlider/HeroSlider";
import { categoryService } from "../../services/categoryService";
import { getCategoryIcon } from "../../data/categoryIcons";
import "./HeroSection.css";

type Category = {
  id: number;
  name: string;
};

const SIDE_TABS = ["What's New", "Flash Sale", "Best Sellers"];

const HeroSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-section__max">
        {/* ── Left: Category Navigation Drawer ── */}
        <aside className="hero-section__sidebar">
          <h3 className="hero-section__sidebar-title">All Categories</h3>
          <ul className="hero-section__cat-list">
            {categories.slice(0, 12).map((cat) => (
              <li key={cat.id} className="hero-section__cat-item">
                <Link to={`/categories/${cat.id}`}>
                  <span className="hero-section__cat-icon">
                    {getCategoryIcon(cat.name)}
                  </span>
                  <span className="hero-section__cat-name">{cat.name}</span>
                  <FaChevronRight className="hero-section__cat-arrow" />
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/products" className="hero-section__all">
            View All Categories
          </Link>
        </aside>

        {/* ── Right: Secondary Tabs + Hero Carousel ── */}
        <div className="hero-section__main">
          <div className="hero-section__tabs">
            {SIDE_TABS.map((tab, i) => (
              <button
                key={tab}
                className={`hero-section__tab ${
                  activeTab === i ? "hero-section__tab--active" : ""
                }`}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="hero-section__carousel">
            <HeroSlider />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
