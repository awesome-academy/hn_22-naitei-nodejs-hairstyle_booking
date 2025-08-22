import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo-icon.png";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const userRole = localStorage.getItem("userRole");
  const isManager = userRole === "MANAGER";

  const adminMenuItems = [
    {
      key: "users",
      label: "User Management",
      path: "/user-management",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
    {
      key: "salons",
      label: "Salon Management",
      path: "/admin/salons",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      key: "services",
      label: "Service Management",
      path: "/admin/services",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      key: "bookings",
      label: "Booking Management",
      path: "/admin/bookings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    }
  ];

  const managerMenuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      path: "/manager/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v10a2 2 0 01-2 2H10a2 2 0 01-2-2V5z"
          />
        </svg>
      ),
    },
    {
      key: "stylists",
      label: "Stylist Management",
      path: "/manager/stylists",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
    {
      key: "bookings",
      label: "Booking Management",
      path: "/manager/bookings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      key: "dayoff",
      label: "Day Off Requests",
      path: "/manager/dayoff",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  const menuItems = isManager ? managerMenuItems : adminMenuItems;

  const isActive = (path) => {
    return (
      location.pathname === path ||
      (path !== "/user-management" && location.pathname.startsWith(path))
    );
  };

  return (
    <>
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 bottom-0 overflow-y-auto bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 text-white z-50
        transform transition-all duration-300 ease-in-out
        ${
          isCollapsed
            ? "-translate-x-full lg:translate-x-0 lg:w-16"
            : "translate-x-0 w-64"
        }
        lg:relative lg:transform-none lg:flex-shrink-0
      `}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/20 h-16">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-8 w-8" />
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold">
                  {isManager ? "Manager Portal" : "Admin Portal"}
                </h1>
                <p className="text-xs text-blue-200">
                  {isManager ? "Salon Management" : "Hair Salon Management"}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.key}>
                <Link
                  to={item.path}
                  className={`
                    group flex items-center px-3 py-3 text-sm font-medium rounded-lg
                    transition-all duration-200 relative
                    ${
                      isActive(item.path)
                        ? "bg-white/20 text-white shadow-lg border-r-4 border-blue-400"
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }
                  `}
                  title={isCollapsed ? item.label : ""}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="flex-shrink-0">{item.icon}</div>
                    {!isCollapsed && (
                      <span className="ml-3 truncate">{item.label}</span>
                    )}
                  </div>

                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-2 space-y-2 border-t border-white/20">
          <Link
            to="/"
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {!isCollapsed && <span className="ml-2">Main Site</span>}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center justify-center px-3 py-2 text-sm font-medium text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {!isCollapsed && <span className="ml-2">Collapse</span>}
          </button>
        </div>
      </aside>

      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 z-40 lg:hidden bg-gray-900 text-white p-2 rounded-lg shadow-lg"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}
    </>
  );
};

export default AdminSidebar;
