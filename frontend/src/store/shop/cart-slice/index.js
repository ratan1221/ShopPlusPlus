import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    cartItems: {
        items: [],
    },
    isLoading: false,
    error: null
};

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ userId, productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/shop/cart/add`,
                {
                    userId,
                    productId,
                    quantity: quantity || 1
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Error adding to cart"
            );
        }
    }
);

export const fetchCartItems = createAsyncThunk(
    "cart/fetchCartItems",
    async (userId) => {
        if (!userId) return initialState.cartItems;

        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/shop/cart/get/${userId}`
        );
        return response.data;
    }
);

export const deleteCartItem = createAsyncThunk(
    "cart/deleteCartItem",
    async ({ userId, productId }) => {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/shop/cart/${userId}/${productId}`
        );

        return response.data;
    }
);

export const updateCartQuantity = createAsyncThunk(
    "cart/updateCartQuantity",
    async ({ userId, productId, quantity }) => {
        const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart`,
            {
                userId,
                productId,
                quantity,
            }
        );

        return response.data;
    }
);


const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = initialState.cartItems;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
                state.error = null;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || action.error.message;
            })
            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
                state.error = null;
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
                state.cartItems = initialState.cartItems;
            })
            .addCase(updateCartQuantity.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(updateCartQuantity.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            .addCase(deleteCartItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(deleteCartItem.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            });
    },
});
export const { clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;