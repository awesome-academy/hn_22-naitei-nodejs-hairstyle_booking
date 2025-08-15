import React from "react";
import PropTypes from "prop-types";

const LoadingSpinner = ({ size = "default", text = "Loading..." }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-8 w-8",
    large: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeClasses[size]}`}
      ></div>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["small", "default", "large"]),
  text: PropTypes.string,
};

export default LoadingSpinner;
