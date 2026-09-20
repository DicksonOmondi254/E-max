import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import wishlistReducer from "./wishlistSlice";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";

/**
 * Custom localStorage storage adapter for redux-persist.
 * Uses async (Promise-based) methods as required by redux-persist v6+.
 * A direct wrapper avoids issues with the default import from
 * "redux-persist/lib/storage" which can fail to resolve
 * in some bundler environments.
 */
const storage = {
  getItem: (key: string): Promise<string | null> => {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem: (key: string, value: string): Promise<void> => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
  removeItem: (key: string): Promise<void> => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
  clear: (): Promise<void> => {
    try {
      localStorage.clear();
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
  getAllKeys: (): Promise<string[]> => {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) keys.push(key);
      }
      return Promise.resolve(keys);
    } catch {
      return Promise.resolve([]);
    }
  },
};

/* ==========================================
   Persist Configuration
   - auth: persist user & token
   - cart: persist items, shipping, discount
   - wishlist: persist items & productIds
   - product: persist cached product data
   - order: persist cached order data
========================================== */

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
};

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items", "shipping", "discount"],
};

const wishlistPersistConfig = {
  key: "wishlist",
  storage,
  whitelist: ["items", "productIds"],
};

const productPersistConfig = {
  key: "product",
  storage,
  whitelist: ["cachedProducts", "cachedProductDetails"],
};

const orderPersistConfig = {
  key: "order",
  storage,
  whitelist: ["cachedOrders"],
};

/* ==========================================
   Persisted Reducers
========================================== */

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer);
const persistedProductReducer = persistReducer(productPersistConfig, productReducer);
const persistedOrderReducer = persistReducer(orderPersistConfig, orderReducer);

/* ==========================================
   Root Reducer
========================================== */

const rootReducer = combineReducers({
  cart: persistedCartReducer,
  auth: persistedAuthReducer,
  wishlist: persistedWishlistReducer,
  product: persistedProductReducer,
  order: persistedOrderReducer,
});

/* ==========================================
   Store
========================================== */

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

