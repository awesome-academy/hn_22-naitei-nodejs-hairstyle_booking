import { useState, useCallback, useEffect } from "react";
import { stylistApi } from "../api/services/stylistApi";

export const useStylists = () => {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const fetchStylists = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const cleanParams = {};

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          return;
        }

        if (value !== "" && value !== undefined) {
          if (["minRating", "page", "limit"].includes(key)) {
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue >= 0) {
              cleanParams[key] = numValue;
            }
          } else {
            cleanParams[key] = value;
          }
        }
      });

      const response = await stylistApi.getStylists(cleanParams);

      const { data, pagination: paginationData } = response.data;

      setStylists(data || []);
      setPagination(
        paginationData || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        }
      );
    } catch (err) {
      console.error("❌ Error fetching stylists:", err);
      console.error("Error response:", err.response?.data);

      setError(
        err.response?.data?.message || err.message || "Failed to fetch stylists"
      );
      setStylists([]);
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

  const createStylist = useCallback(async (stylistData) => {
    try {
      const response = await stylistApi.createStylist(stylistData);
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to create stylist",
      };
    }
  }, []);

  const updateStylist = useCallback(async (id, stylistData) => {
    try {
      const response = await stylistApi.updateStylist(id, stylistData);
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update stylist",
      };
    }
  }, []);

  const deleteStylist = useCallback(async (id) => {
    try {
      await stylistApi.deleteStylist(id);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to delete stylist",
      };
    }
  }, []);

  return {
    stylists,
    loading,
    error,
    pagination,
    fetchStylists,
    createStylist,
    updateStylist,
    deleteStylist,
    refetch: fetchStylists,
  };
};

export const useStylistDetail = (id) => {
  const [stylist, setStylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStylist = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await stylistApi.getStylistById(id);
      setStylist(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stylist");
      console.error("Error fetching stylist:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStylist();
  }, [fetchStylist]);

  return { stylist, loading, error };
};
