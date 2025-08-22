import React from "react";
import PropTypes from "prop-types";

const ManagerBookingFilters = ({ filters, onFiltersChange }) => {
  const handleInputChange = (key, value) => {
    onFiltersChange({ [key]: value });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      status: "",
      date: "",
      stylist: "",
      page: 1,
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.status !== "" || filters.date !== "" || filters.stylist !== ""
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Booking Filters</h3>
        {hasActiveFilters() && (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            Active filters
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stylist Name
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by stylist name..."
              value={filters.stylist}
              onChange={(e) => handleInputChange("stylist", e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {/* ✅ Clear individual filter button */}
            {filters.stylist && (
              <button
                onClick={() => handleInputChange("stylist", "")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Clear stylist filter"
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
              </button>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
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
              <span className="hidden sm:inline">Clear</span>
            </div>
          </button>
        </div>
      </div>

      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Active filters:
            </span>

            {filters.status && (
              <div className="flex items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                <span className="text-xs text-blue-700 mr-1">Status:</span>
                <span className="text-xs font-medium text-blue-800 mr-2">
                  {filters.status}
                </span>
                <button
                  onClick={() => handleInputChange("status", "")}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <svg
                    className="w-3 h-3"
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
                </button>
              </div>
            )}

            {filters.date && (
              <div className="flex items-center bg-green-50 border border-green-200 rounded-full px-3 py-1">
                <span className="text-xs text-green-700 mr-1">Date:</span>
                <span className="text-xs font-medium text-green-800 mr-2">
                  {new Date(filters.date).toLocaleDateString("vi-VN")}
                </span>
                <button
                  onClick={() => handleInputChange("date", "")}
                  className="text-green-500 hover:text-green-700"
                >
                  <svg
                    className="w-3 h-3"
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
                </button>
              </div>
            )}

            {filters.stylist && (
              <div className="flex items-center bg-purple-50 border border-purple-200 rounded-full px-3 py-1">
                <span className="text-xs text-purple-700 mr-1">Stylist:</span>
                <span className="text-xs font-medium text-purple-800 mr-2">
                  &quot;{filters.stylist}&quot;
                </span>
                <button
                  onClick={() => handleInputChange("stylist", "")}
                  className="text-purple-500 hover:text-purple-700"
                >
                  <svg
                    className="w-3 h-3"
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
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ManagerBookingFilters.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string,
    date: PropTypes.string,
    stylist: PropTypes.string,
  }).isRequired,
  onFiltersChange: PropTypes.func.isRequired,
};

export default ManagerBookingFilters;
