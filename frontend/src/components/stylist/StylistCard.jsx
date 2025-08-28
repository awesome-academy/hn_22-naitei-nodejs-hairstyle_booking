import React from "react";
import PropTypes from "prop-types";
import { useAuthContext } from "../../contexts/AuthContext";

const StylistCard = ({ stylist, onBookStylist, onToggleFavourite }) => {
  const { isAuthenticated } = useAuthContext();
  const {
    id,
    fullName,
    email,
    phone,
    avatar,
    rating,
    ratingCount,
    salon,
    favourite,
    createdAt,
  } = stylist;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-${id}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-${id})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-4 h-4 fill-gray-300" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  const handleBookStylist = () => {
    if (onBookStylist) {
      onBookStylist(stylist);
    }
  };

    return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {/* Stylist Avatar */}
        <div className="h-48 bg-gradient-to-br from-pink-400 to-purple-500 relative overflow-hidden">
          {avatar ? (
            <img
              src={avatar}
              alt={fullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`${
              avatar ? "hidden" : "flex"
            } w-full h-full items-center justify-center text-white`}
          >
            <svg
              className="w-16 h-16"
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
          {isAuthenticated && (
            <button
              type="button"
              className="absolute top-3 right-3 z-10"
              onClick={() => onToggleFavourite(id, favourite)}
              aria-label={favourite ? "Unfavourite" : "Favourite"}
            >
              <svg
                className={`w-7 h-7 transition-colors duration-200 ${
                  favourite ? "text-pink-500 fill-pink-500" : "text-gray-300"
                }`}
                fill={favourite ? "currentColor" : "none"}
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
            </button>
          )}
        </div>
        {/* Content */}
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
            {fullName || "Unknown Stylist"}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center space-x-1">
              {renderStars(rating)}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {rating.toFixed(1)} ({ratingCount} reviews)
            </span>
          </div>

          {/* Salon Info */}
          {salon && (
            <div className="flex items-center mb-3 text-gray-600">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
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
              <span className="text-sm font-medium text-pink-600">
                {salon.name}
              </span>
            </div>
          )}

          {/* Contact Info */}
          <div className="space-y-2 mb-4">
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
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm truncate">{email}</span>
            </div>

            {phone && (
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-sm">{phone}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Joined</span>
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {isAuthenticated && (
            <div className="flex space-x-2">
              <button
                onClick={handleBookStylist}
                className="flex-1 border border-pink-500 text-pink-500 py-2 px-4 rounded-lg hover:bg-pink-50 transition-colors duration-200 font-medium text-sm"
              >
                Book Now
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};


StylistCard.propTypes = {
  stylist: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    avatar: PropTypes.string,
    rating: PropTypes.number.isRequired,
    ratingCount: PropTypes.number.isRequired,
    favourite: PropTypes.bool.isRequired,
    salon: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onViewStylist: PropTypes.func,
  onBookStylist: PropTypes.func,
  onToggleFavourite: PropTypes.func,
};

export default StylistCard;
