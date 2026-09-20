import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaHeart,
  FaRegHeart,
  FaShieldAlt,
  FaShoppingCart,
  FaStar,
  FaTruck,
} from "react-icons/fa";

import ProductTabs from "../components/ProductDetails/ProductTabs";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addToCart } from "../redux/cartSlice";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from "../redux/wishlistSlice";
import { productService } from "../services/productService";
import "../components/ProductDetails/ProductDetails.css";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: string;
  featured: boolean;
  category?: {
    name?: string;
  };
  brand?: {
    name?: string;
  };
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const productKey = params.id ?? params.slug;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  const isInWishlist = useAppSelector(selectIsInWishlist(product?.id ?? 0));
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchWishlist());
    }
  }, [dispatch]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!productKey) return;

        const normalizedKey = String(productKey);
        const asNumber = Number(normalizedKey);
        const data =
          !Number.isNaN(asNumber) && String(asNumber) === normalizedKey
            ? await productService.getProduct(asNumber)
            : await productService.getProductBySlug(normalizedKey);

        setProduct(data);
        setActiveImage(
          data?.thumbnail
            ? `http://localhost:5000/uploads/products/${data.thumbnail}`
            : "/images/no-image.svg"
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productKey]);

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
  }, [dispatch, isInWishlist, navigate, product]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;

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
    return <h2 className="product-details-empty">Loading product...</h2>;
  }

  if (!product) {
    return <h2 className="product-details-empty">Product not found.</h2>;
  }

  const imageUrl = product.thumbnail
    ? `http://localhost:5000/uploads/products/${product.thumbnail}`
    : "/images/no-image.svg";

  const galleryImages = [imageUrl, imageUrl, imageUrl];
  const stockLabel = product.stock > 0 ? `${product.stock} in stock` : "Out of stock";

  return (
    <div className="product-details-page">
      <button className="product-details-back" onClick={() => navigate(-1)} type="button">
        <FaArrowLeft />
        Back
      </button>

      <div className="product-details-hero">
        <div className="product-details-gallery">
          <div className="product-gallery-main">
            <img src={activeImage || imageUrl} alt={product.name} />
          </div>

          <div className="product-gallery-thumbs">
            {galleryImages.map((thumb, index) => (
              <button
                key={`${product.id}-thumb-${index}`}
                type="button"
                className={`product-gallery-thumb ${activeImage === thumb ? "active" : ""}`}
                onClick={() => setActiveImage(thumb)}
                aria-label={`View product image ${index + 1}`}
              >
                <img src={thumb} alt={`${product.name} view ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-details-summary">
          {product.featured && <span className="product-badge">Featured</span>}

          <p className="product-brand">{product.brand?.name ?? "Premium brand"}</p>
          <h1>{product.name}</h1>

          <div className="product-rating-row">
            <div className="stars" aria-label="4.9 out of 5 stars">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <span>4.9 (128 reviews)</span>
          </div>

          <div className="product-price-block">
            <span className="price-current">{formatPrice(product.price)}</span>
            <span className="price-note">Free shipping & returns</span>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-stat-grid">
            <div className="product-stat-item">
              <span>Brand</span>
              <strong>{product.brand?.name ?? "Premium"}</strong>
            </div>
            <div className="product-stat-item">
              <span>Category</span>
              <strong>{product.category?.name ?? "General"}</strong>
            </div>
            <div className={`product-stat-item stock-item ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
              <span>Status</span>
              <strong>{stockLabel}</strong>
            </div>
          </div>

          <div className="purchase-actions">
            <button className="primary-button" type="button" onClick={handleAddToCart} disabled={product.stock <= 0}>
              <FaShoppingCart />
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>

            <button className="secondary-button" type="button" onClick={() => navigate("/checkout")}>
              Buy now
            </button>

            <button
              className={`icon-toggle ${isInWishlist ? "saved" : ""}`}
              type="button"
              onClick={handleToggleWishlist}
              disabled={wishlistLoading}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isInWishlist ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>

          <div className="purchase-benefits">
            <div>
              <FaTruck />
              Fast delivery
            </div>
            <div>
              <FaShieldAlt />
              Secure payment
            </div>
            <div>
              <FaCheck />
              Quality assured
            </div>
          </div>
        </div>
      </div>

      <ProductTabs productId={product.id} description={product.description} />
    </div>
  );
};

export default ProductDetails;
