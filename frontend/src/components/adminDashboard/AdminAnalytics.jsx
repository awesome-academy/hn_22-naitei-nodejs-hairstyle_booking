import React from "react";
import PropTypes from "prop-types";

const AdminAnalytics = ({ analyticsData, topSalons, popularServices }) => {
  if (!analyticsData) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Top Salon Performance
        </h3>
        <div className="space-y-4">
          {topSalons.slice(0, 5).map((salon, index) => (
            <div
              key={salon.salonId}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                      ? "bg-gray-400"
                      : index === 2
                      ? "bg-orange-400"
                      : "bg-blue-500"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                    {salon.salonName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {salon.completed}/{salon.totalBookings} completed •{" "}
                    {salon.completionRate}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {salon.revenue.toLocaleString("vi-VN")}đ
                </p>
                <p className="text-xs text-gray-500">
                  {salon.totalBookings} bookings
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Most Popular Services
        </h3>
        <div className="space-y-3">
          {popularServices.slice(0, 8).map((service) => (
            <div
              key={service.serviceId}
              className="flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {service.serviceName}
                </p>
              </div>
              <div className="flex items-center ml-4">
                <span className="text-sm font-medium text-gray-900 min-w-[40px] text-right">
                  {service.usedCount} total count
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

AdminAnalytics.propTypes = {
  analyticsData: PropTypes.object,
  topSalons: PropTypes.array.isRequired,
  popularServices: PropTypes.array.isRequired,
};

export default AdminAnalytics;
