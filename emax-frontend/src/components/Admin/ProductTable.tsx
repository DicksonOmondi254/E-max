import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaImage,
  FaBox,
  FaStar,
} from "react-icons/fa";

const API_BASE = "http://localhost:5000";

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

interface Props {
  products: Product[];
  onDelete: (id: number) => Promise<void>;
  onToggleFeatured: (id: number) => Promise<void>;
  onToggleStatus: (id: number) => Promise<void>;
  loading?: boolean;
}

const getStockBadge = (stock: number) => {
  if (stock === 0) {
    return { className: "badge-stock--out", label: "Out of Stock" };
  }
  if (stock <= 5) {
    return { className: "badge-stock--low", label: `${stock} left` };
  }
  return { className: "badge-stock--in", label: `${stock} in stock` };
};

const ProductTable = ({
  products,
  onDelete,
  onToggleFeatured,
  onToggleStatus,
  loading,
}: Props) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<number | null>(null);
  const [togglingStatusId, setTogglingStatusId] = useState<number | null>(null);

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await onDelete(id);
      setConfirmDeleteId(null);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      setTogglingFeaturedId(id);
      await onToggleFeatured(id);
    } finally {
      setTogglingFeaturedId(null);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      setTogglingStatusId(id);
      await onToggleStatus(id);
    } finally {
      setTogglingStatusId(null);
    }
  };

  if (loading) {
    return (
      <div className="table-responsive">
        <table className="products-table">
          <thead>
            <tr>
              <th className="products-th-image">Image</th>
              <th className="products-th-product">Product</th>
              <th className="products-th-category">Category</th>
              <th className="products-th-brand">Brand</th>
              <th className="products-th-price">Price</th>
              <th className="products-th-stock">Stock</th>
              <th className="products-th-featured">Featured</th>
              <th className="products-th-status">Status</th>
              <th className="products-th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, idx) => (
              <tr key={`skel-${idx}`} className="skeleton-row">
                <td>
                  <div className="skeleton-cell products-skeleton-cell--image" />
                </td>
                <td>
                  <div className="skeleton-cell products-skeleton-cell--product" />
                </td>
                <td>
                  <div className="skeleton-cell products-skeleton-cell--text" />
                </td>
                <td>
                  <div className="skeleton-cell products-skeleton-cell--text" />
                </td>
                <td>
                  <div className="skeleton-cell products-skeleton-cell--price" />
                </td>
                <td>
                  <div className="skeleton-cell products-skeleton-cell--badge" />
                </td>
                <td>
                  <div className="skeleton-cell products-skeleton-cell--badge" />
                </td>
                <td>
                  <div className="skeleton-cell products-skeleton-cell--badge" />
                </td>
                <td>
                  <div className="skeleton-cell products-skeleton-cell--actions" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <FaBox className="empty-icon" />
        <h3>No products found.</h3>
        <p>Create your first product to get started.</p>
        <Link
          className="btn btn-primary"
          to="/admin/products/new"
          style={{ marginTop: 16, display: "inline-flex" }}
        >
          Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="products-table">
        <thead>
          <tr>
            <th className="products-th-image">Image</th>
            <th className="products-th-product">Product</th>
            <th className="products-th-category">Category</th>
            <th className="products-th-brand">Brand</th>
            <th className="products-th-price">Price</th>
            <th className="products-th-stock">Stock</th>
            <th className="products-th-featured">Featured</th>
            <th className="products-th-status">Status</th>
            <th className="products-th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stockBadge = getStockBadge(product.stock);

            return (
              <tr key={product.id} className="product-row">
                {/* Image */}
                <td>
                  <div className="product-image-cell">
                    {product.thumbnail ? (
                      <img
                        src={`${API_BASE}/uploads/products/${product.thumbnail}`}
                        alt={product.name}
                        className="product-table-img"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://via.placeholder.com/56?text=N/A";
                        }}
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        <FaImage />
                      </div>
                    )}
                  </div>
                </td>

                {/* Product Name */}
                <td>
                  <div className="product-name-cell">
                    <Link
                      to={`/products/${product.id}`}
                      className="product-name-link"
                      title={product.name}
                    >
                      {product.name}
                    </Link>
                    <span className="product-id-text">#{product.id}</span>
                  </div>
                </td>

                {/* Category */}
                <td>
                  <span className="product-meta-text">
                    {product.category?.name ?? "-"}
                  </span>
                </td>

                {/* Brand */}
                <td>
                  <span className="product-meta-text">
                    {product.brand?.name ?? "-"}
                  </span>
                </td>

                {/* Price */}
                <td className="products-td-price">
                  <span className="product-price-text">
                    KES {Number(product.price).toLocaleString()}
                  </span>
                </td>

                {/* Stock */}
                <td className="products-td-stock">
                  <span className={`badge-stock ${stockBadge.className}`}>
                    {stockBadge.label}
                  </span>
                </td>

                {/* Featured Toggle */}
                <td>
                  <button
                    className={`toggle-badge ${
                      product.featured
                        ? "toggle-badge--featured"
                        : "toggle-badge--normal"
                    }`}
                    onClick={() => handleToggleFeatured(product.id)}
                    disabled={togglingFeaturedId === product.id}
                    title={
                      product.featured
                        ? "Unmark as featured"
                        : "Mark as featured"
                    }
                  >
                    {togglingFeaturedId === product.id ? (
                      <FaSpinner className="spin" />
                    ) : (
                      <FaStar />
                    )}
                    {product.featured ? "Featured" : "Normal"}
                  </button>
                </td>

                {/* Status Toggle */}
                <td>
                  <button
                    className={`toggle-badge ${
                      product.active
                        ? "toggle-badge--active"
                        : "toggle-badge--inactive"
                    }`}
                    onClick={() => handleToggleStatus(product.id)}
                    disabled={togglingStatusId === product.id}
                    title={product.active ? "Deactivate" : "Activate"}
                  >
                    {togglingStatusId === product.id ? (
                      <FaSpinner className="spin" />
                    ) : product.active ? (
                      <FaCheck />
                    ) : (
                      <FaTimes />
                    )}
                    {product.active ? "Active" : "Inactive"}
                  </button>
                </td>

                {/* Actions */}
                <td>
                  <div className="product-actions-group">
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="product-action-btn product-action-btn--edit"
                      title="Edit product"
                    >
                      <FaEdit />
                    </Link>

                    {confirmDeleteId === product.id ? (
                      <div className="product-delete-confirm">
                        <span className="delete-confirm-text">Delete?</span>
                        <div className="delete-confirm-actions">
                          <button
                            className="delete-confirm-yes"
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                          >
                            {deletingId === product.id ? (
                              <FaSpinner className="spin" />
                            ) : (
                              <FaCheck />
                            )}
                          </button>
                          <button
                            className="delete-confirm-no"
                            onClick={cancelDelete}
                            disabled={deletingId === product.id}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="product-action-btn product-action-btn--delete"
                        title="Delete product"
                        onClick={() => setConfirmDeleteId(product.id)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;

