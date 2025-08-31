import React from "react";
import PropTypes from "prop-types";
import LoadingSpinner from "../common/LoadingSpinner";

const StylistSelection = ({
  stylists,
  selectedStylistId,
  onStylistSelect,
  loading,
  salonName,
}) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  const sortedStylists = [...stylists].sort((a, b) => {
    if (a.favourite === b.favourite) return 0;
    return a.favourite ? -1 : 1;
  });

  if (stylists.length === 0) {
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <p className="text-gray-600">No stylists available at this salon</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {salonName && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Selected Salon:</span> {salonName}
          </p>
        </div>
      )}

      <p className="text-gray-600 mb-4">
        Choose a stylist who will provide your service:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedStylists.map((stylist) => (
          <div
            key={stylist.id}
            onClick={() => onStylistSelect(stylist.id)}
            className={`
              border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
              ${
                selectedStylistId === stylist.id
                  ? "border-pink-500 bg-pink-50 ring-2 ring-pink-200"
                  : "border-gray-200 hover:border-gray-300"
              }
            `}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {stylist.user?.avatar ? (
                  <img
                    src={stylist.user.avatar}
                    alt={stylist.user?.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
                <div
                  className="ml-auto"
                  aria-label={stylist.favourite ? "Unfavourite" : "Favourite"}
                >
                  <svg
                    className={`w-6 h-6 transition-colors duration-200 ${
                      stylist.favourite
                        ? "text-pink-500 fill-pink-500"
                        : "text-gray-300"
                    }`}
                    fill={stylist.favourite ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {stylist.fullName || "Unknown Stylist"}
                </h3>
                <div className="flex items-center mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(stylist.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {(Math.round(stylist.rating) || 0).toFixed(1)} (
                    {stylist.ratingCount || 0} reviews)
                  </span>
                </div>

                {stylist.phone && (
                  <p className="text-sm text-gray-500 mt-1">
                    📞 {stylist.phone}
                  </p>
                )}

                {stylist.totalBookings && (
                  <p className="text-sm text-gray-500 mt-1">
                    {stylist.totalBookings} completed bookings
                  </p>
                )}
              </div>

              {selectedStylistId === stylist.id && (
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

StylistSelection.propTypes = {
  stylists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      user: PropTypes.shape({
        fullName: PropTypes.string,
        avatar: PropTypes.string,
        phone: PropTypes.string,
      }),
      rating: PropTypes.number,
      ratingCount: PropTypes.number,
      totalBookings: PropTypes.number,
    })
  ).isRequired,
  selectedStylistId: PropTypes.string,
  onStylistSelect: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  salonName: PropTypes.string,
};

export default StylistSelection;
