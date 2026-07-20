import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { productService } from "../services/productService";

import ProductCard from "../components/ProductCard/ProductCard";

import "./Products.css";

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string;
  featured: boolean;
  stock: number;
  active?: boolean;
  category: {
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
};

const BrandProducts = () => {
  const params = useParams();
  const brandIdParam = params.id;

  const brandId = brandIdParam ? Number(brandIdParam) : NaN;

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts();
        setProducts(data as Product[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    if (!Number.isFinite(brandId)) return [];

    return (products ?? []).filter((p) => {
      const pBrandId = p.brand?.id;

      // A product MUST match the brand relationship as created by the admin.
      // If the backend does not provide brand.id for a product, we exclude it.
      const matchesBrand = pBrandId === brandId;
      const pActiveOk = p.active === undefined || p.active === true;
      const pStockOk = (p.stock ?? 0) > 0;

      return matchesBrand && pActiveOk && pStockOk;
    });
  }, [products, brandId]);

  return (
    <div className="products-page">
      <h1>Brand Products</h1>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="products-grid">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandProducts;

