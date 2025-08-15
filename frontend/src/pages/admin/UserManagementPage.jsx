import React from 'react';
import UserManagement from '../../components/userManagement/UserManagement';

const UserManagementPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <UserManagement />
      </div>
    </div>
  );
};

export default UserManagementPage;