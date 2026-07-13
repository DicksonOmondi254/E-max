import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
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

interface Props {
  products: Product[];
  onDelete: (id: number) => void;
}

const ProductTable = ({
  products,
  onDelete,
}: Props) => {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <h3>No products found.</h3>

        <p>Create your first product to get started.</p>

        <Link
          className="btn-primary"
          to="/admin/products/new"
        >
          Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Featured</th>
            <th>Status</th>
            <th style={{ width: "170px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={
                    product.thumbnail
                      ? `http://localhost:5000/uploads/products/${product.thumbnail}`
                      : "/images/no-image.png"
                  }
                  alt={product.name}
                  width={70}
                  height={70}
                  loading="lazy"
                  onError={(e) => {
                    (
                      e.currentTarget as HTMLImageElement
                    ).src = "/images/no-image.png";
                  }}
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </td>

              <td>
                <Link
                  to={`/products/${product.id}`}
                  style={{
                    fontWeight: 600,
                    textDecoration: "none",
                    color: "#2563eb",
                  }}
                >
                  {product.name}
                </Link>

                <br />

                <small>#{product.id}</small>
              </td>

              <td>{product.category?.name ?? "-"}</td>

              <td>{product.brand?.name ?? "-"}</td>

              <td>
                KES {product.price.toLocaleString()}
              </td>

              <td>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    color: "#fff",
                    background:
                      product.stock > 0
                        ? "#16a34a"
                        : "#dc2626",
                  }}
                >
                  {product.stock}
                </span>
              </td>

              <td>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    background: product.featured
                      ? "#facc15"
                      : "#e5e7eb",
                    color: product.featured
                      ? "#000"
                      : "#555",
                  }}
                >
                  {product.featured
                    ? "⭐ Featured"
                    : "Normal"}
                </span>
              </td>

              <td>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    color: "#fff",
                    background: product.active
                      ? "#2563eb"
                      : "#6b7280",
                  }}
                >
                  {product.active
                    ? "Active"
                    : "Inactive"}
                </span>
              </td>

              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <Link
                    className="btn-edit"
                    to={`/admin/products/edit/${product.id}`}
                  >
                    Edit
                  </Link>

                  <button
                    className="btn-delete"
                    onClick={() =>
                      onDelete(product.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;