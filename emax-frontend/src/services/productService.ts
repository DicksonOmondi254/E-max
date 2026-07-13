const API_URL = "http://localhost:5000/api/products";

const getToken = () => localStorage.getItem("token");

const getHeaders = (isFormData = false): HeadersInit => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${getToken()}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const handleResponse = async (response: Response) => {
  const result = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    throw new Error(
      result.message || "Something went wrong."
    );
  }

  return result;
};

export const productService = {
  async getProducts(
    query: string = ""
  ) {
    try {
      const response = await fetch(
        `${API_URL}${query}`,
        {
          method: "GET",
        }
      );

      const result =
        await handleResponse(response);

      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getProduct(id: number) {
    try {
      const response = await fetch(
        `${API_URL}/${id}`
      );

      const result =
        await handleResponse(response);

      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async createProduct(data: FormData) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(true),
        body: data,
      });

      const result =
        await handleResponse(response);

      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async updateProduct(
    id: number,
    data: FormData
  ) {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "PUT",
          headers: getHeaders(true),
          body: data,
        }
      );

      const result =
        await handleResponse(response);

      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async deleteProduct(id: number) {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          headers: getHeaders(true),
        }
      );

      const result =
        await handleResponse(response);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getFeaturedProducts() {
    const response = await fetch(
      `${API_URL}?featured=true`
    );

    const result =
      await handleResponse(response);

    return result.data;
  },

  async getProductsByCategory(
    categoryId: number
  ) {
    const response = await fetch(
      `${API_URL}?category=${categoryId}`
    );

    const result =
      await handleResponse(response);

    return result.data;
  },

  async searchProducts(keyword: string) {
    const response = await fetch(
      `${API_URL}?search=${encodeURIComponent(
        keyword
      )}`
    );

    const result =
      await handleResponse(response);

    return result.data;
  },
};