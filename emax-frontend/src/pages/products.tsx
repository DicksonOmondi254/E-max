import { useEffect, useState } from "react";
import "./Products.css";

import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard/ProductCard";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string;
  featured: boolean;
  stock: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    productService
      .getProducts()
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

  return (
    <div className="products-page">
      <h1>Shop</h1>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;





