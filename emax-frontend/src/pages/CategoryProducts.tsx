import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { productService } from "../services/productService";

import ProductCard from "../components/ProductCard/ProductCard";

import "./Products.css";

type CategoryProductsPageProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string;
  featured: boolean;
  stock: number;
  active?: boolean;
  category?: {
    id?: number;
    name?: string;
  };
};

const CategoryProducts = () => {
  const params = useParams();
  const categoryIdParam = params.id;

  const categoryId = categoryIdParam ? Number(categoryIdParam) : NaN;

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<CategoryProductsPageProduct[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts();
        setProducts(data as CategoryProductsPageProduct[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);


  const filtered = useMemo(() => {
    if (!Number.isFinite(categoryId)) return [];

    return (products ?? []).filter((p) => {
      const pCategoryId = p.category?.id;
      const matchesCategory = pCategoryId === categoryId;

      const pActiveOk = p.active === undefined || p.active === true;
      const pStockOk = (p.stock ?? 0) > 0;

      return matchesCategory && pActiveOk && pStockOk;
    });
  }, [products, categoryId]);

  return (
    <div className="products-page">
      <h1>Category Products</h1>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="products-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;

