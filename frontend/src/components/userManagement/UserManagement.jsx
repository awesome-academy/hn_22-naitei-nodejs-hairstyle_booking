import React, { useState, useEffect, useCallback } from "react";
import { useUsers } from "../../hooks/useUsers";
import UserFilters from "./UserFilters";
import UserTable from "./UserTable";
import CreateUserModal from "./CreateUserModal";
import Pagination from "../common/Pagination";
import LoadingSpinner from "../common/LoadingSpinner";

const UserManagement = () => {
  const {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createStylist,
    createManager,
    updateUserStatus,
  } = useUsers();
  const [filters, setFilters] = useState({
    role: "",
    search: "",
    page: 1,
    limit: 20,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  useEffect(() => {
    fetchUsers(filters);
  }, [fetchUsers, filters]);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, 
    }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleCreateUser = useCallback(
    async (userData) => {
      let result;

      if (userData.role === "STYLIST") {
        result = await createStylist(userData);
      } else if (userData.role === "MANAGER") {
        result = await createManager(userData);
      }

      if (result.success) {
        setIsCreateModalOpen(false);
        fetchUsers(filters);
      }

      return result;
    },
    [createStylist, createManager, fetchUsers, filters]
  );

  const handleStatusChange = useCallback(
    async (userId, isActive) => {
      const result = await updateUserStatus(userId, { isActive });

      if (result.success) {
        fetchUsers(filters);
      }

      return result;
    },
    [updateUserStatus, fetchUsers, filters]
  );

  const canCreateManager = userRole === "ADMIN";
  const canCreateStylist = userRole === "ADMIN" || userRole === "MANAGER";

  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage{" "}
            {userRole === "ADMIN" ? "all users" : "stylists in your salon"}
          </p>
        </div>

        {(canCreateManager || canCreateStylist) && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create User
          </button>
        )}
      </div>

      <UserFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        userRole={userRole}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <UserTable
          users={users}
          loading={loading}
          onStatusChange={handleStatusChange}
          userRole={userRole}
        />
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateUser={handleCreateUser}
        userRole={userRole}
      />
    </div>
  );
};

export default UserManagement;
