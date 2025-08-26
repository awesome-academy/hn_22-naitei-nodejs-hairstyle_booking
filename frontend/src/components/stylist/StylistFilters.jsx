import React, { useState } from "react";
import PropTypes from "prop-types";

const StylistFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    minRating: "",
    salonId: "",
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const cleanFilters = {};
    Object.entries(newFilters).forEach(([filterKey, val]) => {
      if (val !== "" && val !== null && val !== undefined) {
        cleanFilters[filterKey] = val;
      } else {
        cleanFilters[filterKey] = null;
      }
    });

    onFiltersChange(cleanFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      minRating: "",
      salonId: "",
    };
    setFilters(resetFilters);

    onFiltersChange({
      minRating: null,
      salonId: null,
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const getActiveFiltersDisplay = () => {
    const activeFilters = [];

    if (filters.minRating) {
      activeFilters.push({
        label: "Minimum Rating",
        value: `${filters.minRating}+ Stars`,
        key: "minRating",
      });
    }

    if (filters.salonId) {
      activeFilters.push({
        label: "Salon",
        value: filters.salonId,
        key: "salonId",
      });
    }

    return activeFilters;
  };

  const removeFilter = (filterKey) => {
    handleFilterChange(filterKey, "");
  };

  const activeFiltersDisplay = getActiveFiltersDisplay();

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Minimum Rating:
          </label>
          <select
            value={filters.minRating}
            onChange={(e) => handleFilterChange("minRating", e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="">Any Rating</option>
            <option value="1">1+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-sm text-pink-600 hover:text-pink-800 font-medium flex items-center space-x-1"
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
            <span>Clear All Filters</span>
          </button>
        )}
      </div>

      {activeFiltersDisplay.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Active Filters:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeFiltersDisplay.map((filter) => (
              <div
                key={filter.key}
                className="inline-flex items-center space-x-2 bg-pink-100 text-pink-800 text-xs font-medium px-3 py-1.5 rounded-full"
              >
                <span>
                  <strong>{filter.label}:</strong> {filter.value}
                </span>
                <button
                  onClick={() => removeFilter(filter.key)}
                  className="text-pink-600 hover:text-pink-800 transition-colors"
                  title={`Remove ${filter.label} filter`}
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
            ))}
          </div>
        </div>
      )}

      {!hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-gray-500">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm italic">
              No filters applied - showing all stylists
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

StylistFilters.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
};

export default StylistFilters;
