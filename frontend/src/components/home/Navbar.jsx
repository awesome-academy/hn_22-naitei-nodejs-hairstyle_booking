import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAuthContext } from "../../contexts/AuthContext";
import logo from "../../assets/logo-icon.png";
import Login from "../auth/Login";

const Navbar = () => {
  const { logout } = useAuth();
  const { isAuthenticated, user, clearAuthState } = useAuthContext();
  const [showLogin, setShowLogin] = useState(false);

  const isCustomer =
    user?.role?.name === "CUSTOMER" || user?.role === "CUSTOMER";
  const shouldShowUserInfo = isAuthenticated && isCustomer;

  const menuItems = [
    { key: "Home", label: "Home" },
    { key: "AboutUs", label: "About Us" },
    { key: "Services", label: "Services", path: "/services" },
    { key: "Salons", label: "Salons", path: "/salons" },
    { key: "Stylists", label: "Stylists", path: "/stylists" },
    ...(isCustomer
      ? [{ key: "My Booking", label: "My Booking", path: "/booking" }]
      : []),
  ];

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    logout();
    clearAuthState();
    window.location.href = "/";
  };

  return (
    <>
      <nav className="bg-pink-500 text-white py-4 px-6 flex justify-between items-center shadow-lg sticky top-0 z-10">
        <Link to="/">
          <img src={logo} alt="logo" className="h-12 w-auto" />
        </Link>

        <ul className="flex space-x-6 text-lg font-semibold">
          {menuItems.map(({ key, label, path }) => (
            <li key={key}>
              <Link
                to={key === "Home" ? "/" : `${path}`}
                className="text-white hover:text-gray-200 transition duration-200 relative"
                onClick={() => scrollToSection(key)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center space-x-4">
          {shouldShowUserInfo ? (
            <div className="flex items-center space-x-2">
              <Link
                to="/profile"
                className="flex items-center bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold transition duration-200"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
                <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded">
                  {user.role?.name || user.role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-200 font-semibold transition duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-white text-pink-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {showLogin && (
        <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </>
  );
};

export default Navbar;
