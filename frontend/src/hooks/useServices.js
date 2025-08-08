import { useState, useEffect } from "react";
import { serviceApi } from "../api/services/serviceApi";

export const useServices = (initialParams = {}) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const fetchServices = async (params = initialParams) => {
    try {
      setLoading(true);
      setError(null);
      const cleanParams = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          // Convert number strings to actual numbers for API
          if (
            ["minPrice", "maxPrice", "maxDuration", "page", "limit"].includes(
              key
            )
          ) {
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue > 0) {
              cleanParams[key] = numValue;
            }
          } else {
            cleanParams[key] = value;
          }
        }
      });
      const response = await serviceApi.getServices(cleanParams);

      const { data, pagination: paginationData } = response.data;

      setServices(data || []);
      setPagination(
        paginationData || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        }
      );
    } catch (err) {
      console.error("Error fetching services:", err);
      console.error("Error response:", err.response?.data);

      setError(
        err.response?.data?.message || err.message || "Failed to fetch services"
      );
      setServices([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      });
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData) => {
    try {
      const response = await serviceApi.createService(serviceData);
      await fetchServices(); // Refresh list
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to create service",
      };
    }
  };

  const updateService = async (id, serviceData) => {
    try {
      const response = await serviceApi.updateService(id, serviceData);
      await fetchServices(); // Refresh list
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update service",
      };
    }
  };

  const deleteService = async (id) => {
    try {
      await serviceApi.deleteService(id);
      await fetchServices(); // Refresh list
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to delete service",
      };
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    pagination,
    fetchServices,
    createService,
    updateService,
    deleteService,
    refetch: fetchServices,
  };
};

export const useServiceDetail = (id) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await serviceApi.getServiceById(id);
        setService(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch service");
        console.error("Error fetching service:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  return { service, loading, error };
};
