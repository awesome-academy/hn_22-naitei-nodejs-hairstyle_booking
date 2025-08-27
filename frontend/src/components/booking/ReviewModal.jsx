import React, { useState } from "react";
import PropTypes from "prop-types";

const ReviewModal = ({
  isOpen,
  onClose,
  booking,
  onSubmit,
  loading = false,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const reviewData = { rating };
    const result = await onSubmit(booking.id, reviewData);

    if (result.success) {
      setRating(0);
      setHoveredRating(0);
      setErrors({});
      onClose();
    } else {
      setErrors({ submit: result.error });
    }
  };

  const getTimeRange = () => {
    if (!booking.timeslots || booking.timeslots.length === 0) {
      return "Time not set";
    }

    try {
      const sortedSlots = [...booking.timeslots].sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );

      const firstSlot = sortedSlots[0];
      const lastSlot = sortedSlots[sortedSlots.length - 1];

      const appointmentDate = new Date(firstSlot.startTime).toLocaleDateString(
        "vi-VN",
        {
          timeZone: "Asia/Ho_Chi_Minh",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );

      const startTime = new Date(firstSlot.startTime).toLocaleTimeString(
        "vi-VN",
        {
          timeZone: "Asia/Ho_Chi_Minh",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }
      );

      const endTime = new Date(lastSlot.endTime).toLocaleTimeString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      return `${appointmentDate} ${startTime}-${endTime}`;
    } catch (error) {
      console.error("Error formatting time range:", error);
      return "Invalid time";
    }
  };

  if (!isOpen || !booking) return null;

  const displayRating = hoveredRating || rating;
  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[70vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-pink-50 to-purple-50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="w-8 h-8 mr-2 bg-pink-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-pink-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405.1L10 14.25l4.068 2.906c.714 1.356 1.6.713 1.405-.1l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Rate Your Experience
          </h2>
        </div>

        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Booking ID
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  #{booking.id.slice(-8)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Salon
                </h3>
                <div className="flex items-start">
                  <svg
                    className="w-4 h-4 text-pink-500 mr-2 mt-1 flex-shrink-0"
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
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.salon?.name || "Unknown Salon"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {booking.salon?.address ||
                        booking.salon?.location ||
                        booking.salon?.fullAddress ||
                        "No address available"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Stylist
                </h3>
                <div className="flex items-start">
                  <svg
                    className="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0"
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
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.stylist?.fullName || "Unknown Stylist"}
                    </p>
                    {booking.stylist?.rating && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <svg
                          className="w-3 h-3 text-yellow-400 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {booking.stylist.rating.toFixed(1)} rating
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Services
                </h3>
                <div className="space-y-2">
                  {booking.services?.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white rounded-lg p-2 border"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">
                            {service.name}
                          </p>
                          {service.duration && (
                            <p className="text-xs text-gray-500">
                              {service.duration} minutes
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {service.price?.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  )) || <p className="text-gray-500">No services</p>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Appointment Time
                </h3>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
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
                  <p className="font-medium text-gray-900">{getTimeRange()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Total Amount
                </h3>
                <p className="text-xl font-bold text-pink-600">
                  {booking.totalPrice?.toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              How would you rate this service? *
            </label>

            <div className="min-h-[120px] flex flex-col items-center justify-center py-4">
              <div className="flex items-center space-x-3 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="relative group outline-none border-none bg-transparent p-0 cursor-pointer"
                    style={{
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <svg
                      className={`w-12 h-12 transition-all duration-200 ${
                        star <= displayRating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      } group-hover:scale-110`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{
                        filter:
                          star <= displayRating
                            ? "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
                            : "none",
                      }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>

              <div className="w-full flex items-center justify-center h-10">
                {displayRating > 0 && (
                  <div className="bg-yellow-50 px-6 py-2 rounded-full border border-yellow-200 max-w-full">
                    <p className="text-lg font-semibold text-gray-700 text-center">
                      {ratingLabels[displayRating]} ({displayRating} ⭐)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {errors.rating && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-red-600 text-sm font-medium">
                  {errors.rating}
                </p>
              </div>
            )}
          </div>

          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 text-white px-8 py-3 rounded-2xl shadow-lg hover:bg-pink-700 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Submit Review
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
            <svg
              className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
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
            <div>
              <p className="text-blue-700 text-sm font-semibold">
                Review Required
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Please complete this review to continue using our booking
                services.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

ReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  booking: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default ReviewModal;
