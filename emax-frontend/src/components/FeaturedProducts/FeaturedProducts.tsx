import { useEffect, useMemo, useState } from "react";

import ProductCard from "../ProductCard/ProductCard";

import { productService } from "../../services/productService";

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
    // Admin controls `featured`; just show active featured items.
    return products
      .filter((p) => p.featured && p.active)
      .slice(0, 8);
  }, [products]);

  return (
    <section style={{ padding: "60px" }}>
      <h2>Featured Products</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {featured.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

