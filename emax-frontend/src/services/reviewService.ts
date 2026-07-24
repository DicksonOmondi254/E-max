const API_BASE = "http://localhost:5000/api/reviews";

const getToken = () => localStorage.getItem("token");

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export interface AdminReview {
  id: number;
  rating: number;
  comment: string;
  productId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  product: {
    id: number;
    name: string;
    slug: string;
    thumbnail: string;
  };
}

export interface CustomerReview {
  id: number;
  rating: number;
  comment: string;
  productId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  distribution: Record<number, number>;
}

export interface ReviewsResponse {
  success: boolean;
  reviews: AdminReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductReviewsResponse {
  success: boolean;
  totalReviews: number;
  averageRating: number;
  data: CustomerReview[];
}

export const reviewService = {
  /* ==========================================
     CUSTOMER: GET PRODUCT REVIEWS
  ========================================== */
  async getProductReviews(productId: number): Promise<ProductReviewsResponse> {
    const response = await fetch(`${API_BASE}/product/${productId}`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch reviews.");
    }

    return result;
  },

  /* ==========================================
     CUSTOMER: CREATE REVIEW
  ========================================== */
  async createReview(productId: number, data: { rating: number; comment: string }) {
    const response = await fetch(`${API_BASE}/product/${productId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to submit review.");
    }

    return result;
  },

  /* ==========================================
     CUSTOMER: UPDATE REVIEW
  ========================================== */
  async updateReview(id: number, data: { rating: number; comment: string }) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update review.");
    }

    return result;
  },

  /* ==========================================
     CUSTOMER: DELETE REVIEW
  ========================================== */
  async deleteCustomerReview(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete review.");
    }
  },

  /* ==========================================
     ADMIN: GET ALL REVIEWS
  ========================================== */
  async getAllReviews(): Promise<ReviewsResponse> {
    const response = await fetch(API_BASE, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch reviews.");
    }

    return result;
  },

  /* ==========================================
     ADMIN: GET REVIEW STATS
  ========================================== */
  async getReviewStats(): Promise<ReviewStats> {
    const response = await fetch(`${API_BASE}/stats`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch review stats.");
    }

    return result.data;
  },

  /* ==========================================
     ADMIN: DELETE REVIEW
  ========================================== */
  async deleteReview(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete review.");
    }
  },
};
