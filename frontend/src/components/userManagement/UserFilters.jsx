import React from "react";
import PropTypes from "prop-types";

const UserFilters = ({ filters, onFiltersChange, userRole }) => {
  const handleInputChange = (key, value) => {
    onFiltersChange({ [key]: value });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      role: userRole === "MANAGER" ? "STYLIST" : "",
      search: "",
      page: 1,
    });
  };

  const hasActiveFilters = () => {
    if (userRole === "MANAGER") {
      return filters.search !== "";
    }
    return filters.role !== "" || filters.search !== "";
  };

  const getFilteredRoleOptions = () => {
    const allOptions = [
      { value: "", label: "All Roles" },
      { value: "CUSTOMER", label: "Customers" },
      { value: "STYLIST", label: "Stylists" },
      { value: "MANAGER", label: "Managers" },
      { value: "ADMIN", label: "Admins" },
    ];

    if (userRole === "MANAGER") {
      return [{ value: "STYLIST", label: "Stylists" }];
    }

    return allOptions;
  };

  const roleOptions = getFilteredRoleOptions();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters() && (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            Active filters
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className={userRole === "ADMIN" ? "md:col-span-6" : "md:col-span-8"}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by name, email..."
            value={filters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {userRole === "ADMIN" && (
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={userRole === "ADMIN" ? "md:col-span-2" : "md:col-span-4"}>
          <button
            onClick={handleClearFilters}
            disabled={!hasActiveFilters()}
            className={`w-full px-4 py-2 border rounded-lg transition-all duration-200 font-medium ${
              hasActiveFilters()
                ? "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
                : "text-gray-400 border-gray-200 cursor-not-allowed bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Clear</span>
            </div>
          </button>
        </div>
      </div>

      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            
            {filters.search && (
              <div className="flex items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                <span className="text-xs text-blue-700 mr-1">Search:</span>
                <span className="text-xs font-medium text-blue-800 mr-2">&quot;{filters.search}&quot;</span>
                <button
                  onClick={() => handleInputChange("search", "")}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {filters.role && userRole === "ADMIN" && (
              <div className="flex items-center bg-green-50 border border-green-200 rounded-full px-3 py-1">
                <span className="text-xs text-green-700 mr-1">Role:</span>
                <span className="text-xs font-medium text-green-800 mr-2">
                  {roleOptions.find(opt => opt.value === filters.role)?.label}
                </span>
                <button
                  onClick={() => handleInputChange("role", "")}
                  className="text-green-500 hover:text-green-700"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

UserFilters.propTypes = {
  filters: PropTypes.shape({
    role: PropTypes.string,
    search: PropTypes.string, 
  }).isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default UserFilters;