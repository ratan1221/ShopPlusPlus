import dotenv from 'dotenv';
import { validateEnvironmentVariables } from './helpers/startup-checks.js'
import express from 'express'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth/auth-routes.js';
import adminProductsRouter from './routes/admin/products-route.js';
import shopProductsRouter from './routes/shop/products-routes.js';
import shopCartRouter from './routes/shop/cart-routes.js';
import shopAddressRouter from './routes/shop/address-route.js';
import shopOrderRouter from './routes/shop/order-routes.js';
import adminOrderRouter from './routes/admin/order-routes.js';
import shopSearchRouter from './routes/shop/search-route.js';
import shopReviewRouter from './routes/shop/review-route.js';
import commonFeatureRouter from './routes/common/features-route.js';
import wishlistRouter from './routes/shop/wishlist-route.js';


dotenv.config();
try {
    await validateEnvironmentVariables();
} catch (error) {
    console.error('❌ Startup validation failed:', error);
    process.exit(1);
}


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Database Connected"))
    .catch((error) =>
        console.log("Database not connected !!", error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.CLIENT_BASE_URL,
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials: true
    })
)

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/orders', adminOrderRouter);
app.use('/api/shop/products', shopProductsRouter);
app.use('/api/shop/cart', shopCartRouter);
app.use('/api/shop/address', shopAddressRouter);
app.use('/api/shop/order', shopOrderRouter);
app.use('/api/shop/search', shopSearchRouter);
app.use('/api/shop/review', shopReviewRouter);
app.use('/api/common/feature', commonFeatureRouter);
app.use('/api/shop/wishlist', wishlistRouter);


app.listen(PORT, () => {
    console.log(`Server is now running on Port ${PORT}`)
});
