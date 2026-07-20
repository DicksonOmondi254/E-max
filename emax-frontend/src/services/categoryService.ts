const API_URL = "http://localhost:5000/api/categories";

const getToken = () => localStorage.getItem("token");

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export interface CategoryData {
  id: number;
  name: string;
  description?: string | null;
  _count?: {
    products: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const categoryService = {
  async getAllCategories(): Promise<CategoryData[]> {
    const response = await fetch(API_URL);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch categories.");
    }

    return result.data;
  },

  async getCategoryById(id: number): Promise<CategoryData> {
    const response = await fetch(`${API_URL}/${id}`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch category.");
    }

    return result.data;
  },

  async createCategory(data: { name: string; description?: string }) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create category.");
    }

    return result.data;
  },

  async updateCategory(id: number, data: { name?: string; description?: string }) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update category.");
    }

    return result.data;
  },

  async deleteCategory(id: number) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete category.");
    }

    return result;
  },
};

