import React from "react";
import PropTypes from "prop-types";

const ServiceCard = ({ service, onBookService }) => {
  const { id, name, description, price, duration, totalBookings } = service;

  const handleBookService = () => {
    if (onBookService) {
      onBookService(id); 
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
            {name}
          </h3>
          <span className="text-2xl font-bold text-pink-600">
            {price.toLocaleString("vi-VN")}đ
          </span>
        </div>

        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {description}
          </p>
        )}

        <div className="space-y-2 mb-4">
          {duration && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
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
                Duration:
              </span>
              <span className="font-medium text-gray-900">
                {duration} minutes
              </span>
            </div>
          )}

          {totalBookings > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Bookings:
              </span>
              <span className="font-medium text-gray-900">{totalBookings}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleBookService}
          className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-200 font-medium"
        >
          Book This Service
        </button>
      </div>
    </div>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    duration: PropTypes.number,
    totalBookings: PropTypes.number,
  }).isRequired,
  onBookService: PropTypes.func.isRequired, 
};

export default ServiceCard;
