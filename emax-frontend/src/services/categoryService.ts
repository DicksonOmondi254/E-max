const API_URL = "http://localhost:5000/api/categories";

export const categoryService = {
  async getAllCategories() {
    const response = await fetch(API_URL);

    const result = await response.json();

    return result.data;
  },
};