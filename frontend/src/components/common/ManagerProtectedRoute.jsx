import React from 'react';
import PropTypes from 'prop-types';
import ProtectedRoute from './ProtectedRoute';

const ManagerProtectedRoute = ({ children }) => {
  return (
    <ProtectedRoute 
      allowedRoles={['MANAGER']} 
      redirectTo="/admin-login"
    >
      {children}
    </ProtectedRoute>
  );
};

ManagerProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ManagerProtectedRoute;