import React from "react";
import PropTypes from "prop-types";

const AdminStats = ({ stats }) => {
  const formatValue = (value, format) => {
    if (format === "currency") {
      return new Intl.NumberFormat("vi-VN").format(value);
    }
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const statItems = [
    {
      key: "totalSalons",
      label: "Total Salons",
      value: stats.totalSalons,
      subtext: "Active salons in system",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      bgColor: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
    },
    {
      key: "totalBookings",
      label: "Total Bookings",
      value: stats.totalBookings,
      subtext: "All time bookings",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      bgColor: "from-green-500 to-green-600",
      textColor: "text-green-600",
    },
    {
      key: "completedBookings",
      label: "Completed Bookings",
      value: stats.completedBookings,
      subtext: "Successfully completed",
      icon: (
        <svg
          className="w-6 h-6 text-white"
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
      ),
      bgColor: "from-emerald-500 to-emerald-600",
      textColor: "text-emerald-600",
    },
    {
      key: "totalRevenue",
      label: "Total Revenue",
      value: stats.totalRevenue,
      subtext: "Revenue from all salons",
      format: "currency",
      icon: (
        <svg
          className="w-6 h-6 text-white"
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
      ),
      bgColor: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
    },
    {
      key: "cancelledBookings",
      label: "Cancelled",
      value: stats.cancelled,
      subtext: "Regular cancellations",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
      bgColor: "from-red-400 to-red-500",
      textColor: "text-red-500",
    },
    {
      key: "cancelledEarly",
      label: "Cancelled Early",
      value: stats.cancelledEarly,
      subtext: "Early cancellations (3+ hours)",
      icon: (
        <svg
          className="w-6 h-6 text-white"
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
      ),
      bgColor: "from-orange-400 to-orange-500",
      textColor: "text-orange-500",
    },
    {
      key: "cancelledDayOff",
      label: "Cancelled Day Off",
      value: stats.cancelledDayOff,
      subtext: "Cancelled due to stylist day off",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: "from-gray-400 to-gray-500",
      textColor: "text-gray-500",
    },
    {
      key: "totalServices",
      label: "Active Services",
      value: stats.totalServices,
      subtext: "Services being used",
      icon: (
        <svg
          className="w-6 h-6 text-white"
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
      ),
      bgColor: "from-indigo-500 to-indigo-600",
      textColor: "text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statItems.map((item) => (
        <div
          key={item.key}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${item.bgColor} rounded-lg flex items-center justify-center`}
            >
              {item.icon}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatValue(item.value, item.format)}
                {item.format === "currency" && "đ"}
              </p>
              <p className={`text-xs ${item.textColor}`}>{item.subtext}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

AdminStats.propTypes = {
  stats: PropTypes.shape({
    totalSalons: PropTypes.number.isRequired,
    totalBookings: PropTypes.number.isRequired,
    completedBookings: PropTypes.number.isRequired,
    cancelledBookings: PropTypes.number.isRequired,
    totalRevenue: PropTypes.number.isRequired,
    totalServices: PropTypes.number.isRequired,
    cancelled: PropTypes.number.isRequired,
    cancelledEarly: PropTypes.number.isRequired,
    cancelledDayOff: PropTypes.number.isRequired,
  }).isRequired,
};

export default AdminStats;
