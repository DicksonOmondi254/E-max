const API_URL = "http://localhost:5000/api/products";

const getToken = () => localStorage.getItem("token");

const getHeaders = (
  isFormData = false
): HeadersInit => {
  const headers: HeadersInit = {};

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const handleResponse = async (
  response: Response
) => {
  const result = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    throw new Error(
      result.message ||
        result.error ||
        "Something went wrong."
    );
  }

  return result;
};

export const productService = {
  /* =====================================
     GET ALL PRODUCTS
  ===================================== */

  async getProducts(query = "") {
    const response = await fetch(
      `${API_URL}${query}`
    );

    const result =
      await handleResponse(response);

    return result.data;
  },

  /* =====================================
     GET PRODUCT BY ID
  ===================================== */

  async getProduct(id: number) {
    const response = await fetch(
      `${API_URL}/${id}`
    );

    const result =
      await handleResponse(response);

    return result.data;
  },

  /* =====================================
     GET PRODUCT BY SLUG
  ===================================== */

  async getProductBySlug(slug: string) {
    const response = await fetch(
      `${API_URL}/slug/${encodeURIComponent(slug)}`
    );

    const result =
      await handleResponse(response);

    return result.data;
  },

  /* =====================================
     CREATE PRODUCT
  ===================================== */

  async createProduct(data: FormData) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getHeaders(true),
      body: data,
    });

    const result =
      await handleResponse(response);

    return result.data;
  },

  /* =====================================
     UPDATE PRODUCT
  ===================================== */

  async updateProduct(
    id: number,
    data: FormData
  ) {
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
  },

  /* =====================================
     DELETE PRODUCT
  ===================================== */

  async deleteProduct(id: number) {
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );

    return handleResponse(response);
  },

  /* =====================================
     FEATURED PRODUCTS
  ===================================== */

  async getFeaturedProducts() {
    const response = await fetch(
      `${API_URL}?featured=true`
    );

    const result =
      await handleResponse(response);

    return result.data;
  },

  /* =====================================
     PRODUCTS BY CATEGORY
  ===================================== */

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

  /* =====================================
     SEARCH PRODUCTS
  ===================================== */

  async searchProducts(
    keyword: string
  ) {
    const response = await fetch(
      `${API_URL}?search=${encodeURIComponent(
        keyword
      )}`
    );

    const result =
      await handleResponse(response);

    return result.data;
  },

  /* =====================================
     TOGGLE FEATURED
  ===================================== */

  async toggleFeatured(id: number) {
    const response = await fetch(
      `${API_URL}/${id}/toggle-featured`,
      {
        method: "PATCH",
        headers: getHeaders(),
      }
    );

    const result =
      await handleResponse(response);

    return result.data;
  },

  /* =====================================
     TOGGLE ACTIVE STATUS
  ===================================== */

  async toggleStatus(id: number) {
    const response = await fetch(
      `${API_URL}/${id}/toggle-status`,
      {
        method: "PATCH",
        headers: getHeaders(),
      }
    );

    const result =
      await handleResponse(response);

    return result.data;
  },
};