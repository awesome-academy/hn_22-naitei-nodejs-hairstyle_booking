import React from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, allowedRoles, redirectTo = "/" }) => {
  const { isAuthenticated, user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  const userRole = user.role?.name || user.role;
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const roleRedirects = {
      ADMIN: "/user-management",
      MANAGER: "/manager/dashboard",
      STYLIST: "/stylist-dashboard",
      CUSTOMER: "/",
    };

    return <Navigate to={roleRedirects[userRole] || "/"} replace />;
  }

  return children;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  redirectTo: PropTypes.string,
};

export default ProtectedRoute;
