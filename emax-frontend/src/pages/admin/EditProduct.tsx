import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { brandService } from "../../services/brandService";

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

const EditProduct = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    brandId: "",
    featured: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoryData, brandData, product] =
        await Promise.all([
          categoryService.getAllCategories(),
          brandService.getAllBrands(),
          productService.getProduct(Number(id)),
        ]);

      setCategories(categoryData);
      setBrands(brandData);

      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: String(product.price),
        stock: String(product.stock),
        categoryId: String(product.category.id),
        brandId: String(product.brand.id),
        featured: product.featured,
      });

      if (product.thumbnail) {
        setPreview(
          `http://localhost:5000/uploads/products/${product.thumbnail}`
        );
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load product.");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", form.name);
      data.append("slug", form.slug);
      data.append(
        "description",
        form.description
      );
      data.append("price", form.price);
      data.append("stock", form.stock);
      data.append(
        "categoryId",
        form.categoryId
      );
      data.append("brandId", form.brandId);
      data.append(
        "featured",
        String(form.featured)
      );

      if (image) {
        data.append("image", image);
      }

      await productService.updateProduct(
        Number(id),
        data
      );

      alert("Product updated successfully.");

      navigate("/admin/products");
    } catch (error: any) {
      console.error(error);

      alert(
        error.message ||
          "Failed to update product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h1>Edit Product</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) =>
            setForm({
              ...form,
              stock: e.target.value,
            })
          }
        />

        <select
          value={form.categoryId}
          onChange={(e) =>
            setForm({
              ...form,
              categoryId:
                e.target.value,
            })
          }
        >
          <option value="">
            Select Category
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={form.brandId}
          onChange={(e) =>
            setForm({
              ...form,
              brandId: e.target.value,
            })
          }
        >
          <option value="">
            Select Brand
          </option>

          {brands.map((brand) => (
            <option
              key={brand.id}
              value={brand.id}
            >
              {brand.name}
            </option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              setForm({
                ...form,
                featured:
                  e.target.checked,
              })
            }
          />

          Featured Product
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file =
              e.target.files?.[0];

            if (!file) return;

            setImage(file);

            setPreview(
              URL.createObjectURL(file)
            );
          }}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            width={180}
            style={{
              display: "block",
              marginTop: "15px",
              borderRadius: "8px",
            }}
          />
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Updating..."
            : "Update Product"}
        </button>

      </form>
    </div>
  );
};

export default EditProduct;