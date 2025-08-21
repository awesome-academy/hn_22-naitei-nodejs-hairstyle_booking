// frontend/src/components/userManagement/UserFilters.jsx
import React from "react";
import PropTypes from "prop-types";

const UserFilters = ({ filters, onFiltersChange, userRole }) => {
  const handleInputChange = (key, value) => {
    onFiltersChange({ [key]: value });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: "",
      page: 1,
      limit: filters.limit,
    };

    if (userRole === "MANAGER") {
      clearedFilters.role = "STYLIST";
    } else {
      clearedFilters.role = "";
    }

    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder={
                userRole === "MANAGER"
                  ? "Search stylists by name or email..."
                  : "Search by name or email..."
              }
              value={filters.search}
              onChange={(e) => handleInputChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {userRole === "ADMIN" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="MANAGER">Manager</option>
              <option value="STYLIST">Stylist</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Show:
          </label>
          <select
            value={filters.limit}
            onChange={(e) =>
              handleInputChange("limit", parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

UserFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default UserFilters;
