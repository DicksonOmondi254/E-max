const API_BASE = "http://localhost:5000";

const getToken = (): string | null => localStorage.getItem("token");

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

export interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  slug?: string;
  image?: string | null;
  brand?: string | null;
  stock?: number;
}

export interface WishlistResponse {
  id: number;
  userId: number;
  items: WishlistItemResponse[];
}

export interface WishlistItemResponse {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    thumbnail: string;
    brand: { name: string };
    images: { image: string }[];
  };
}

export const wishlistService = {
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await fetch(`${API_BASE}/api/wishlist`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to load wishlist.");
    const result = await response.json();

    // Map the backend response to a flat list
    const data = result.data;
    if (data?.items) {
      return data.items.map((item: WishlistItemResponse) => ({
        id: item.id,
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        slug: item.product.slug,
        image: item.product.images?.[0]?.image || item.product.thumbnail || null,
        brand: item.product.brand?.name || null,
        stock: item.product.stock,
      }));
    }
    return [];
  },

  async addToWishlist(productId: number): Promise<void> {
    const response = await fetch(`${API_BASE}/api/wishlist`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ productId }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to add to wishlist.");
    }
  },

  async removeFromWishlist(productId: number): Promise<void> {
    const response = await fetch(`${API_BASE}/api/wishlist/${productId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to remove from wishlist.");
    }
  },

  async clearWishlist(): Promise<void> {
    const response = await fetch(`${API_BASE}/api/wishlist`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to clear wishlist.");
  },

  async isInWishlist(productId: number): Promise<boolean> {
    try {
      const items = await this.getWishlist();
      return items.some((item) => item.productId === productId);
    } catch {
      return false;
    }
  },
};

