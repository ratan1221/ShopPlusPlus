// store/shop/wishlist-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const GUEST_WISHLIST_KEY = "guestWishlist";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

// Helper functions for guest wishlist
const getGuestWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
};

const saveGuestWishlist = (items) => {
  localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
};

// Fetch Wishlist Items
export const fetchWishlistItems = createAsyncThunk(
  "wishlist/fetchWishlistItems",
  async (_, { getState }) => {
    const { auth } = getState();

    if (auth.user?.id) {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/wishlist/${auth.user.id}`
      );
      // Ensure the backend returns an array of items
      return response.data.data.items;
    }

    // For guest users, return the localStorage wishlist
    return getGuestWishlist();
  }
);

// Add Item to Wishlist
export const addItemToWishlist = createAsyncThunk(
  "wishlist/addItemToWishlist",
  async (product, { getState }) => {
    const { auth } = getState();

    if (auth.user?.id) {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/wishlist/add`,
        {
          userId: auth.user.id,
          productId: product._id,
        }
      );
      // Ensure the backend returns an array of items
      return response.data.data.items;
    }

    // For guest users, handle locally
    const wishlist = getGuestWishlist();
    const exists = wishlist.some(
      (item) =>
        item.productId._id === product._id || item.productId.id === product._id
    );

    if (!exists) {
      wishlist.push({ productId: product, addedAt: new Date().toISOString() });
      saveGuestWishlist(wishlist);
    }

    return wishlist;
  }
);

// Remove Item from Wishlist
export const removeItemFromWishlist = createAsyncThunk(
  "wishlist/removeItemFromWishlist",
  async (productId, { getState }) => {
    const { auth } = getState();

    if (auth.user?.id) {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/shop/wishlist/${auth.user.id}/${productId}`
      );
      // Ensure the backend returns an array of items
      return response.data.data.items;
    }

    // For guest users, handle locally
    const wishlist = getGuestWishlist().filter(
      (item) =>
        item.productId._id !== productId && item.productId.id !== productId
    );
    saveGuestWishlist(wishlist);
    return wishlist;
  }
);

// Merge Guest Wishlist
export const mergeGuestWishlist = createAsyncThunk(
  "wishlist/mergeGuestWishlist",
  async (_, { getState }) => {
    const { auth } = getState();
    if (!auth.user) {
      throw new Error("User not authenticated");
    }

    const guestItems = getGuestWishlist();
    if (!guestItems.length) return [];

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/wishlist/merge`,
      {
        userId: auth.user.id,
        items: guestItems,
      }
    );

    // Assuming backend merges and returns the updated items array
    const mergedItems = response.data.data.items;
    localStorage.removeItem(GUEST_WISHLIST_KEY);
    return mergedItems;
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
      localStorage.removeItem(GUEST_WISHLIST_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist Items
      .addCase(fetchWishlistItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload || [];
        state.error = null;
      })
      .addCase(fetchWishlistItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Add Item to Wishlist
      .addCase(addItemToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItemToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload || [];
        state.error = null;
      })
      .addCase(addItemToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Remove Item from Wishlist
      .addCase(removeItemFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeItemFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload || [];
        state.error = null;
      })
      .addCase(removeItemFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Merge Guest Wishlist
      .addCase(mergeGuestWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(mergeGuestWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload || [];
        state.error = null;
      })
      .addCase(mergeGuestWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;