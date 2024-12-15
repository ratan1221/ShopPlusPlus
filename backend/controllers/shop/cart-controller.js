// controllers/shop/cart-controller.js
import mongoose from 'mongoose';
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

// Helper function for ObjectId validation
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Helper function for cart item population
const populateCartItems = (items) => {
    return items.map(item => ({
        productId: item.productId?._id || null,
        image: item.productId?.image || null,
        title: item.productId?.title || "Product not found",
        price: item.productId?.price || null,
        salePrice: item.productId?.salePrice || null,
        quantity: item.quantity,
        totalStock: item.productId?.totalStock || 0
    }));
};

export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Validate inputs
        if (!userId || !productId || !quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided"
            });
        }

        // Validate ObjectIds
        if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // Find product and validate stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check existing item
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        const newQuantity = existingItemIndex !== -1
            ? cart.items[existingItemIndex].quantity + quantity
            : quantity;

        // Validate stock
        if (newQuantity > product.totalStock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.totalStock} items available in stock`
            });
        }

        // Update cart
        if (existingItemIndex !== -1) {
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        await cart.populate('items.productId');

        return res.status(200).json({
            success: true,
            data: {
                _id: cart._id,
                userId: cart.userId,
                items: populateCartItems(cart.items)
            }
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        return res.status(500).json({
            success: false,
            message: "Error adding item to cart"
        });
    }
};

export const fetchCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId || userId === 'undefined' || !isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                message: "Valid user ID is required"
            });
        }

        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: 'image title price salePrice totalStock'
        });

        return res.status(200).json({
            success: true,
            data: {
                _id: cart?._id || null,
                userId,
                items: cart ? populateCartItems(cart.items) : []
            }
        });

    } catch (error) {
        console.error('Fetch cart error:', error);
        return res.status(500).json({
            success: false,
            message: "Error fetching cart items"
        });
    }
};

export const updateCartItemQty = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity || quantity <= 0 ||
            !isValidObjectId(userId) || !isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided"
            });
        }

        // Validate stock
        const product = await Product.findById(productId);
        if (!product || quantity > product.totalStock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product?.totalStock || 0} items available in stock`
            });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate('items.productId');

        return res.status(200).json({
            success: true,
            data: {
                _id: cart._id,
                userId: cart.userId,
                items: populateCartItems(cart.items)
            }
        });

    } catch (error) {
        console.error('Update cart error:', error);
        return res.status(500).json({
            success: false,
            message: "Error updating cart item"
        });
    }
};

export const deleteCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        if (!userId || !productId || !isValidObjectId(userId) || !isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided"
            });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        await cart.save();
        await cart.populate('items.productId');

        return res.status(200).json({
            success: true,
            data: {
                _id: cart._id,
                userId: cart.userId,
                items: populateCartItems(cart.items)
            }
        });

    } catch (error) {
        console.error('Delete cart item error:', error);
        return res.status(500).json({
            success: false,
            message: "Error removing item from cart"
        });
    }
};