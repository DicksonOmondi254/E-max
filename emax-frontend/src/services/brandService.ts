const API_URL = "http://localhost:5000/api/brands";

const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export interface BrandData {
  name: string;
  logo?: string;
}

export const brandService = {
  async getAllBrands() {
    const response = await fetch(API_URL);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch brands.");
    }

    return result.data;
  },

  async getBrandById(id: number) {
    const response = await fetch(`${API_URL}/${id}`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch brand.");
    }

    return result.data;
  },

  async createBrand(data: FormData) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getHeaders(),
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create brand.");
    }

    return result.data;
  },

  async updateBrand(id: number, data: FormData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update brand.");
    }

    return result.data;
  },

  async deleteBrand(id: number) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete brand.");
    }

    return result;
  },
};