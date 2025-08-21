import React, { useState, useEffect, useCallback } from "react";
import { useSalons } from "../../hooks/useSalons";
import SalonFilters from "./SalonFilters";
import SalonTable from "./SalonTable";
import CreateSalonModal from "./CreateSalonModal";
import EditSalonModal from "./EditSalonModal";
import DeleteSalonModal from "./DeleteSalonModal";
import Pagination from "../common/Pagination";
import LoadingSpinner from "../common/LoadingSpinner";

const SalonManagement = () => {
  const {
    salons,
    loading,
    error,
    pagination,
    fetchSalons,
    createSalon,
    updateSalon,
    deleteSalon,
  } = useSalons();

  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });

  const [modals, setModals] = useState({
    create: false,
    edit: false,
    delete: false,
  });

  const [selectedSalon, setSelectedSalon] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSalons(filters);
  }, [fetchSalons, filters]);

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

  const openModal = useCallback((type, salon = null) => {
    setSelectedSalon(salon);
    setModals((prev) => ({ ...prev, [type]: true }));
  }, []);

  const closeModal = useCallback((type) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedSalon(null);
  }, []);

  const handleCreateSalon = useCallback(
    async (salonData) => {
      const result = await createSalon(salonData);

      if (result.success) {
        closeModal("create");
        fetchSalons(filters);
        showMessage({
          type: "success",
          text: "Salon created successfully!",
        });
      }

      return result;
    },
    [createSalon, fetchSalons, filters, closeModal, showMessage]
  );

  const handleUpdateSalon = useCallback(
    async (salonData) => {
      const result = await updateSalon(selectedSalon.id, salonData);

      if (result.success) {
        closeModal("edit");
        fetchSalons(filters);
        showMessage({
          type: "success",
          text: "Salon updated successfully!",
        });
      }

      return result;
    },
    [updateSalon, selectedSalon, fetchSalons, filters, closeModal, showMessage]
  );

  const handleDeleteSalon = useCallback(async () => {
    const result = await deleteSalon(selectedSalon.id);

    if (result.success) {
      closeModal("delete");
      fetchSalons(filters);
      showMessage({
        type: "success",
        text: "Salon deleted successfully!",
      });
    } else {
      showMessage({
        type: "error",
        text: result.error || "Failed to delete salon",
      });
    }

    return result;
  }, [
    deleteSalon,
    selectedSalon,
    fetchSalons,
    filters,
    closeModal,
    showMessage,
  ]);

  if (loading && salons.length === 0) {
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
            Total: {pagination.totalItems} salons
          </p>
        </div>

        <button
          onClick={() => openModal("create")}
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
          Create Salon
        </button>
      </div>

      <SalonFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <SalonTable
          salons={salons}
          loading={loading}
          onEdit={(salon) => openModal("edit", salon)}
          onDelete={(salon) => openModal("delete", salon)}
        />
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <CreateSalonModal
        isOpen={modals.create}
        onClose={() => closeModal("create")}
        onCreateSalon={handleCreateSalon}
      />

      <EditSalonModal
        isOpen={modals.edit}
        onClose={() => closeModal("edit")}
        onUpdateSalon={handleUpdateSalon}
        salon={selectedSalon}
      />

      <DeleteSalonModal
        isOpen={modals.delete}
        onClose={() => closeModal("delete")}
        onDeleteSalon={handleDeleteSalon}
        salon={selectedSalon}
      />
    </div>
  );
};

export default SalonManagement;
