import { Link } from "react-router-dom";
import "./HotCategories.css";

type HotCategory = {
  id: number;
  name: string;
  tagline: string;
  emoji: string;
  image: string;
  bg: string;
};

const HOT_CATEGORIES: HotCategory[] = [
  {
    id: 1,
    name: "Smartphones",
    tagline: "Latest flagships",
    emoji: "📱",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80",
    bg: "#f3ecf9",
  },
  {
    id: 2,
    name: "Laptops",
    tagline: "Power & portability",
    emoji: "💻",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
    bg: "#eef3ff",
  },
  {
    id: 3,
    name: "Audio",
    tagline: "Sound that moves you",
    emoji: "🎧",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80",
    bg: "#fdf0e8",
  },
  {
    id: 4,
    name: "Gaming",
    tagline: "Win every frame",
    emoji: "🎮",
    image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=400&q=80",
    bg: "#eafaf1",
  },
  {
    id: 5,
    name: "Wearables",
    tagline: "Smart on your wrist",
    emoji: "⌚",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80",
    bg: "#fff4e5",
  },
];

const HotCategories = () => {
  return (
    <section className="hot-cats">
      <div className="page-wrapper">
        <div className="section-title">
          <h2>🔥 Hot Categories</h2>
          <Link to="/products">Browse All →</Link>
        </div>

        <div className="hot-cats__grid">
          {HOT_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?search=${encodeURIComponent(cat.name)}`}
              className="hot-cats__card"
              style={{ background: cat.bg }}
            >
              <div className="hot-cats__media">
                <img src={cat.image} alt={cat.name} loading="lazy" />
                <span className="hot-cats__emoji">{cat.emoji}</span>
              </div>
              <div className="hot-cats__label">
                <strong>{cat.name}</strong>
                <span>{cat.tagline}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotCategories;

