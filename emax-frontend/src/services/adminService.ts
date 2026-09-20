const API_BASE = "http://localhost:5000/api/admin/customers";
const SELLER_API_BASE = "http://localhost:5000/api/admin/sellers";

const getToken = () => localStorage.getItem("token");

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

/* ============================================
   Customer Types & Interfaces
============================================ */

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    orders: number;
    reviews: number;
  };
}

export interface CustomerPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CustomersResponse {
  success: boolean;
  customers: Customer[];
  pagination: CustomerPagination;
}

export interface CustomerDetailResponse {
  success: boolean;
  data: Customer & {
    orders?: any[];
    reviews?: any[];
  };
}

/* ============================================
   Seller Types & Interfaces
============================================ */

export interface Seller {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
isActive: boolean;
  shopName: string | null;
  trustBadges: string;
  location: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    products: number;
    orders: number;
  };
}

export interface SellerStats {
  totalSellers: number;
  activeSellers: number;
  activeSellersPercent: number;
  inactiveSellers: number;
  inactiveSellersPercent: number;
  totalProducts: number;
}

export interface SellerPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SellersResponse {
  success: boolean;
  sellers: Seller[];
  pagination: SellerPagination;
}

export interface SellerDetailResponse {
  success: boolean;
  data: Seller & {
    totalOrders: number;
    recentOrders: {
      id: number;
      orderNumber: string;
      totalAmount: number;
      status: string;
      customerName: string;
      createdAt: string;
    }[];
  };
}

export interface ActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

/* ============================================
   Admin Service Implementation
============================================ */

export interface DeactivateAccountResponse {
  success: boolean;
  data: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    shopName: string | null;
    deactivatedReason: string | null;
  };
  message: string;
}

export const adminService = {
  // ── Customers ──

  async getCustomers(
    page: number = 1,
    limit: number = 20,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<CustomersResponse> {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (search) params.set("search", search);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    const response = await fetch(`${API_BASE}?${params.toString()}`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch customers.");
    }

    return result;
  },

  async getCustomerById(id: number): Promise<CustomerDetailResponse["data"]> {
    const response = await fetch(`${API_BASE}/${id}`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch customer.");
    }

    return result.data;
  },

  // ── Sellers ───────────────────────────────

  async getSellerStats(): Promise<{ success: boolean; data: SellerStats }> {
    const response = await fetch(`${SELLER_API_BASE}/stats`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch seller stats.");
    }

    return result;
  },

  async getSellers(
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string,
    location?: string,
    dateFrom?: string,
    dateTo?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<SellersResponse> {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (location) params.set("location", location);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    const response = await fetch(`${SELLER_API_BASE}?${params.toString()}`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch sellers.");
    }

    return result;
  },

  async getSellerById(id: number): Promise<SellerDetailResponse> {
    const response = await fetch(`${SELLER_API_BASE}/${id}`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch seller details.");
    }

    return result;
  },

  async updateSellerStatus(
    id: number,
    isActive: boolean
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${SELLER_API_BASE}/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ isActive }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update seller status.");
    }

    return result;
  },

  async deactivateSellerAccount(
    id: number,
    reason: string
  ): Promise<ActionResponse> {
    const response = await fetch(`${SELLER_API_BASE}/${id}/deactivate`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to deactivate seller account.");
    }

    return result;
  },

  // ── Seller Trust Badges ───────────────────

  async updateSellerTrustBadges(
    id: number,
    badges: string[]
  ): Promise<{ success: boolean; message: string; data?: any }> {
    const response = await fetch(`${SELLER_API_BASE}/${id}/trust-badges`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ badges }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update seller trust badges.");
    }

    return result;
  },
};
