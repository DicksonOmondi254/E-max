const API_BASE = "http://localhost:5000/api/admin/reports";

const getToken = () => localStorage.getItem("token");

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const buildUrl = (endpoint: string, params?: { dateFrom?: string; dateTo?: string }) => {
  const url = new URL(`${API_BASE}${endpoint}`);
  if (params?.dateFrom) url.searchParams.set("dateFrom", params.dateFrom);
  if (params?.dateTo) url.searchParams.set("dateTo", params.dateTo);
  return url.toString();
};

const fetchReport = async (endpoint: string, params?: { dateFrom?: string; dateTo?: string }) => {
  const response = await fetch(buildUrl(endpoint, params), { headers: getHeaders() });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch report.");
  }
  const result = await response.json();
  return result.data;
};

export interface SalesSummary {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

export interface OrderEntry {
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

export interface FinanceSummary {
  paidOrders: number;
  refundedOrders: number;
  totalPayout: number;
}

export interface TransactionEntry {
  id: number;
  orderNumber: string;
  amount: number;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  date: string;
}

export interface TaxInfo {
  taxRate: string;
  taxableAmount: number;
  estimatedTax: string;
}

export interface InventorySummary {
  totalProducts: number;
  totalStock: number;
  outOfStock: number;
  lowStock: number;
}

export interface ProductEntry {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  featured: boolean;
  active: boolean;
  updatedAt: string;
}

export interface CustomerSummary {
  cancelledOrders: number;
  refundedOrders: number;
  totalReviews: number;
  averageRating: string;
  ratingDistribution: Record<number, number>;
}

export interface ReviewEntry {
  id: number;
  rating: number;
  comment: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  date: string;
}

export interface PerformanceSummary {
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalReviews: number;
  averageRating: string;
  deliveryRate: string;
  cancellationRate: string;
  scorecard: {
    deliveryPerformance: string;
    customerSatisfaction: string;
    orderFulfillment: string;
  };
  penalties: {
    cancelledPercentage: string;
    cancelledAmount: number;
    estimatedPenalty: number;
  };
}

export const reportService = {
  getSalesReport(params?: { dateFrom?: string; dateTo?: string }) {
    return fetchReport("/sales", params) as Promise<{
      summary: SalesSummary;
      orders: OrderEntry[];
    }>;
  },

  getFinanceReport(params?: { dateFrom?: string; dateTo?: string }) {
    return fetchReport("/finance", params) as Promise<{
      summary: FinanceSummary;
      transactions: TransactionEntry[];
      taxInfo: TaxInfo;
    }>;
  },

  getInventoryReport() {
    return fetchReport("/inventory") as Promise<{
      summary: InventorySummary;
      products: ProductEntry[];
    }>;
  },

  getCustomerReport(params?: { dateFrom?: string; dateTo?: string }) {
    return fetchReport("/customers", params) as Promise<{
      summary: CustomerSummary;
      reviews: ReviewEntry[];
    }>;
  },

  getPerformanceReport(params?: { dateFrom?: string; dateTo?: string }) {
    return fetchReport("/performance", params) as Promise<{
      summary: PerformanceSummary;
    }>;
  },
};

