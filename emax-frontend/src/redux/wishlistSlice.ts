import { createSlice, createAsyncThunk, createSelector, type PayloadAction } from "@reduxjs/toolkit";
import { wishlistService, type WishlistItem } from "../services/wishlistService";

/* =====================================================
   STATE TYPE
===================================================== */

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  /** Array of product IDs that are in the wishlist (for quick lookup) */
  productIds: number[];
  /** Timestamp of last successful fetch from API */
  lastSynced: number | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  productIds: [],
  lastSynced: null,
};

/* =====================================================
   ASYNC THUNKS
===================================================== */

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const items = await wishlistService.getWishlist();
      return items;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load wishlist.");
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId: number, { rejectWithValue, dispatch }) => {
    try {
      await wishlistService.addToWishlist(productId);
      // Optimistic update already applied in reducer
      // Refresh from API to ensure consistency
      dispatch(fetchWishlist());
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add to wishlist.");
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId: number, { rejectWithValue, dispatch }) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      // Optimistic update already applied in reducer
      dispatch(fetchWishlist());
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to remove from wishlist.");
    }
  }
);

export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await wishlistService.clearWishlist();
      dispatch(fetchWishlist());
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to clear wishlist.");
    }
  }
);

/* =====================================================
   OPTIMISTIC UPDATE HELPERS
===================================================== */

/**
 * Get productIds from items array
 */
const extractProductIds = (items: WishlistItem[]): number[] =>
  items.map((item) => item.productId);

/* =====================================================
   SLICE
===================================================== */

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlistError(state) {
      state.error = null;
    },

    /**
     * Optimistically add a product ID to local state
     * so the UI updates immediately without waiting for API.
     */
    optimisticAdd(state, action: PayloadAction<number>) {
      const productId = action.payload;
      if (!state.productIds.includes(productId)) {
        state.productIds.push(productId);
      }
    },

    /**
     * Optimistically remove a product ID from local state
     */
    optimisticRemove(state, action: PayloadAction<number>) {
      const productId = action.payload;
      state.productIds = state.productIds.filter((id) => id !== productId);
      state.items = state.items.filter((item) => item.productId !== productId);
    },
  },
  extraReducers: (builder) => {
    // ── fetchWishlist ──
    builder.addCase(fetchWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.items = action.payload;
      state.productIds = extractProductIds(action.payload);
      state.loading = false;
      state.lastSynced = Date.now();
    });
    builder.addCase(fetchWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ── addToWishlist ──
    builder.addCase(addToWishlist.pending, (state) => {
      state.error = null;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      if (!state.productIds.includes(action.payload)) {
        state.productIds.push(action.payload);
      }
    });
    builder.addCase(addToWishlist.rejected, (state, action) => {
      state.error = action.payload as string;
      // Rollback optimistic add if it was applied
    });

    // ── removeFromWishlist ──
    builder.addCase(removeFromWishlist.pending, (state) => {
      state.error = null;
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      state.productIds = state.productIds.filter((id) => id !== action.payload);
      state.items = state.items.filter((item) => item.productId !== action.payload);
    });
    builder.addCase(removeFromWishlist.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // ── clearWishlist ──
    builder.addCase(clearWishlist.pending, (state) => {
      state.error = null;
    });
    builder.addCase(clearWishlist.fulfilled, (state) => {
      state.items = [];
      state.productIds = [];
    });
    builder.addCase(clearWishlist.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

/* =====================================================
   SELECTORS
===================================================== */

export const selectWishlistItems = (state: { wishlist: WishlistState }) =>
  state.wishlist.items;

export const selectWishlistCount = (state: { wishlist: WishlistState }) =>
  state.wishlist.items.length;

export const selectWishlistLoading = (state: { wishlist: WishlistState }) =>
  state.wishlist.loading;

export const selectWishlistError = (state: { wishlist: WishlistState }) =>
  state.wishlist.error;

export const selectWishlistLastSynced = (state: { wishlist: WishlistState }) =>
  state.wishlist.lastSynced;

/**
 * Check if a given product ID is in the wishlist.
 * Uses the productIds array for O(1) lookup.
 */
export const selectIsInWishlist = (productId: number) =>
  createSelector(
    (state: { wishlist: WishlistState }) => state.wishlist.productIds,
    (productIds) => productIds.includes(productId)
  );

export const { resetWishlistError, optimisticAdd, optimisticRemove } = wishlistSlice.actions;

export default wishlistSlice.reducer;

