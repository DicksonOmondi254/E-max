import type { CartItem } from "../redux/cartSlice";

const getStorageKey = (userId?: number): string => {
  return userId ? `emax_cart_${userId}` : "emax_cart_guest";
};

export const cartService = {
  saveCart(items: CartItem[], userId?: number) {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(items));
  },

  loadCart(userId?: number): CartItem[] {
    const key = getStorageKey(userId);
    const data = localStorage.getItem(key);

    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  clearCart(userId?: number) {
    const key = getStorageKey(userId);
    localStorage.removeItem(key);
  },

  /**
   * Migrate guest cart items to a user-specific key after login.
   */
  migrateGuestCartToUser(userId: number): CartItem[] {
    const guestKey = getStorageKey();
    const userKey = getStorageKey(userId);
    const guestData = localStorage.getItem(guestKey);

    if (!guestData) return [];

    try {
      const guestItems: CartItem[] = JSON.parse(guestData);
      // Save guest items under the user's key
      localStorage.setItem(userKey, JSON.stringify(guestItems));
      // Remove the guest key
      localStorage.removeItem(guestKey);
      return guestItems;
    } catch {
      return [];
    }
  },
};
