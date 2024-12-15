// controllers/shop/wishlist-controller.js
import Wishlist from '../../models/Wishlist.js';

export const addToWishlist = async (req, res) => {
    try {
        const { userId, guestId, productId } = req.body;
        let query = userId ? { userId } : { guestId };

        let wishlist = await Wishlist.findOne(query);

        if (!wishlist) {
            wishlist = new Wishlist({
                ...(userId ? { userId } : { guestId }),
                items: []
            });
        }

        const existingItemIndex = wishlist.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            wishlist.items.splice(existingItemIndex, 1);
        } else {
            wishlist.items.push({ productId });
        }

        await wishlist.save();
        await wishlist.populate('items.productId');

        res.status(200).json({
            success: true,
            data: wishlist,
            isWishlisted: existingItemIndex === -1
        });
    } catch (error) {
        console.error('Wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing wishlist request'
        });
    }
};

export const fetchWishlistItems = async (req, res) => {
    try {
        const { userId, guestId } = req.params;
        let query = userId !== 'undefined' ? { userId } : { guestId };

        const wishlist = await Wishlist.findOne(query)
            .populate({
                path: 'items.productId',
                select: 'image title price salePrice totalStock'
            });

        res.status(200).json({
            success: true,
            data: wishlist || { items: [] }
        });
    } catch (error) {
        console.error('Fetch wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching wishlist items'
        });
    }
};

export const mergeWishlist = async (req, res) => {
    try {
        const { userId, items } = req.body;

        let userWishlist = await Wishlist.findOne({ userId });

        if (!userWishlist) {
            userWishlist = new Wishlist({ userId, items: [] });
        }

        // Merge items ensuring no duplicates
        const existingProductIds = new Set(
            userWishlist.items.map(item => item.productId.toString())
        );

        items.forEach(item => {
            const productId = item.productId._id || item.productId;
            if (!existingProductIds.has(productId.toString())) {
                userWishlist.items.push({ productId });
                existingProductIds.add(productId.toString());
            }
        });

        await userWishlist.save();
        await userWishlist.populate('items.productId');

        res.status(200).json({
            success: true,
            data: userWishlist
        });
    } catch (error) {
        console.error('Merge wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Error merging wishlists'
        });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        wishlist.items = wishlist.items.filter(
            item => item.productId.toString() !== productId
        );

        await wishlist.save();
        await wishlist.populate('items.productId');

        res.status(200).json({
            success: true,
            data: wishlist
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing item from wishlist'
        });
    }
};