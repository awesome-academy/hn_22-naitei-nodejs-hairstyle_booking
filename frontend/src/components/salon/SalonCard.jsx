import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const SalonCard = ({ salon, onViewSalon }) => {
  const navigate = useNavigate();

  const {
    id,
    name,
    address,
    avatar,
    phone,
    stylistCount,
    totalBookings,
    createdAt,
  } = salon;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewSalon = () => {
    if (onViewSalon) {
      onViewSalon(salon);
    }
  };

  const handleBookSalon = () => {
    navigate(`/booking?salonId=${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-pink-400 to-purple-500 relative overflow-hidden">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m5 0v-5a2 2 0 00-2-2H8a2 2 0 00-2 2v5m5 0v-5a2 2 0 012-2h2a2 2 0 012 2v5"
              />
            </svg>
          </div>
        )}
        {avatar && (
          <div
            className="w-full h-full items-center justify-center hidden"
            style={{ display: "none" }}
          >
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m5 0v-5a2 2 0 00-2-2H8a2 2 0 00-2 2v5m5 0v-5a2 2 0 012-2h2a2 2 0 012 2v5"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            📍 {address}
          </p>
          {phone && <p className="text-gray-600 text-sm">📞 {phone}</p>}
        </div>

        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Stylists</span>
            <span className="font-medium text-gray-900">{stylistCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Bookings</span>
            <span className="font-medium text-gray-900">{totalBookings}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Since</span>
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleViewSalon}
            className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-200 font-medium text-sm"
          >
            View Details
          </button>
          <button
            onClick={handleBookSalon}
            className="flex-1 border border-pink-500 text-pink-500 py-2 px-4 rounded-lg hover:bg-pink-50 transition-colors duration-200 font-medium text-sm"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

SalonCard.propTypes = {
  salon: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    phone: PropTypes.string,
    stylistCount: PropTypes.number.isRequired,
    totalBookings: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onViewSalon: PropTypes.func,
};

export default SalonCard;
