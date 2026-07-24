import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";

import { productService } from "../services/productService";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addToCart } from "../redux/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
  selectIsInWishlist,
} from "../redux/wishlistSlice";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: string;
  featured: boolean;

  category: {
    name: string;
  };

  brand: {
    name: string;
  };
}

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const id = params.id ?? params.slug;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  const isInWishlist = useAppSelector(selectIsInWishlist(product?.id ?? 0));
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Load wishlist on mount if authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchWishlist());
    }
  }, [dispatch]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) return;
        const data = await productService.getProduct(Number(id));
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleToggleWishlist = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!product) return;

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(product.id)).unwrap();
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    } finally {
      setWishlistLoading(false);
    }
  }, [dispatch, isInWishlist, product, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        image: `http://localhost:5000/uploads/products/${product.thumbnail}`,
        price: product.price,
        quantity: 1,
      })
    );
  };

  if (loading) {
    return <h2>Loading product...</h2>;
  }

  if (!product) {
    return <h2>Product not found.</h2>;
  }

  const imageUrl = product.thumbnail
    ? `http://localhost:5000/uploads/products/${product.thumbnail}`
    : "/images/no-image.svg";

  return (
    <div className="product-details">
      <div className="product-image">
        <img src={imageUrl} alt={product.name} />
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>

        <h3>KES {product.price.toLocaleString()}</h3>

        <p>{product.description}</p>

        <p>
          <strong>Brand:</strong> {product.brand.name}
        </p>

        <p>
          <strong>Category:</strong> {product.category.name}
        </p>

        <p>
          <strong>Stock:</strong> {product.stock}
        </p>

        <div className="product-details-actions" style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button
            className="cart-btn"
            disabled={product.stock <= 0}
            onClick={handleAddToCart}
            style={{ flex: 1 }}
          >
            <FaShoppingCart /> {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>

          <button
            className={`wishlist-btn ${isInWishlist ? "in-wishlist" : ""}`}
            onClick={handleToggleWishlist}
            disabled={wishlistLoading}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            style={{
              padding: "12px 20px",
              borderRadius: 8,
              border: `2px solid ${isInWishlist ? "#ef4444" : "#e2e8f0"}`,
              background: isInWishlist ? "rgba(239,68,68,0.08)" : "#fff",
              color: isInWishlist ? "#ef4444" : "#94a3b8",
              cursor: "pointer",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s ease",
            }}
          >
            {isInWishlist ? <FaHeart /> : <FaRegHeart />}
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {wishlistLoading ? "..." : isInWishlist ? "Saved" : "Save"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
