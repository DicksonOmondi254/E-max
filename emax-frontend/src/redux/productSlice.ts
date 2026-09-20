import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ==========================================
   TYPES
========================================== */

export interface CachedProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string;
  stock: number;
  featured: boolean;
  category?: { name: string };
  brand?: { name: string };
}

export interface CachedProductDetail extends CachedProduct {
  images?: string[];
  specs?: Record<string, string>;
}

/* ==========================================
   STATE
========================================== */

interface ProductState {
  cachedProducts: CachedProduct[];
  cachedProductDetails: Record<number, CachedProductDetail>;
  lastFetched: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  cachedProducts: [],
  cachedProductDetails: {},
  lastFetched: null,
  loading: false,
  error: null,
};

/* ==========================================
   SLICE
========================================== */

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setCachedProducts(state, action: PayloadAction<CachedProduct[]>) {
      state.cachedProducts = action.payload;
      state.lastFetched = Date.now();
      state.loading = false;
      state.error = null;
    },

    setCachedProductDetail(state, action: PayloadAction<CachedProductDetail>) {
      const product = action.payload;
      state.cachedProductDetails[product.id] = product;
      state.lastFetched = Date.now();
    },

    setProductLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setProductError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },

    clearProductCache(state) {
      state.cachedProducts = [];
      state.cachedProductDetails = {};
      state.lastFetched = null;
    },
  },
});

export const {
  setCachedProducts,
  setCachedProductDetail,
  setProductLoading,
  setProductError,
  clearProductCache,
} = productSlice.actions;

export default productSlice.reducer;
