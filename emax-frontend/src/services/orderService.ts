const API_BASE = "http://localhost:5000/api/orders";

const getToken = () => localStorage.getItem("token");

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  productId: number;
  product: {
    id: number;
    name: string;
    slug: string;
    thumbnail: string;
    price: number;
  };
}

export interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  userId: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  success: boolean;
  count: number;
  data: Order[];
}

export interface SingleOrderResponse {
  success: boolean;
  data: Order;
}

export const orderService = {
  async getAllOrders(): Promise<OrdersResponse> {
    const response = await fetch(API_BASE, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch orders.");
    }

    return result;
  },

  async getOrder(id: number): Promise<SingleOrderResponse> {
    const response = await fetch(`${API_BASE}/${id}`, {
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch order.");
    }

    return result;
  },

  async updateOrderStatus(id: number, status: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update order status.");
    }
  },

  async cancelOrder(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}/cancel`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to cancel order.");
    }
  },

  async deleteOrder(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete order.");
    }
  },
};

