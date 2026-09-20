import {
  createSlice,
  createSelector,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { cartService } from "../services/cartService";
import type { RootState } from "./stores";

export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  shipping: number;
  discount: number;
}

const initialState: CartState = {
  items: [],
  shipping: 0,
  discount: 0,
};

/**
 * Get current userId from Redux auth state or localStorage.
 */
const getUserId = (): number | undefined => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.id;
    }
  } catch {
    // ignore
  }
  return undefined;
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    restoreCart(state, action: PayloadAction<number | undefined>) {
      const userId = action.payload ?? getUserId();
      // Fallback: load from manual storage if persisted state is empty
      if (state.items.length === 0) {
        state.items = cartService.loadCart(userId);
      }
    },

    addToCart(
      state,
      action: PayloadAction<CartItem>
    ) {
      // Prevent invalid quantities
      if (action.payload.quantity <= 0) return;
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      // Also sync to manual storage for guest→user migration support
      const userId = getUserId();
      cartService.saveCart(state.items, userId);
    },

    removeFromCart(
      state,
      action: PayloadAction<number>
    ) {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      const userId = getUserId();
      cartService.saveCart(state.items, userId);
    },

    increaseQuantity(
      state,
      action: PayloadAction<number>
    ) {
      const item = state.items.find(
        (i) => i.id === action.payload
      );

      if (item) {
        item.quantity++;
      }
    },

    decreaseQuantity(
      state,
      action: PayloadAction<number>
    ) {
      const item = state.items.find(
        (i) => i.id === action.payload
      );

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity--;
      } else {
        state.items = state.items.filter(
          (i) => i.id !== action.payload
        );
      }
    },

    updateQuantity(
      state,
      action: PayloadAction<{
        id: number;
        quantity: number;
      }>
    ) {
      const item = state.items.find(
        (i) => i.id === action.payload.id
      );

      if (item) {
        item.quantity = Math.max(
          1,
          action.payload.quantity
        );
      }
    },

    applyDiscount(
      state,
      action: PayloadAction<number>
    ) {
      state.discount = action.payload;
    },

    setShipping(
      state,
      action: PayloadAction<number>
    ) {
      state.shipping = action.payload;
    },

    clearCart(state) {
      state.items = [];
      state.discount = 0;
      state.shipping = 0;

      const userId = getUserId();
      cartService.clearCart(userId);
    },

    /**
     * Migrate guest cart to user-specific key after login
     */
    migrateGuestCart(state) {
      const userId = getUserId();
      if (userId) {
        const guestItems = cartService.migrateGuestCartToUser(userId);
        if (guestItems.length > 0 && state.items.length === 0) {
          state.items = guestItems;
        }
      }
    },
  },
});

export const {
  restoreCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  applyDiscount,
  setShipping,
  clearCart,
  migrateGuestCart,
} = cartSlice.actions;

/* ==========================================
   SELECTORS
========================================== */

export const selectCartItems = (
  state: RootState
) => state.cart.items;

export const selectCartCount = createSelector(
  [selectCartItems],
  (items) =>
    items.reduce(
      (total, item) => total + item.quantity,
      0
    )
);

export const selectSubtotal = createSelector(
  [selectCartItems],
  (items) =>
    items.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    )
);

export const selectShipping = (
  state: RootState
) => state.cart.shipping;

export const selectDiscount = (
  state: RootState
) => state.cart.discount;

export const selectCartTotal = createSelector(
  [
    selectSubtotal,
    selectShipping,
    selectDiscount,
  ],
  (subtotal, shipping, discount) =>
    subtotal + shipping - discount
);

export default cartSlice.reducer;

