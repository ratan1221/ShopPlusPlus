// routes/shop/wishlist-routes.js
import express from 'express';
import {
    addToWishlist,
    fetchWishlistItems,
    mergeWishlist,
    removeFromWishlist
} from '../../controllers/shop/wishlist-controller.js';

const router = express.Router();

router.post('/add', addToWishlist);
router.get('/:userId?/:guestId?', fetchWishlistItems);
router.post('/merge', mergeWishlist);
router.delete('/:userId/:productId', removeFromWishlist);

export default router;