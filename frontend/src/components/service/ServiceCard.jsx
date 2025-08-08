import React from "react";
import PropTypes from "prop-types";
import { formatPrice, formatDuration } from "../../utils/formatters";

const ServiceCard = ({ service, onBookService }) => {
  const {
    // eslint-disable-next-line no-unused-vars
    id,
    name,
    description,
    price,
    duration,
    totalBookings,
  } = service;

  const handleBookService = () => {
    if (onBookService) {
      onBookService(service);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="h-32 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
        <svg
          className="w-16 h-16 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3V1m0 18v2m8-20v18a4 4 0 004 4h0a4 4 0 004-4V3a2 2 0 00-2-2h-4a2 2 0 00-2 2z"
          />
        </svg>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>

        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <span className="text-sm">Price</span>
            </div>
            <span className="font-semibold text-pink-600 text-lg">
              {formatPrice(price)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <svg
                className="w-4 h-4 mr-2"
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
              <span className="text-sm">Duration</span>
            </div>
            <span className="font-medium text-gray-800">
              {formatDuration(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3a4 4 0 118 0v4M4 12a8 8 0 0016 0M4 12a8 8 0 018-8m8 8a8 8 0 11-16 0"
                />
              </svg>
              <span className="text-sm">Bookings</span>
            </div>
            <span className="text-gray-600">{totalBookings || 0}</span>
          </div>
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
    duration: PropTypes.number.isRequired,
    totalBookings: PropTypes.number,
  }).isRequired,
  onBookService: PropTypes.func,
};

export default ServiceCard;
