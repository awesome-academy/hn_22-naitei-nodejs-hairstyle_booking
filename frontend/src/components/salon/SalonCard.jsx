import React from 'react';
import PropTypes from 'prop-types';

const SalonCard = ({ salon, onViewSalon }) => {
  const {
    // eslint-disable-next-line no-unused-vars
    id,
    name,
    address,
    avatar,
    phone,
    stylistCount,
    totalBookings,
    createdAt
  } = salon;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewSalon = () => {
    if (onViewSalon) {
      onViewSalon(salon);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Salon Avatar/Image */}
      <div className="h-48 bg-gradient-to-br from-pink-400 to-purple-500 relative overflow-hidden">
        {avatar ? (
          <img 
            src={avatar} 
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`${avatar ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-white`}>
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m5 0v-5a2 2 0 00-2-2H8a2 2 0 00-2 2v5m5 0v-5a2 2 0 012-2h2a2 2 0 012 2v5" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
          {name}
        </h3>
        
        <div className="text-gray-600 text-sm mb-4 line-clamp-2">
          <div className="flex items-start">
            <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{address}</span>
          </div>
        </div>

        {/* Salon Statistics */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span className="text-sm">Stylists</span>
            </div>
            <span className="font-semibold text-pink-600">
              {stylistCount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M4 12a8 8 0 0016 0M4 12a8 8 0 018-8m8 8a8 8 0 11-16 0" />
              </svg>
              <span className="text-sm">Total Bookings</span>
            </div>
            <span className="font-medium text-gray-800">
              {totalBookings}
            </span>
          </div>

          {phone && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm">Phone</span>
              </div>
              <span className="text-gray-600 text-sm">
                {phone}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Since</span>
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button 
            onClick={handleViewSalon}
            className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-200 font-medium text-sm"
          >
            View Details
          </button>
          <button 
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
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  onViewSalon: PropTypes.func
};

export default SalonCard;