import React, { useState } from "react";
import PropTypes from "prop-types";

const ServiceFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    maxDuration: "",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [key]: value };
      const cleanFilters = Object.fromEntries(
        Object.entries(newFilters).filter(
          ([, val]) => val !== "" && val !== null && val !== undefined
        )
      );

      console.log("newFilters:", newFilters);
      console.log("cleanFilters:", cleanFilters);

      onFiltersChange(cleanFilters);

      return newFilters;
    });
  };

  const handleReset = () => {
    const resetFilters = {
      minPrice: "",
      maxPrice: "",
      maxDuration: "",
    };
    setFilters(resetFilters);
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Price Range:
          </label>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            min="0"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            min="0"
          />
          <span className="text-xs text-gray-500 ml-1">VND</span>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Max Duration:
          </label>
          <select
            value={filters.maxDuration}
            onChange={(e) => handleFilterChange("maxDuration", e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="">Any</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
            <option value="180">3 hours</option>
            <option value="240">4 hours</option>
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
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

ServiceFilters.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
};

export default ServiceFilters;
