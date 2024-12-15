import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductsSlice from './admin/products-slice';
import shopProductsSlice from './shop/products-slice';
import shopCartSlice from './shop/cart-slice';
import shopAddressSlice from './shop/address-slice';
import shopOrderSlice from './shop/order-slice';
import adminOrderSlice from './admin/order-slice';
import shopSearchSlice from './shop/search-slice';
import shopReviewSlice from './shop/review-slice';
import commonFeatureSlice from "./common-slice";
import wishlistReducer from './shop/wishlist-slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: AdminProductsSlice,
    adminOrder: adminOrderSlice,
    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
    commonFeature: commonFeatureSlice,
    wishlist: wishlistReducer,
  },
});

export default store;