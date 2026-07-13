import { useEffect, useState } from "react";
import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService
      .getProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div className="products-page">
      <h1>Shop</h1>

      <div className="products-grid">
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;