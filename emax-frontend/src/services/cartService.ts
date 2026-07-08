import type { CartItem } from "../redux/cartSlice";

const STORAGE_KEY = "emax_cart";

export const cartService = {
  saveCart(items: CartItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  },

  loadCart(): CartItem[] {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  clearCart() {
    localStorage.removeItem(STORAGE_KEY);
  },
};