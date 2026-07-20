import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { brandService } from "../../services/brandService";

const CreateBrand = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "",
    logo: null as File | null,
    preview: "",
  });

  useEffect(() => {
    return () => {
      if (form.preview) URL.revokeObjectURL(form.preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateForm = () => {
    const validationErrors: string[] = [];

    if (!form.name.trim()) {
      validationErrors.push("Brand name is required.");
    }

    if (!form.logo) {
      validationErrors.push("Brand logo is required.");
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors(["Please select a valid image file."]);
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setErrors([]);
    setForm((prev) => ({
      ...prev,
      logo: file,
      preview: previewUrl,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors([]);

      const data = new FormData();
      data.append("name", form.name.trim());
      if (form.logo) data.append("logo", form.logo);

      await brandService.createBrand(data);

      alert("Brand created successfully.");
      navigate("/admin/brands");
    } catch (error: any) {
      console.error(error);
      setErrors([
        error?.message || "Failed to create brand.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h1>Create Brand</h1>

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
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Brand Name"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />

        <div style={{ marginTop: 10 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
          />
        </div>

        {form.preview && (
          <div style={{ marginTop: 15 }}>
            <img
              src={form.preview}
              alt="Brand logo preview"
              width={120}
              style={{ display: "block", borderRadius: 8 }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: 20 }}
        >
          {loading ? "Saving Brand..." : "Save Brand"}
        </button>
      </form>
    </div>
  );
};

export default CreateBrand;
