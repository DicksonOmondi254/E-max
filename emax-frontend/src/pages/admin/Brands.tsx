import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { brandService } from "../../services/brandService";

interface Brand {
  id: number;
  name: string;
  logo?: string | null;
  _count?: {
    products: number;
  };
}

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadBrands = async () => {
    try {
      setLoading(true);

      const data = await brandService.getAllBrands();

      setBrands(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load brands.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Delete this brand?"
    );

    if (!confirmDelete) return;

    try {
      await brandService.deleteBrand(id);

      setBrands((prev) =>
        prev.filter((brand) => brand.id !== id)
      );
    } catch (error: any) {
      alert(error.message);
    }
  };

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) =>
      brand.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [brands, search]);

  if (loading) {
    return <h2>Loading brands...</h2>;
  }

  return (
    <div className="admin-page">

      <div className="page-header">
        <h1>Brands</h1>

        <Link
          to="/admin/brands/new"
          className="btn-primary"
        >
          + New Brand
        </Link>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search brands..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <table className="admin-table">

        <thead>
          <tr>
            <th>Logo</th>
            <th>Name</th>
            <th>Products</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {filteredBrands.length === 0 ? (
            <tr>
              <td colSpan={4}>
                No brands found.
              </td>
            </tr>
          ) : (
            filteredBrands.map((brand) => (
              <tr key={brand.id}>

                <td>
                  {brand.logo ? (
                    <img
                      src={`http://localhost:5000/uploads/brands/${brand.logo}`}
                      alt={brand.name}
                      width={60}
                    />
                  ) : (
                    "No Logo"
                  )}
                </td>

                <td>{brand.name}</td>

                <td>
                  {brand._count?.products ?? 0}
                </td>

                <td>

                  <Link
                    to={`/admin/brands/edit/${brand.id}`}
                  >
                    Edit
                  </Link>

                  {" | "}

                  <button
                    onClick={() =>
                      handleDelete(brand.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
};

export default Brands;