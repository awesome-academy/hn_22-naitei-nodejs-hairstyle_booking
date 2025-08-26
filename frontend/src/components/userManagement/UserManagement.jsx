import React, { useState, useEffect, useCallback } from "react";
import { useUsers } from "../../hooks/useUsers";
import UserFilters from "./UserFilters";
import UserTable from "./UserTable";
import CreateUserModal from "./CreateUserModal";
import Pagination from "../common/Pagination";
import LoadingSpinner from "../common/LoadingSpinner";
import UserDetail from "./UserDetail";

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
  const [message, setMessage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    if (role === "MANAGER") {
      setFilters((prev) => ({
        ...prev,
        role: "STYLIST",
      }));
    }
  }, []);

  useEffect(() => {
    fetchUsers(filters);
  }, [fetchUsers, filters]);

  const showMessage = useCallback((msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }, []);

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
      } else if (userData.role === "MANAGER" && userRole === "ADMIN") {
        result = await createManager(userData);
      } else {
        return {
          success: false,
          error: "You don't have permission to create this role",
        };
      }

      if (result.success) {
        setIsCreateModalOpen(false);
        fetchUsers(filters);
        showMessage({
          type: "success",
          text: `${userData.role.toLowerCase()} created successfully!`,
        });
      }

      return result;
    },
    [createStylist, createManager, fetchUsers, filters, userRole, showMessage]
  );

  const handleStatusChange = useCallback(
    async (userId, isActive) => {
      const result = await updateUserStatus(userId, { isActive });

      if (result.success) {
        fetchUsers(filters);
        showMessage({
          type: "success",
          text: `User ${isActive ? "activated" : "deactivated"} successfully!`,
        });
      } else {
        showMessage({
          type: "error",
          text: result.error || "Failed to update user status",
        });
      }

      return result;
    },
    [updateUserStatus, fetchUsers, filters, showMessage]
  );

  const canCreateManager = userRole === "ADMIN";
  const canCreateStylist = userRole === "ADMIN" || userRole === "MANAGER";
  const canCreateAnyUser = canCreateManager || canCreateStylist;

  const getPageTitle = () => {
    switch (userRole) {
      case "ADMIN":
        return "User Management";
      case "MANAGER":
        return "Stylist Management";
      default:
        return "User Management";
    }
  };

  const getPageSubtitle = () => {
    switch (userRole) {
      case "ADMIN":
        return "Manage staff accounts - create managers";
      case "MANAGER":
        return "Manage stylists in your salon";
      default:
        return "Manage users in the system";
    }
  };

  const getCreateButtonText = () => {
    switch (userRole) {
      case "ADMIN":
        return "Create Manager";
      case "MANAGER":
        return "Create Stylist";
      default:
        return "Create User";
    }
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`px-4 py-3 rounded-lg flex items-center ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          <svg
            className={`w-5 h-5 mr-3 flex-shrink-0 ${
              message.type === "success" ? "text-green-500" : "text-red-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {message.type === "success" ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
          </svg>
          {message.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-600 mt-1">{getPageSubtitle()}</p>
          {userRole === "MANAGER" && (
            <p className="text-sm text-gray-500 mt-1">
              Total: {pagination.totalItems} stylists in your salon
            </p>
          )}
        </div>

        {canCreateAnyUser && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
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
            {getCreateButtonText()}
          </button>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-500 mt-0.5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              {userRole === "ADMIN"
                ? "Administrator Permissions"
                : "Manager Permissions"}
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              {userRole === "ADMIN"
                ? "You can create and manage managers and stylists. Customers register themselves through the public registration form."
                : "You can create and manage stylists within your assigned salon only."}
            </p>
          </div>
        </div>
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
          onView={async (user) => {
            try {
              const token = localStorage.getItem("token"); // lấy JWT đã lưu khi login

              const res = await fetch(
                `http://localhost:3000/api/users/${user.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
              }

              const data = await res.json();

              setSelectedUser({
                ...data,
                salon: data.salon || null,
                memberTier: data.memberTier || null,
                rating: data.rating || null,
                ratingCount: data.ratingCount || null,
              });
            } catch (err) {
              console.error("Failed to fetch user detail:", err);
              alert("Failed to load user detail");
            }
          }}
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

      {selectedUser && (
        <UserDetail user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default UserManagement;
