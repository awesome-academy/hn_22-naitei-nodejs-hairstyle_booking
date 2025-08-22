import { useState, useCallback } from "react";
import { userApi } from "../api/services/userApi";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });

  const fetchUsers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const cleanParams = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          if (["page", "limit"].includes(key)) {
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue > 0) {
              cleanParams[key] = numValue;
            }
          } else {
            cleanParams[key] = value;
          }
        }
      });

      console.log("Fetching users with params:", cleanParams);

      const response = await userApi.getUsers(cleanParams);
      console.log("Users API response:", response.data);

      const { data, pagination: paginationData } = response.data;

      setUsers(data || []);
      setPagination(
        paginationData || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 20,
        }
      );
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
      setUsers([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const createStylist = useCallback(async (stylistData) => {
    try {
      const response = await userApi.createStylist(stylistData);
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to create stylist",
      };
    }
  }, []);

  const createManager = useCallback(async (managerData) => {
    try {
      const response = await userApi.createManager(managerData);
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to create manager",
      };
    }
  }, []);

  const updateUserStatus = useCallback(async (userId, statusData) => {
    try {
      const response = await userApi.updateUserStatus(userId, statusData);
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update user status",
      };
    }
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createStylist,
    createManager,
    updateUserStatus,
    refetch: fetchUsers,
  };
};
