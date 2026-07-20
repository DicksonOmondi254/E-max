import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { productService } from "../services/productService";

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
  const id = params.id ?? params.slug;



  const [loading, setLoading] = useState(true);


  const [product, setProduct] =
    useState<Product | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) return;

        const data =
          await productService.getProduct(Number(id));

        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return <h2>Loading product...</h2>;
  }

  if (!product) {
    return <h2>Product not found.</h2>;
  }

  return (
    <div className="product-details">

      <div className="product-image">

        <img
          src={`http://localhost:5000/uploads/products/${product.thumbnail}`}
          alt={product.name}
        />

      </div>

      <div className="product-info">

        <h1>{product.name}</h1>

        <h3>
          KES {product.price.toLocaleString()}
        </h3>

        <p>{product.description}</p>

        <p>
          <strong>Brand:</strong>{" "}
          {product.brand.name}
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {product.category.name}
        </p>

        <p>
          <strong>Stock:</strong>{" "}
          {product.stock}
        </p>

        <button>Add to Cart</button>

      </div>

    </div>
  );
};

export default ProductDetails;