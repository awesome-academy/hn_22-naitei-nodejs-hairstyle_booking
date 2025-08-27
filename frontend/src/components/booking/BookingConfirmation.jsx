import React from "react";
import PropTypes from "prop-types";

const BookingConfirmation = ({
  salon,
  stylist,
  services,
  timeSlots,
  totalPrice,
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "No date selected";
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "Invalid time";

    try {
      if (timeStr instanceof Date) {
        return timeStr.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      }

      if (typeof timeStr === "string") {
        if (timeStr.includes("T")) {
          return new Date(timeStr).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        } else {
          return timeStr;
        }
      }

      return "Invalid time";
    } catch (error) {
      console.error("Time formatting error:", error);
      return "Invalid time";
    }
  };

  const getTimeRange = () => {
    if (!timeSlots || timeSlots.length === 0) return "No time selected";

    try {
      const sortedSlots = timeSlots.sort((a, b) => {
        const timeA = new Date(a.startTime).getTime();
        const timeB = new Date(b.startTime).getTime();
        return timeA - timeB;
      });

      const startTime = sortedSlots[0].startTime;
      const endTime = sortedSlots[sortedSlots.length - 1].endTime;

      return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    } catch (error) {
      console.error("Error formatting time range:", error);
      return "Time format error";
    }
  };

  const getBookingDate = () => {
    if (!timeSlots || timeSlots.length === 0) return "No date selected";

    try {
      const firstSlot = timeSlots[0];

      if (firstSlot.startTime) {
        return formatDate(firstSlot.startTime);
      }

      if (firstSlot.workSchedule?.date) {
        return formatDate(firstSlot.workSchedule.date);
      }

      if (firstSlot.workSchedule?.workingDate) {
        return formatDate(firstSlot.workSchedule.workingDate);
      }

      return "Unknown date";
    } catch (error) {
      console.error("Error formatting booking date:", error);
      return "Date format error";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Confirm Your Booking
        </h2>
        <p className="text-gray-600">
          Please review your booking details before confirming.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📍 Salon Information
          </h3>
          <div>
            <h4 className="font-medium text-gray-900 text-lg">
              {salon?.name || "Unknown Salon"}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {salon?.address || "No address available"}
            </p>
            {salon?.phone && (
              <p className="text-sm text-gray-600 mt-1">📞 {salon.phone}</p>
            )}
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            ✂️ Your Stylist
          </h3>
          <div className="flex items-center justify-between space-x-3 pt-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 mb-5">
              {stylist?.user?.avatar || stylist?.avatar ? (
                <img
                  src={stylist?.user?.avatar || stylist?.avatar}
                  alt={
                    stylist?.user?.fullName ||
                    stylist?.fullName ||
                    "Stylist Avatar"
                  }
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full bg-gray-300 flex items-center justify-center">
                        <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-500"
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
            </div>

            <div className="flex-1 justify-between">
              <h4 className="font-medium text-gray-900">
                {stylist?.user?.fullName ||
                  stylist?.fullName ||
                  "Unknown Stylist"}
              </h4>
              {(stylist?.user?.email || stylist?.email) && (
                <p className="text-sm text-gray-600">
                  {stylist?.user?.email || stylist?.email}
                </p>
              )}
              {stylist?.rating && (
                <div className="flex items-center mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(stylist.rating)
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
                    {stylist.rating.toFixed(1)} rating
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            💇 Selected Services
          </h3>
          <div className="space-y-3">
            {services && services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {service.name}
                    </h4>
                    {service.description && (
                      <p className="text-sm text-gray-500">
                        {service.description}
                      </p>
                    )}
                    {service.duration && (
                      <p className="text-sm text-gray-500">
                        Duration: {service.duration} minutes
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {service.price.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No services selected</p>
            )}
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🗓️ Appointment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {getBookingDate()}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Time</p>
              <p className="text-lg font-semibold text-gray-900">
                {getTimeRange()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Total Amount
            </h3>
            <p className="text-2xl font-bold text-pink-600">
              {totalPrice ? totalPrice.toLocaleString("vi-VN") : "0"}đ
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Payment will be processed at the salon
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">
          📋 Important Notes:
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Please arrive 10 minutes before your appointment time</li>
          <li>• Cancellations must be made at least 24 hours in advance</li>
          <li>
            • Payment will be processed at the salon after service completion
          </li>
          <li>• Bring a valid ID for verification</li>
        </ul>
      </div>
    </div>
  );
};

BookingConfirmation.propTypes = {
  bookingData: PropTypes.object.isRequired,
  salon: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    phone: PropTypes.string,
    avatar: PropTypes.string,
  }),
  stylist: PropTypes.shape({
    user: PropTypes.shape({
      fullName: PropTypes.string,
      avatar: PropTypes.string,
      email: PropTypes.string,
    }),
    fullName: PropTypes.string,
    avatar: PropTypes.string,
    email: PropTypes.string,
    rating: PropTypes.number,
  }),
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      duration: PropTypes.number,
      description: PropTypes.string,
    })
  ).isRequired,
  timeSlots: PropTypes.arrayOf(
    PropTypes.shape({
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
      workSchedule: PropTypes.shape({
        date: PropTypes.string,
        workingDate: PropTypes.string,
      }),
    })
  ).isRequired,
  totalPrice: PropTypes.number.isRequired,
};

export default BookingConfirmation;
