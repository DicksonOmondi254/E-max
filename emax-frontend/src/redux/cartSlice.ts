import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { cartService } from "../services/cartService";

export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: cartService.loadCart(),
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = state.items.find(
        (i) => i.id === action.payload.id
      );

      if (item) {
        item.quantity++;
      } else {
        state.items.push(action.payload);
      }

      cartService.saveCart(state.items);
    },

    removeFromCart: (
      state,
      action: PayloadAction<number>
    ) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      cartService.saveCart(state.items);
    },

    increaseQuantity: (
      state,
      action: PayloadAction<number>
    ) => {
      const item = state.items.find(
        (i) => i.id === action.payload
      );

      if (item) {
        item.quantity++;
      }

      cartService.saveCart(state.items);
    },

    decreaseQuantity: (
      state,
      action: PayloadAction<number>
    ) => {
      const item = state.items.find(
        (i) => i.id === action.payload
      );

      if (item && item.quantity > 1) {
        item.quantity--;
      }

      cartService.saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];

      cartService.clearCart();
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;