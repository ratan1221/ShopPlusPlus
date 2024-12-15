// login.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CommonForm from '@/components/common/form';
import { loginFormControls } from '@/config';
import { loginUser } from '@/store/auth-slice';
import { useToast } from '@/hooks/use-toast';
import { fetchWishlistItems, mergeGuestWishlist } from '@/store/shop/wishlist-slice';
import { fetchCartItems } from '@/store/shop/cart-slice';

const initialState = {
  email: '',
  password: '',
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      navigate(redirectPath || '/shop/home');
      sessionStorage.removeItem('redirectAfterLogin');
    }
  }, [isAuthenticated, navigate]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const result = await dispatch(loginUser(formData)).unwrap();

      if (result.success) {
        toast({
          title: 'Login successful',
        });

        // Handle role-based redirection
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard');
          return;
        }

        // Regular user flow
        const guestWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (guestWishlist.length > 0) {
          await dispatch(mergeGuestWishlist(guestWishlist));
          localStorage.removeItem('wishlist');
        }

        // Fetch user data
        await Promise.all([
          dispatch(fetchWishlistItems()),
          dispatch(fetchCartItems())
        ]);

        // Handle redirect
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        navigate(redirectPath || '/shop/home');
        sessionStorage.removeItem('redirectAfterLogin');
      } else {
        toast({
          title: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        variant: 'destructive',
        description: error.message || 'An error occurred during login',
      });
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your Account
        </h1>
        <p className="mt-2">
          Don&apos;t have an Account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={'Sign in'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;