import React from "react";
import PropTypes from "prop-types";
import LoadingSpinner from "../common/LoadingSpinner";

const ServiceSelection = ({
  services,
  selectedServiceIds,
  onServicesSelect,
  loading,
}) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (services.length === 0) {
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <p className="text-gray-600">No services available</p>
      </div>
    );
  }

  const handleServiceToggle = (serviceId) => {
    const newSelectedIds = selectedServiceIds.includes(serviceId)
      ? selectedServiceIds.filter((id) => id !== serviceId)
      : [...selectedServiceIds, serviceId];

    onServicesSelect(newSelectedIds);
  };

  const getTotalPrice = () => {
    const selectedServices = services.filter((service) =>
      selectedServiceIds.includes(service.id)
    );
    return selectedServices.reduce(
      (total, service) => total + service.price,
      0
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">Select the services you&apos;d like to book:</p>
        {selectedServiceIds.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {selectedServiceIds.length} service(s) selected
            </p>
            <p className="text-lg font-semibold text-pink-600">
              Total: {getTotalPrice().toLocaleString("vi-VN")}đ
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const isSelected = selectedServiceIds.includes(service.id);

          return (
            <div
              key={service.id}
              onClick={() => handleServiceToggle(service.id)}
              className={`
                border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                ${
                  isSelected
                    ? "border-pink-500 bg-pink-50 ring-2 ring-pink-200"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Service Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {service.name}
                  </h3>

                  {service.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {service.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-medium text-gray-900">
                        {service.price.toLocaleString("vi-VN")}đ
                      </span>
                    </div>

                    {service.duration && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <span className="text-gray-700">
                          {service.duration} minutes
                        </span>
                      </div>
                    )}

                    {service.totalBookings && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        {service.totalBookings} bookings
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 ml-4">
                  <div
                    className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
                    ${
                      isSelected
                        ? "bg-pink-500 border-pink-500"
                        : "border-gray-300 hover:border-pink-400"
                    }
                  `}
                  >
                    {isSelected && (
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
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedServiceIds.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
          <p className="text-sm text-yellow-700">
            Please select at least one service to continue.
          </p>
        </div>
      )}
    </div>
  );
};

ServiceSelection.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      price: PropTypes.number.isRequired,
      duration: PropTypes.number,
      totalBookings: PropTypes.number,
    })
  ).isRequired,
  selectedServiceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onServicesSelect: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default ServiceSelection;
