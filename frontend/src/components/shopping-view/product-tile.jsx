// components/shopping-view/ShoppingProductTile.jsx
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToWishlist,
  removeItemFromWishlist,
  fetchWishlistItems,
} from "@/store/shop/wishlist-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ShoppingProductTile({ product, handleGetProductDetails }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlistItems(user.id));
    } else {
      dispatch(fetchWishlistItems());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    setIsInWishlist(
      wishlistItems?.some(
        (item) => item.productId?._id === product?._id
      )
    );
  }, [wishlistItems, product?._id]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isInWishlist) {
        await dispatch(removeItemFromWishlist(product._id)).unwrap();
        toast({ title: "Removed from wishlist" });
      } else {
        await dispatch(addItemToWishlist(product)).unwrap();
        toast({ title: "Added to wishlist" });
      }
    } catch (error) {
      toast({
        title: "Error updating wishlist",
        variant: "destructive",
        description: error.message,
      });
    }
  };

  const handleProductClick = (e) => {
    e.preventDefault();
    handleGetProductDetails(product?._id);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Please login to add items to Cart",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    const currentCartItems = cartItems?.items || [];
    const existingItem = currentCartItems.find(
      (item) => item.productId === product._id
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > product.totalStock) {
        toast({
          title: `Only ${product.totalStock} items available in stock`,
          variant: "destructive"
        });
        return;
      }
    }

    try {
      const result = await dispatch(
        addToCart({
          userId: user.id,
          productId: product._id,
          quantity: 1
        })
      ).unwrap();

      if (result.success) {
        await dispatch(fetchCartItems(user.id));
        toast({
          title: "Product added to cart"
        });
      }
    } catch (error) {
      toast({
        title: "Error adding item to cart",
        variant: "destructive",
        description: error.message
      });
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={handleProductClick}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 hover:bg-white/80"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
            />
          </Button>
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`${product?.salePrice > 0 ? "line-through" : ""
                } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg font-semibold text-red-500">
                ${product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-4">
        <Button
          className="w-full"
          disabled={product?.totalStock === 0}
          onClick={handleAddToCart}
        >
          {product?.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;