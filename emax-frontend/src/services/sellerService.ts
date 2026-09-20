const API_URL = "http://localhost:5000/api/seller";

const getToken = () => localStorage.getItem("token");

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

// ─── Types ───

export interface SellerDashboardStats {
  products: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  revenue: number;
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  ordersToday: number;
  ordersWeek: number;
  ordersMonth: number;
  totalCustomers: number;
  averageRating: number;
  totalReviews: number;
  payoutBalance: number;
  nextPayoutDate: string | null;
  salesTrend: SalesTrendPoint[];
  recentOrders: SellerRecentOrder[];
  topProducts: TopProduct[];
}

export interface SalesTrendPoint {
  date: string;
  sales: number;
  orders: number;
}

export interface TopProduct {
  id: number;
  name: string;
  thumbnail: string;
  totalSold: number;
  revenue: number;
  stock: number;
}

export interface SellerRecentOrder {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  createdAt: string;
}

export interface SellerProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: string;
  featured: boolean;
  active: boolean;
  discount: number;
  category: { id: number; name: string } | null;
  brand: { id: number; name: string } | null;
  images: { id: number; image: string }[];
  _count: { reviews: number; orderItems: number };
  createdAt: string;
  updatedAt: string;
}

export interface SellerOrder {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: SellerOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface SellerOrderItem {
  id: number;
  productId: number;
  productName: string;
  productThumbnail: string;
  quantity: number;
  price: number;
}

export interface SellerEarnings {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  pendingPayout: number;
  availableForPayout: number;
  totalCommission: number;
  totalShippingFees: number;
  totalPenalties: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: number;
  orderNumber: string;
  amount: number;
  commission: number;
  shippingFee: number;
  penalty: number;
  netAmount: number;
  status: string;
  date: string;
}

export interface SellerReturnRequest {
  id: number;
  orderNumber: string;
  customerName: string;
  productName: string;
  reason: string;
  images: string[];
  status: string;
  refundStatus: string;
  createdAt: string;
}

export interface SellerReview {
  id: number;
  rating: number;
  comment: string;
  customerName: string;
  productName: string;
  productId: number;
  createdAt: string;
}

export interface SellerPerformance {
  sellerScore: number;
  healthRating: string;
  totalSales: number;
  totalRevenue: number;
  cancellationRate: number;
  returnRate: number;
  averageRating: number;
  responseRate: number;
  responseTime: string;
  salesReport: SalesReportPoint[];
  trafficReport: TrafficReportPoint[];
}

export interface SalesReportPoint {
  month: string;
  sales: number;
  revenue: number;
}

export interface TrafficReportPoint {
  month: string;
  visitors: number;
  pageViews: number;
}

export interface SellerProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shopName: string;
  shopLogo: string;
  shopBanner: string;
  shopDescription: string;
  trustBadges: string[];
  totalProducts: number;
  totalOrders: number;
  joinedDate: string;
}

// ─── Helper ───

const handleResponse = async (response: Response) => {
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw new Error(result.message || "Something went wrong.");
  }
  return result;
};

// ─── Service ───

export const sellerService = {
  // Dashboard
  async getDashboard(): Promise<SellerDashboardStats> {
    const response = await fetch(`${API_URL}/dashboard`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result.data;
  },

  // Products
  async getProducts(params?: {
    search?: string;
    active?: string;
    featured?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: SellerProduct[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.active) query.set("active", params.active);
    if (params?.featured) query.set("featured", params.featured);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    const response = await fetch(`${API_URL}/products${qs ? `?${qs}` : ""}`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result;
  },

  // Orders
  async getOrders(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: SellerOrder[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    const response = await fetch(`${API_URL}/orders${qs ? `?${qs}` : ""}`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result;
  },

  async updateOrderStatus(orderId: number, status: string): Promise<void> {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    await handleResponse(response);
  },

  // Earnings
  async getEarnings(): Promise<SellerEarnings> {
    const response = await fetch(`${API_URL}/earnings`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result.data;
  },

  // Returns
  async getReturns(): Promise<SellerReturnRequest[]> {
    const response = await fetch(`${API_URL}/returns`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result.data;
  },

  // Reviews
  async getReviews(): Promise<SellerReview[]> {
    const response = await fetch(`${API_URL}/reviews`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result.data;
  },

  // Performance
  async getPerformance(): Promise<SellerPerformance> {
    const response = await fetch(`${API_URL}/performance`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result.data;
  },

  // Profile
  async getProfile(): Promise<SellerProfile> {
    const response = await fetch(`${API_URL}/profile`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result.data;
  },

async updateProfile(data: {
    shopName?: string;
    shopDescription?: string;
    phone?: string;
    shopLogo?: string;
    shopBanner?: string;
    trustBadges?: string[];
  }): Promise<void> {
    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    await handleResponse(response);
  },

  // ── Location Management ──
  async getLocation(): Promise<{
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postalCode: string | null;
  }> {
    const response = await fetch(`${API_URL}/location`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result.data;
  },

  async updateLocation(data: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  }): Promise<void> {
    const response = await fetch(`${API_URL}/location`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    await handleResponse(response);
  },

  // ── Deactivation Status Check ──
  async checkDeactivationStatus(): Promise<{ isDeactivated: boolean; message?: string; supportEmail: string }> {
    const response = await fetch(`${API_URL}/deactivation-status`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result.data;
  },

  // Flash Sales
  async getFlashSales(): Promise<any[]> {
    const response = await fetch(`${API_URL}/flash-sales`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result.data;
  },

  async createFlashSale(data: {
    title: string;
    description?: string;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    productIds: number[];
  }): Promise<any> {
    const response = await fetch(`${API_URL}/flash-sales`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await handleResponse(response);
    return result.data;
  },

  async getFlashSaleById(id: number): Promise<any> {
    const response = await fetch(`${API_URL}/flash-sales/${id}`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result.data;
  },

  async deleteFlashSale(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/flash-sales/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    await handleResponse(response);
  },

  // Ad Campaigns
  async getAdCampaigns(): Promise<any[]> {
    const response = await fetch(`${API_URL}/ad-campaigns`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result.data;
  },

  async createAdCampaign(data: {
    name: string;
    description?: string;
    bidType: string;
    dailyBudget: number;
    totalBudget: number;
    startDate: string;
    endDate: string;
    targetGender?: string;
    minAge?: number;
    maxAge?: number;
    targetLocation?: string;
    productIds: number[];
  }): Promise<any> {
    const response = await fetch(`${API_URL}/ad-campaigns`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await handleResponse(response);
    return result.data;
  },

  async getAdCampaignById(id: number): Promise<any> {
    const response = await fetch(`${API_URL}/ad-campaigns/${id}`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result.data;
  },

  async deleteAdCampaign(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/ad-campaigns/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    await handleResponse(response);
  },

  // Bulk Discounts
  async getBulkDiscounts(): Promise<any[]> {
    const response = await fetch(`${API_URL}/bulk-discounts`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result.data;
  },

  async createBulkDiscount(data: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    productIds: number[];
    tiers: {
      minQuantity: number;
      maxQuantity: number;
      discountType: string;
      discountValue: number;
    }[];
  }): Promise<any> {
    const response = await fetch(`${API_URL}/bulk-discounts`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await handleResponse(response);
    return result.data;
  },

  async getBulkDiscountById(id: number): Promise<any> {
    const response = await fetch(`${API_URL}/bulk-discounts/${id}`, { headers: getHeaders() });
    const result = await handleResponse(response);
    return result.data;
  },

  async deleteBulkDiscount(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/bulk-discounts/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    await handleResponse(response);
  },
};
