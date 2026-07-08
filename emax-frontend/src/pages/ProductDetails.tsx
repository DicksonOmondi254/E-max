import ProductGallery from "../components/ProductDetails/ProductGallery";
import ProductInfo from "../components/ProductDetails/ProductInfo";
import ProductTabs from "../components/ProductDetails/ProductTabs";
import RelatedProducts from "../components/ProductDetails/RelatedProducts";

import "../components/ProductDetails/ProductDetails.css";

const ProductDetails = () => {
  return (
    <div className="product-details-page">
      <div className="product-main">
        <ProductGallery />
        <ProductInfo />
      </div>

      <ProductTabs />
      <RelatedProducts />
    </div>
  );
};

export default ProductDetails;