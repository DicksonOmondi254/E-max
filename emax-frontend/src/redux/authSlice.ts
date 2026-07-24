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

// Restore authentication after page refresh
const storedUser = localStorage.getItem("user");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser,
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

      // Persist login
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload)
      );

      localStorage.setItem(
        "token",
        action.payload.token
      );
    },

    logout: (state) => {
      // Save cart to user-specific key before clearing
      const userId = state.user?.id;
      if (userId) {
        // Cart data is already saved per-user by cartSlice's save()
        // Clear the user's cart localStorage
        cartService.clearCart(userId);
      }

      state.user = null;

      state.isAuthenticated = false;

      state.loading = false;

      // Clear storage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
