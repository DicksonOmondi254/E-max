import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ==========================================
   TYPES
========================================== */

export interface CachedOrder {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    id: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
      slug: string;
      thumbnail: string;
    };
  }>;
}

/* ==========================================
   STATE
========================================== */

interface OrderState {
  cachedOrders: CachedOrder[];
  lastFetched: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  cachedOrders: [],
  lastFetched: null,
  loading: false,
  error: null,
};

/* ==========================================
   SLICE
========================================== */

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setCachedOrders(state, action: PayloadAction<CachedOrder[]>) {
      state.cachedOrders = action.payload;
      state.lastFetched = Date.now();
      state.loading = false;
      state.error = null;
    },

    updateCachedOrderStatus(
      state,
      action: PayloadAction<{ orderId: number; status: string; paymentStatus?: string }>
    ) {
      const { orderId, status, paymentStatus } = action.payload;
      const order = state.cachedOrders.find((o) => o.id === orderId);
      if (order) {
        order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;
      }
    },

    setOrderLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setOrderError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },

    clearOrderCache(state) {
      state.cachedOrders = [];
      state.lastFetched = null;
    },
  },
});

export const {
  setCachedOrders,
  updateCachedOrderStatus,
  setOrderLoading,
  setOrderError,
  clearOrderCache,
} = orderSlice.actions;

export default orderSlice.reducer;
