import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import wishlistReducer from "./wishlistSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;