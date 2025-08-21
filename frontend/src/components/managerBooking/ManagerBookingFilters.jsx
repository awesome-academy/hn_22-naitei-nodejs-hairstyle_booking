// frontend/src/components/managerBooking/ManagerBookingFilters.jsx
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

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stylist
          </label>
          <select
            value={filters.stylist}
            onChange={(e) => handleInputChange("stylist", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Stylists</option>
            <option value="stylist1">Trần Thị B</option>
            <option value="stylist2">Phạm Văn D</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleClearFilters}
            className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

ManagerBookingFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
};

export default ManagerBookingFilters;
