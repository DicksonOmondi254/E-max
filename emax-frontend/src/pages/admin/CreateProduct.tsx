import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const CreateProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [errors, setErrors] = useState<string[]>([]);

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
    const loadData = async () => {
      try {
        const [categoryData, brandData] =
          await Promise.all([
            categoryService.getAllCategories(),
            brandService.getAllBrands(),
          ]);

        setCategories(categoryData);
        setBrands(brandData);
      } catch (err) {
        console.error(err);
        alert("Failed to load categories and brands.");
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB.");
      return;
    }

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const validationErrors: string[] = [];

    if (!form.name.trim())
      validationErrors.push("Product name is required.");

    if (!form.description.trim())
      validationErrors.push("Description is required.");

    if (!form.price || Number(form.price) <= 0)
      validationErrors.push("Invalid price.");

    if (!form.stock || Number(form.stock) < 0)
      validationErrors.push("Invalid stock.");

    if (!form.categoryId)
      validationErrors.push("Category is required.");

    if (!form.brandId)
      validationErrors.push("Brand is required.");

    if (!image)
      validationErrors.push("Product image is required.");

    setErrors(validationErrors);

    return validationErrors.length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", form.name);
      data.append(
        "slug",
        form.slug || generateSlug(form.name)
      );
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

      await productService.createProduct(data);

      alert("Product created successfully.");

      setForm({
        name: "",
        slug: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        brandId: "",
        featured: false,
      });

      setImage(null);
      setPreview("");
      setErrors([]);

      navigate("/admin/products");
    } catch (error: any) {
      console.error(error);

      if (error.errors) {
        setErrors(error.errors);
      } else {
        alert(error.message || "Failed to create product.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="admin-page">
      <h1>Create Product</h1>

      {errors.length > 0 && (
        <div
          style={{
            background: "#ffe6e6",
            padding: 15,
            marginBottom: 20,
            borderRadius: 8,
            color: "#c0392b",
          }}
        >
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
              slug: generateSlug(e.target.value),
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
              description: e.target.value,
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
              categoryId: e.target.value,
            })
          }
        >
          <option value="">Select Category</option>

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
          <option value="">Select Brand</option>

          {brands.map((brand) => (
            <option
              key={brand.id}
              value={brand.id}
            >
              {brand.name}
            </option>
          ))}
        </select>

        <label style={{ display: "block", margin: "15px 0" }}>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              setForm({
                ...form,
                featured: e.target.checked,
              })
            }
          />
          {" "}Featured Product
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {preview && (
          <div style={{ marginTop: 15 }}>
            <img
              src={preview}
              alt="Preview"
              width={180}
              style={{
                borderRadius: 8,
                display: "block",
              }}
            />

            <button
              type="button"
              onClick={() => {
                setImage(null);
                setPreview("");
              }}
              style={{ marginTop: 10 }}
            >
              Remove Image
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: 20 }}
        >
          {loading
            ? "Saving Product..."
            : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;