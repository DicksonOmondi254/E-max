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

export const reviewService = {
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
