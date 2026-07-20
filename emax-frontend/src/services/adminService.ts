const API_BASE = "http://localhost:5000/api/admin/customers";

const getToken = () => localStorage.getItem("token");

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

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

export const adminService = {
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

    const response = await fetch(`${API_BASE}?${params}`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch customers.");
    }

    return result;
  },

  async getCustomerById(id: number) {
    const response = await fetch(`${API_BASE}/${id}`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch customer.");
    }

    return result.data;
  },
};

