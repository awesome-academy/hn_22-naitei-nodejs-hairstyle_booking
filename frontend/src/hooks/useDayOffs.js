import { useState, useCallback } from "react";
import { leaveApi } from "../api/services/leaveApi";

export const useDayOffs = () => {
  const [dayOffs, setDayOffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const fetchDayOffs = useCallback(async (params = {}) => {
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

      const userRole = localStorage.getItem("userRole");
      const response =
        userRole === "MANAGER"
          ? await leaveApi.getManagerDayOffs(cleanParams)
          : await leaveApi.getDayOffs(cleanParams);

      let dayOffsData = [];
      let paginationData = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      };

      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          dayOffsData = response.data.data;
          paginationData = response.data.pagination || paginationData;
        }
        else if (Array.isArray(response.data)) {
          dayOffsData = response.data;
        }
        else if (
          response.data.dayOffs &&
          Array.isArray(response.data.dayOffs)
        ) {
          dayOffsData = response.data.dayOffs;
          paginationData = response.data.pagination || paginationData;
        }
        else if (response.data.leaves && Array.isArray(response.data.leaves)) {
          dayOffsData = response.data.leaves;
          paginationData = response.data.pagination || paginationData;
        }
        else if (response.data && typeof response.data === "object") {
          dayOffsData = [];
          console.warn(
            "⚠️ Unexpected day offs response structure:",
            response.data
          );
        }
      }

      const transformedDayOffs = dayOffsData.map((dayOff) => {
        const stylist = dayOff.stylist || {};
        const user = stylist.user || stylist || {};

        return {
          id: dayOff.id,
          stylistName: user.fullName || user.name || stylist.name || "N/A",
          stylistEmail: user.email || stylist.email || "N/A",
          requestDate: dayOff.createdAt
            ? new Date(dayOff.createdAt).toLocaleDateString("vi-VN")
            : "N/A",
          dayOffDate: dayOff.date
            ? new Date(dayOff.date).toLocaleDateString("vi-VN")
            : "N/A",
          reason: dayOff.reason || "No reason provided",
          status: dayOff.status || "PENDING",
          createdAt: dayOff.createdAt,
          updatedAt: dayOff.updatedAt,
          _original: dayOff,
        };
      });

      setDayOffs(transformedDayOffs);
      setPagination(paginationData);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch day off requests"
      );
      setDayOffs([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDayOffStatus = useCallback(async (dayOffId, status) => {
    try {
      const response = await leaveApi.updateDayOffStatus(dayOffId, status);

      setDayOffs((prev) =>
        prev.map((dayOff) =>
          dayOff.id === dayOffId
            ? { ...dayOff, status, updatedAt: new Date().toISOString() }
            : dayOff
        )
      );

      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update day off status",
      };
    }
  }, []);

  const createDayOff = useCallback(async (dayOffData) => {
    try {
      const response = await leaveApi.createDayOff(dayOffData);
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error:
          err.response?.data?.message || "Failed to create day off request",
      };
    }
  }, []);

  return {
    dayOffs,
    loading,
    error,
    pagination,
    fetchDayOffs,
    updateDayOffStatus,
    createDayOff,
    refetch: fetchDayOffs,
  };
};

export default useDayOffs;
