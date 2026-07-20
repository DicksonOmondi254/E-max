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
  items: cartService.loadCart(),
  shipping: 0,
  discount: 0,
};

const save = (items: CartItem[]) => {
  cartService.saveCart(items);
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    restoreCart(state) {
      state.items = cartService.loadCart();
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

      save(state.items);
    },

    removeFromCart(
      state,
      action: PayloadAction<number>
    ) {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      save(state.items);
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

      save(state.items);
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

      save(state.items);
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

      save(state.items);
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

      cartService.clearCart();
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