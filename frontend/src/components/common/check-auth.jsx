// CheckAuth.jsx
import { useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

function CheckAuth({ isAuthenticated, user, children, requireAuth = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle unauthorized access attempts
    if (!isAuthenticated && requireAuth) {
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/auth/login", { replace: true });
      return;
    }

    // Redirect admin from shop routes
    if (isAuthenticated && user?.role === "admin" && location.pathname.startsWith("/shop")) {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    // Prevent non-admin access to admin routes
    if (isAuthenticated && user?.role !== "admin" && location.pathname.startsWith("/admin")) {
      navigate("/unauth-page", { replace: true });
      return;
    }
  }, [isAuthenticated, user, location.pathname, navigate, requireAuth]);

  // Show loading or redirect for unauthenticated users
  if (!isAuthenticated && requireAuth) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}

CheckAuth.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
  children: PropTypes.node.isRequired,
  requireAuth: PropTypes.bool
};

export default CheckAuth;