import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { cartService } from "../services/cartService";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  role:
    | "CUSTOMER"
    | "SELLER"
    | "ADMIN"
    | "SUPER_ADMIN";

  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },

    loginSuccess: (
      state,
      action: PayloadAction<User>
    ) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;

      // Also sync token to localStorage for axios interceptor
      localStorage.setItem("token", action.payload.token);
    },

    logout: (state) => {
      // Save cart to user-specific key before clearing
      const userId = state.user?.id;
      if (userId) {
        cartService.clearCart(userId);
      }

      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;

      // Clear token from localStorage
      localStorage.removeItem("token");
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  logout,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;

