// models/Wishlist.js
import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Changed to false to support guest users
    },
    guestId: {
        type: String,
        required: false
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        },
    ],
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;