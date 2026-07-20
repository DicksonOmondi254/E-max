import "./FlashSale.css";


import { useEffect, useMemo, useState } from "react";

import Countdown from "./Countdown";
import FlashSaleCard from "./FlashSaleCard";

import { productService } from "../../services/productService";


type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  thumbnail: string;
  stock: number;
  featured: boolean;
  active: boolean;
};

const FlashSale = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        // No explicit “flashSale” endpoint exists in backend.
        // Use featured products as flash sale inventory for now.
        const data = await productService.getFeaturedProducts();
        setProducts(data);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);

  const flashProducts = useMemo(() => {
    // Create a deterministic “discount” based on current price so UI remains consistent.
    // If you add a backend flash-sale field later, this can be replaced.
    return products
      .filter((p) => p.active && p.stock > 0)
      .slice(0, 4)
      .map((p, idx) => {
        const discount = 8 + idx * 2;
        const oldPrice = Math.round(p.price * (1 + discount / 100));

        return {
          name: p.name,
          image: `http://localhost:5000/uploads/products/${p.thumbnail}`,
          price: p.price,
          oldPrice,
          rating: 4.6,
          discount,
        };
      });
  }, [products]);

  return (
    <section className="flash-sale">
      <div className="flash-header">
        <div>
          <h2>🔥 Flash Sale</h2>
          <p>Limited-time offers on genuine electronics.</p>
        </div>
        <Countdown />
      </div>

      <div className="flash-grid">
        {flashProducts.map((product) => (
          <FlashSaleCard
            key={product.name}
            {...product}
          />
        ))}
      </div>
    </section>
  );
};

export default FlashSale;

