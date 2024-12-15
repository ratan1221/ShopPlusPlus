// frontend/src/components/shopping-view/cart-wrapper.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCartItems } from '@/store/shop/cart-slice';
import { Button } from '../ui/button';
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import UserCartItemsContent from './cart-items-content';

function UserCartWrapper({ setOpenCartSheet }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems, isLoading } = useSelector((state) => state.shopCart);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchCartItems(user.id));
        }
    }, [dispatch, user?.id]);

    const totalCartAmount = cartItems?.items?.reduce((sum, item) => {
        const price = Number(item?.salePrice > 0 ? item?.salePrice : item?.price);
        const quantity = Number(item?.quantity);
        return sum + (price * quantity);
    }, 0) || 0;

    if (isLoading) {
        return (
            <SheetContent>
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
            </SheetContent>
        );
    }

    return (
        <SheetContent className="sm:max-w-md">
            <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-4">
                {cartItems?.items?.length > 0 ? (
                    cartItems.items.map((item) => (
                        <UserCartItemsContent
                            key={item.productId}
                            cartItem={item}
                        />
                    ))
                ) : (
                    <p className="text-center text-muted-foreground">Your cart is empty</p>
                )}
            </div>
            {cartItems?.items?.length > 0 && (
                <>
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
                        </div>
                    </div>
                    <Button
                        onClick={() => {
                            navigate('/shop/checkout');
                            setOpenCartSheet(false);
                        }}
                        className="w-full mt-6"
                    >
                        Checkout
                    </Button>
                </>
            )}
        </SheetContent>
    );
}

export default UserCartWrapper;