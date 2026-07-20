const API_URL = "http://localhost:5000/api/dashboard";

const getToken = () => localStorage.getItem("token");

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export interface RecentOrder {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  createdAt: string;
}

export interface DashboardStats {
  products: number;
  categories: number;
  brands: number;
  customers: number;
  featuredProducts: number;
  reviews: number;
  orders: number;
  pendingOrders: number;
  deliveredOrders: number;
  revenue: number;
  recentOrders: RecentOrder[];
}

export const dashboardService = {
  async getDashboard(): Promise<DashboardStats> {
    const response = await fetch(API_URL, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to load dashboard.");
    }

    const result = await response.json();
    return result.data;
  },
};
