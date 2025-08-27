import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const StylistHeader = () => {
  const { logout } = useAuth();
  const { user, clearAuthState } = useAuthContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    clearAuthState();
    window.location.href = "/login";
  };

  const getCurrentTime = () => {
    return new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-30 w-full">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex-1"></div>

          <div className="flex items-center justify-center flex-1">
            <div className="text-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 font-medium">Current Time</div>
              <div className="text-sm font-semibold text-gray-700">{getCurrentTime()}</div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 flex-1">
            <button
                  onClick={() => (window.location.href = "/stylist-dashboard/notifications")}
                  className="relative bg-white p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-transparent"
                >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-3-3V9a6 6 0 10-12 0v5l-3 3h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute -top-1 -right-1 block h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex bg-white items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 border border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center border-2 border-gray-200 shadow-sm">
                        <svg
                          className="w-4 h-4 text-gray-400"
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
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-700">
                      {user?.fullName || "Stylist"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.role || "STYLIST"}
                    </div>
                  </div>

                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                        <svg
                          className="w-5 h-5 text-gray-500"
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
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {user?.fullName || "Stylist"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user?.email || "stylist@example.com"}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {user?.role || "STYLIST"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center space-x-3 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StylistHeader;
