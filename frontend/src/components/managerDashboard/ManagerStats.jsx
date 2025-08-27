import React from "react";
import PropTypes from "prop-types";

const ManagerStats = ({ stats, analyticsData }) => {
  const statItems = [
    {
      key: "totalStylists",
      label: "Total Stylists",
      value: stats.totalStylists,
      subtext: "Active in your salon",
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
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
      subtext: "All bookings (period)",
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
      key: "monthlyRevenue",
      label: "Total Revenue",
      value: stats.monthlyRevenue,
      subtext: "From analytics data",
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
      format: "currency",
    },
  ];

  const formatValue = (value, format) => {
    if (format === "currency") {
      return value.toLocaleString("vi-VN");
    }
    return value.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {analyticsData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Top Stylist Performance
            </h3>
            <div className="space-y-3">
              {analyticsData.stylists
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 3)
                .map((stylist, index) => (
                  <div key={stylist.stylistId} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {stylist.stylistName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {stylist.completed}/{stylist.totalBookings} completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {stylist.revenue.toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-xs text-gray-500">
                        {stylist.totalBookings > 0 
                          ? Math.round((stylist.completed / stylist.totalBookings) * 100)
                          : 0}% completion
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Popular Services
            </h3>
            <div className="space-y-3">
              {analyticsData.services
                .sort((a, b) => b.usedCount - a.usedCount)
                .slice(0, 5)
                .map((service) => (
                  <div key={service.serviceId} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {service.serviceName}
                      </p>
                    </div>
                    <div className="flex items-center">
                    
                      <span className="text-sm font-medium text-gray-900">
                        {service.usedCount} total count
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ManagerStats.propTypes = {
  stats: PropTypes.shape({
    totalStylists: PropTypes.number.isRequired,
    totalBookings: PropTypes.number.isRequired,
    completedBookings: PropTypes.number.isRequired,
    monthlyRevenue: PropTypes.number.isRequired,
  }).isRequired,
  analyticsData: PropTypes.shape({
    stylists: PropTypes.arrayOf(
      PropTypes.shape({
        stylistId: PropTypes.string.isRequired,
        stylistName: PropTypes.string.isRequired,
        salonId: PropTypes.string.isRequired,
        totalBookings: PropTypes.number.isRequired,
        completed: PropTypes.number.isRequired,
        cancelled: PropTypes.number.isRequired,
        cancelledEarly: PropTypes.number.isRequired,
        cancelledDayOff: PropTypes.number.isRequired,
        revenue: PropTypes.number.isRequired,
      })
    ),
    services: PropTypes.arrayOf(
      PropTypes.shape({
        serviceId: PropTypes.string.isRequired,
        serviceName: PropTypes.string.isRequired,
        salonId: PropTypes.string.isRequired,
        usedCount: PropTypes.number.isRequired,
      })
    ),
  }),
};

export default ManagerStats;