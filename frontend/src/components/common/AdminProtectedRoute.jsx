import React from 'react';
import ProtectedRoute from './ProtectedRoute';
import PropTypes from 'prop-types'

const AdminProtectedRoute = ({ children }) => {
  return (
    <ProtectedRoute 
      allowedRoles={['ADMIN']} 
      redirectTo="/admin-login"
    >
      {children}
    </ProtectedRoute>
  );
};

AdminProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default AdminProtectedRoute;