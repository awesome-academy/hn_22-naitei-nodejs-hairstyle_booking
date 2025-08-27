import React from 'react';
import { useNavigate } from 'react-router-dom';

import { BellAlertIcon } from '@heroicons/react/24/solid';

const NotificationBellSimple = ({ isAuthenticated, userRole }) => {
  const navigate = useNavigate();

  if (!isAuthenticated || userRole !== 'CUSTOMER') {
    return null;
  }

  const handleBellClick = () => {
    navigate('/notifications'); 
  };

  return (
    <button
      onClick={handleBellClick}
      className="relative bg-white/20 hover:bg-white/30 p-2 rounded-lg transition duration-200" // Tailwind classes
    >
      <BellAlertIcon className="h-6 w-6 text-yellow-400" />
    </button>
  );
};

export default NotificationBellSimple;