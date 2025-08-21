import React from "react";
import PropTypes from "prop-types";

const UserFilters = ({ filters, onFiltersChange, userRole }) => {
  const handleSearchChange = (e) => {
    onFiltersChange({ search: e.target.value });
  };

  const handleRoleChange = (e) => {
    onFiltersChange({ role: e.target.value });
  };

  const clearFilters = () => {
    onFiltersChange({ search: "", role: "" });
  };

  const getRoleOptions = () => {
    if (userRole === "ADMIN") {
      return [
        { value: "", label: "All Roles" },
        { value: "CUSTOMER", label: "Customers" },
        { value: "STYLIST", label: "Stylists" },
        { value: "MANAGER", label: "Managers" },
      ];
    } else if (userRole === "MANAGER") {
      return [
        { value: "", label: "All Stylists" },
        { value: "STYLIST", label: "Stylists" },
      ];
    }
    return [];
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search Users
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
          </div>
        </div>

        {/* Role Filter */}
        <div className="md:w-48">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Role
          </label>
          <select
            id="role"
            value={filters.role}
            onChange={handleRoleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {getRoleOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(filters.search || filters.role) && (
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600">
        {filters.search || filters.role ? (
          <span>
            Showing filtered results
            {filters.search && ` for "${filters.search}"`}
            {filters.role && ` in role "${filters.role}"`}
          </span>
        ) : (
          <span>Showing all users</span>
        )}
      </div>
    </div>
  );
};
UserFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default UserFilters;
