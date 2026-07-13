import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import ProductTable from "../../components/Admin/ProductTable";
import { productService } from "../../services/productService";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  thumbnail: string;
  featured: boolean;
  active: boolean;
  category: {
    id: number;
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [featuredFilter, setFeaturedFilter] =
    useState("all");

  const [activeFilter, setActiveFilter] =
    useState("all");

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data =
        await productService.getProducts();

      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id: number) => {
    const confirmed = window.confirm(
      "Delete this product?"
    );

    if (!confirmed) return;

    try {
      await productService.deleteProduct(id);

      setProducts((prev) =>
        prev.filter((p) => p.id !== id)
      );

      alert("Product deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFeatured =
        featuredFilter === "all"
          ? true
          : featuredFilter === "featured"
          ? product.featured
          : !product.featured;

      const matchesActive =
        activeFilter === "all"
          ? true
          : activeFilter === "active"
          ? product.active
          : !product.active;

      return (
        matchesSearch &&
        matchesFeatured &&
        matchesActive
      );
    });
  }, [
    products,
    search,
    featuredFilter,
    activeFilter,
  ]);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Products</h1>

          <p>
            Total Products:{" "}
            {filteredProducts.length}
          </p>
        </div>

        <Link
          className="btn-primary"
          to="/admin/products/new"
        >
          + Add Product
        </Link>
      </div>

      <div className="table-toolbar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={featuredFilter}
          onChange={(e) =>
            setFeaturedFilter(e.target.value)
          }
        >
          <option value="all">
            All Products
          </option>

          <option value="featured">
            Featured
          </option>

          <option value="normal">
            Normal
          </option>
        </select>

        <select
          value={activeFilter}
          onChange={(e) =>
            setActiveFilter(e.target.value)
          }
        >
          <option value="all">
            All Status
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>
        </select>

        <button
          type="button"
          onClick={loadProducts}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <h3>Loading products...</h3>
      ) : (
        <ProductTable
          products={filteredProducts}
          onDelete={deleteProduct}
        />
      )}
    </div>
  );
};

export default Products;