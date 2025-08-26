import React from 'react';
import PropTypes from 'prop-types';
import ProtectedRoute from './ProtectedRoute';

const CustomerProtectedRoute = ({ children }) => {
  return (
    <ProtectedRoute 
      allowedRoles={['CUSTOMER']} 
      redirectTo="/login"
    >
      {children}
    </ProtectedRoute>
  );
};

CustomerProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CustomerProtectedRoute;