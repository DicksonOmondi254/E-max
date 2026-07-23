const API_URL = "http://localhost:5000/api/dashboard/me";

const getToken = () => localStorage.getItem("token");

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export interface CustomerDashboardStats {
  ordersCount: number;
  wishlistCount: number;
  rewardPoints: number;
}

export interface CustomerRecentOrder {
  id: string;
  product: string;
  status: string;
  total: number;
  productImage?: string;
  orderDate?: string;
}

export interface CustomerWishlistItem {
  id: number;
  name: string;
  brand?: string | null;
  image?: string | null;
  price?: number | null;
  slug?: string | null;
}

export const customerDashboardService = {
  async getOverview(): Promise<CustomerDashboardStats> {
    const response = await fetch(`${API_URL}/overview`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to load dashboard overview");
    const result = await response.json();
    return result.data;
  },

  async getRecentOrders(): Promise<CustomerRecentOrder[]> {
    const response = await fetch(`${API_URL}/recent-orders`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to load recent orders");
    const result = await response.json();
    return result.data || [];
  },

  async getWishlist(): Promise<CustomerWishlistItem[]> {
    const response = await fetch(`${API_URL}/wishlist`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to load wishlist");
    const result = await response.json();
    return result.data || [];
  },
};

