import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import { productService } from "../../services/productService";
import "./FeaturedProducts.css";

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string;
  featured: boolean;
  stock: number;
  active: boolean;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productService.getFeaturedProducts();
        setProducts(data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

const featured = useMemo(() => {
    return products.filter((p) => p.featured && p.active).slice(0, 8);
  }, [products]);

  // Hide the section entirely when there are no featured products to avoid
  // showing an empty/"unfinished" section on the landing page.
  if (featured.length === 0) return null;

  return (
    <section className="fp-section">
      <div className="page-wrapper">
        <div className="section-title">
          <h2>Featured Products</h2>
          <Link to="/products">View All →</Link>
        </div>

        <div className="fp-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

