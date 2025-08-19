import React, { useState, useEffect, useCallback } from "react";
import { useServices } from "../../hooks/useServices";
import ServiceFilters from "../service/ServiceFilters";
import ServiceTable from "./ServiceTable";
import CreateServiceModal from "./CreateServiceModal";
import EditServiceModal from "./EditServiceModal";
import DeleteServiceModal from "./DeleteServiceModal";
import Pagination from "../common/Pagination";
import LoadingSpinner from "../common/LoadingSpinner";

const ServiceManagement = () => {
  const {
    services,
    loading,
    error,
    pagination,
    fetchServices,
    createService,
    updateService,
    deleteService,
  } = useServices();

  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    maxDuration: "",
    page: 1,
    limit: 10,
  });

  const [modals, setModals] = useState({
    create: false,
    edit: false,
    delete: false,
  });

  const [selectedService, setSelectedService] = useState(null);
  const [message, setMessage] = useState(null);

  // Sử dụng useEffect với dependency array rõ ràng
  useEffect(() => {
    fetchServices(filters);
  }, [filters.search, filters.minPrice, filters.maxPrice, filters.maxDuration, filters.page, filters.limit]);

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

  const openModal = useCallback((type, service = null) => {
    setSelectedService(service);
    setModals((prev) => ({ ...prev, [type]: true }));
  }, []);

  const closeModal = useCallback((type) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedService(null);
  }, []);

  const handleCreateService = useCallback(
    async (serviceData) => {
      const result = await createService(serviceData);

      if (result.success) {
        closeModal("create");
        fetchServices(filters);
        showMessage({
          type: "success",
          text: "Service created successfully!",
        });
      }

      return result;
    },
    [createService, filters, closeModal, showMessage, fetchServices]
  );

  const handleUpdateService = useCallback(
    async (serviceData) => {
      const result = await updateService(selectedService.id, serviceData);

      if (result.success) {
        closeModal("edit");
        fetchServices(filters);
        showMessage({
          type: "success",
          text: "Service updated successfully!",
        });
      }

      return result;
    },
    [updateService, selectedService, filters, closeModal, showMessage, fetchServices]
  );

  const handleDeleteService = useCallback(async () => {
    const result = await deleteService(selectedService.id);

    if (result.success) {
      closeModal("delete");
      fetchServices(filters);
      showMessage({
        type: "success",
        text: "Service deleted successfully!",
      });
    } else {
      showMessage({
        type: "error",
        text: result.error || "Failed to delete service",
      });
    }

    return result;
  }, [deleteService, selectedService, filters, closeModal, showMessage, fetchServices]);

  if (loading && services.length === 0) {
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
          <p className="text-gray-600 mt-1">
            Total: {pagination.totalItems} services
          </p>
        </div>

        <button
          onClick={() => openModal("create")}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
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
          Create Service
        </button>
      </div>

      <ServiceFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ServiceTable
          services={services}
          loading={loading}
          onEdit={(service) => openModal("edit", service)}
          onDelete={(service) => openModal("delete", service)}
        />
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <CreateServiceModal
        isOpen={modals.create}
        onClose={() => closeModal("create")}
        onCreateService={handleCreateService}
      />

      <EditServiceModal
        isOpen={modals.edit}
        onClose={() => closeModal("edit")}
        onUpdateService={handleUpdateService}
        service={selectedService}
      />

      <DeleteServiceModal
        isOpen={modals.delete}
        onClose={() => closeModal("delete")}
        onDeleteService={handleDeleteService}
        service={selectedService}
      />
    </div>
  );
};

export default ServiceManagement;