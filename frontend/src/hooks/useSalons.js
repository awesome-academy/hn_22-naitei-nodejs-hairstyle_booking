import { useState, useCallback, useEffect } from "react";
import { salonApi } from "../api/services/salonApi";

export const useSalons = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const fetchSalons = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Clean up empty params và convert string numbers to numbers
      const cleanParams = {};

      Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          // Convert number strings to actual numbers for API
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

      console.log("Sending clean params to salon API:", cleanParams);

      const response = await salonApi.getSalons(cleanParams);
      console.log("Salons API response:", response.data);

      const { data, pagination: paginationData } = response.data;

      setSalons(data || []);
      setPagination(
        paginationData || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        }
      );
    } catch (err) {
      console.error("Error fetching salons:", err);
      console.error("Error response:", err.response?.data);

      setError(
        err.response?.data?.message || err.message || "Failed to fetch salons"
      );
      setSalons([]);
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

  const createSalon = useCallback(async (salonData) => {
    try {
      const response = await salonApi.createSalon(salonData);
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to create salon",
      };
    }
  }, []);

  const updateSalon = useCallback(async (id, salonData) => {
    try {
      const response = await salonApi.updateSalon(id, salonData);
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update salon",
      };
    }
  }, []);

  const deleteSalon = useCallback(async (id) => {
    try {
      await salonApi.deleteSalon(id);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to delete salon",
      };
    }
  }, []);

  return {
    salons,
    loading,
    error,
    pagination,
    fetchSalons,
    createSalon,
    updateSalon,
    deleteSalon,
    refetch: fetchSalons,
  };
};

export const useSalonDetail = (id) => {
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSalon = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await salonApi.getSalonById(id);
      setSalon(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch salon");
      console.error("Error fetching salon:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSalon();
  }, [fetchSalon]);

  return { salon, loading, error };
};
