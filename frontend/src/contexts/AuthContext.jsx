import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const userRole = localStorage.getItem("userRole");
        const userFullName = localStorage.getItem("userFullName");
        const userEmail = localStorage.getItem("userEmail");

        if (token && userId && userRole) {
          const userData = {
            id: userId,
            role: userRole,
            fullName: userFullName,
            email: userEmail,
          };

          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const updateAuthState = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const clearAuthState = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userEmail");
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    updateAuthState,
    clearAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
