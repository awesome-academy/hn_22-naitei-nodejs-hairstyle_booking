import React from "react";
import PropTypes from "prop-types";
import LoadingSpinner from "../common/LoadingSpinner";

const SalonSelection = ({
  salons,
  selectedSalonId,
  onSalonSelect,
  loading,
}) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (salons.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
        <p className="text-gray-600">No salons available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">
        Choose a salon where you&apos;d like to book your appointment:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {salons.map((salon) => (
          <div
            key={salon.id}
            onClick={() => onSalonSelect(salon.id)}
            className={`
              border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
              ${
                selectedSalonId === salon.id
                  ? "border-pink-500 bg-pink-50 ring-2 ring-pink-200"
                  : "border-gray-200 hover:border-gray-300"
              }
            `}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {salon.avatar ? (
                  <img
                    src={salon.avatar}
                    alt={salon.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
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

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {salon.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {salon.address}
                </p>

                <div className="flex items-center gap-4 mt-2">
                  {salon.stylistCount > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {salon.stylistCount} stylists
                    </span>
                  )}
                  {salon.totalBookings > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {salon.totalBookings} bookings
                    </span>
                  )}
                </div>

                {salon.phone && (
                  <p className="text-sm text-gray-500 mt-1">📞 {salon.phone}</p>
                )}
              </div>

              {selectedSalonId === salon.id && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

SalonSelection.propTypes = {
  salons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      phone: PropTypes.string,
      stylistCount: PropTypes.number,
      totalBookings: PropTypes.number,
    })
  ).isRequired,
  selectedSalonId: PropTypes.string,
  onSalonSelect: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default SalonSelection;
