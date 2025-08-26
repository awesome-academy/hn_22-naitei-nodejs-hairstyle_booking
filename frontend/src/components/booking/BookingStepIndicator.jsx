import React from "react";
import PropTypes from "prop-types";

const BookingStepIndicator = ({ currentStep, preSelectedData }) => {
  const steps = [
    {
      number: 1,
      title: "Salon",
      isSkipped: preSelectedData?.salonId,
    },
    {
      number: 2,
      title: "Services",
      isSkipped: preSelectedData?.serviceIds?.length > 0,
    },
    {
      number: 3,
      title: "Stylist",
      isSkipped: false,
    },
    {
      number: 4,
      title: "Time Slots",
      isSkipped: false,
    },
    {
      number: 5,
      title: "Confirm",
      isSkipped: false,
    },
  ];

  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return "completed";
    if (stepNumber === currentStep) return "current";
    return "upcoming";
  };

  const getStepClasses = (status, isSkipped) => {
    if (isSkipped && status === "completed") {
      return "bg-green-500 text-white border-green-500";
    }

    switch (status) {
      case "completed":
        return "bg-pink-500 text-white border-pink-500";
      case "current":
        return "bg-white text-pink-500 border-pink-500 ring-2 ring-pink-200";
      default:
        return "bg-white text-gray-400 border-gray-300";
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.number);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="relative flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm
                    ${getStepClasses(status, step.isSkipped)}
                  `}
                >
                  {step.isSkipped ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : status === "completed" ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>

                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span
                    className={`text-sm font-medium ${
                      status === "current"
                        ? "text-pink-600"
                        : status === "completed"
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                  {step.isSkipped && (
                    <span className="block text-xs text-green-600">
                      Pre-selected
                    </span>
                  )}
                </div>
              </div>

              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    status === "completed" ? "bg-pink-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

BookingStepIndicator.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  preSelectedData: PropTypes.shape({
    salonId: PropTypes.string,
    serviceIds: PropTypes.arrayOf(PropTypes.string),
    stylistId: PropTypes.string,
  }),
};

export default BookingStepIndicator;
