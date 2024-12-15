import { CircleUserRound, Heart, House, LogIn, LogOut, Menu, ShoppingCart, User } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser, resetTokenAndCredentials } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import WishlistWrapper from "./wishlist-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { fetchWishlistItems } from "@/store/shop/wishlist-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem('filters');
    const currentFilter = getCurrentMenuItem.id !== 'home' && getCurrentMenuItem.id !== 'products' && getCurrentMenuItem.id !== 'search' ?
      {
        category: [getCurrentMenuItem.id]
      } : null
    sessionStorage.setItem('filters', JSON.stringify(currentFilter));
    location.pathname.includes('listing') && currentFilter !== null ?
      setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`)) :
      navigate(getCurrentMenuItem.path)
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row" >
      {
        shoppingViewHeaderMenuItems.map((menuItem) => <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}>
          {menuItem.label}</Label>)
      }
    </nav>
  )
};

function HeaderRightContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector(state => state.shopCart);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [openWishlistSheet, setOpenWishlistSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchCartItems(user.id));
      dispatch(fetchWishlistItems(user.id));
    }
  }, [dispatch, user]);

  function handleLogout() {
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate('/auth/login');
  };

  return (
    <div className="flex items-center gap-2">
      <Sheet open={openWishlistSheet} onOpenChange={setOpenWishlistSheet}>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setOpenWishlistSheet(true)}
        >
          <Heart className="h-5 w-5" />
          {wishlistItems?.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              {wishlistItems.length}
            </span>
          )}
        </Button>
        <WishlistWrapper setOpenWishlistSheet={setOpenWishlistSheet}
          setOpenCartSheet={setOpenCartSheet}
        />
      </Sheet>

      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          onClick={() => setOpenCartSheet(true)}
        >
          <ShoppingCart className="h-5 w-5" />
          {cartItems?.items?.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              {cartItems.items.length}
            </span>
          )}
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {isAuthenticated ? (
                user?.userName?.[0]?.toUpperCase()
              ) : (
                <User className="h-5 w-5" />
              )}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" className="w-56">
          {isAuthenticated ? (
            <>
              <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/shop/account')}>
                <CircleUserRound className="mr-3 h-6 w-6" />
                Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-6 w-6" />
                Logout
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={() => navigate('/auth/login')}>
              <LogIn className="mr-3 h-6 w-6" />
              Login
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <House className="h-6 w-6" />
          <span className="font-bold">ShopPlusPlus</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;