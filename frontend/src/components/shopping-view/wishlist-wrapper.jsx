// components/shopping-view/wishlist-wrapper.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchWishlistItems,
  removeItemFromWishlist,
} from '@/store/shop/wishlist-slice';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { Button } from '../ui/button';
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Trash, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function WishlistWrapper({ setOpenWishlistSheet, setOpenCartSheet }) {
  const { items, isLoading } = useSelector((state) => state.wishlist);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlistItems(user.id));
      dispatch(fetchCartItems(user.id));
    } else {
      dispatch(fetchWishlistItems());
    }
  }, [dispatch, isAuthenticated, user]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await dispatch(removeItemFromWishlist(productId)).unwrap();
      toast({
        title: "Item removed from wishlist",
      });
    } catch (error) {
      toast({
        title: "Failed to remove item",
        variant: "destructive",
        error: error.message
      });
    }
  };

  const handleMoveToCart = async (product) => {
    if (!isAuthenticated) {
      setOpenWishlistSheet(false);
      toast({
        title: "Please login to add items to cart",
        action: (
          <Button
            variant="outline"
            onClick={() => navigate('/auth/login')}
          >
            Login
          </Button>
        ),
      });
      return;
    };

    // Check if item already exists in cart
    const isInCart = cartItems?.items?.some(
      item => item.productId === product._id || item.productId._id === product._id
    );

    if (isInCart) {
      const { dismiss } = toast({
        title: "Product already exists in Cart",
        description: "Please use the button below to view cart",
        variant: "warning",
        duration: 3000, // 3 seconds
        action: (
          <Button
            variant="outline"
            onClick={() => {
              setOpenWishlistSheet(false);
              setOpenCartSheet(true);
              dismiss(); // Dismiss toast when action is clicked
            }}
          >
            Go to Cart
          </Button>
        )
      });
      return;
    }

    try {
      await dispatch(addToCart({
        userId: user.id,
        productId: product._id,
        quantity: 1,
      })).unwrap();

      await dispatch(removeItemFromWishlist(product._id)).unwrap();
      await dispatch(fetchCartItems(user.id)).unwrap();

      toast({
        title: "Item moved to cart",
      });
    } catch (error) {
      toast({
        title: "Failed to move item to cart",
        variant: "destructive",
        error: error.message
      });
    }
  };

  // Defensive check to ensure 'items' is an array
  if (!Array.isArray(items)) {
    return (
      <SheetContent>
        <SheetHeader>
          <SheetTitle>My Wishlist</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <p className="text-muted-foreground">Your wishlist data is invalid.</p>
          <Button onClick={() => setOpenWishlistSheet(false)}>
            Continue Shopping
          </Button>
        </div>
      </SheetContent>
    );
  }

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>My Wishlist</SheetTitle>
      </SheetHeader>

      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <p className="text-muted-foreground">Your wishlist is empty</p>
          <Button onClick={() => setOpenWishlistSheet(false)}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {items.map((item) => (
            <div
              key={item.productId._id}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <img
                src={item.productId.image}
                alt={item.productId.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.productId.title}</h3>
                <p className="text-muted-foreground">
                  ${item.productId.salePrice || item.productId.price}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFromWishlist(item.productId._id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleMoveToCart(item.productId)}
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </SheetContent>
  );
}

export default WishlistWrapper;