import React from "react";
import PropTypes from "prop-types";

const ManagerWelcomeCard = ({ salonInfo }) => {

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Welcome to {salonInfo.name}!
          </h2>
          <p className="text-blue-100 mb-1">{salonInfo.address}</p>
          <p className="text-blue-200 text-sm">
            Manage your salon operations efficiently
          </p>
        </div>
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8"
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
        </div>
      </div>
    </div>
  );
};

ManagerWelcomeCard.propTypes = {
  salonInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
};

export default ManagerWelcomeCard;
