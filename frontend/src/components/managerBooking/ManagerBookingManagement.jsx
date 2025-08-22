import React, { useState, useEffect } from "react";
import ManagerBookingFilters from "./ManagerBookingFilters";
import ManagerBookingTable from "./ManagerBookingTable";
import LoadingSpinner from "../common/LoadingSpinner";
import { useBookings } from "../../hooks/useBookings";

const ManagerBookingManagement = () => {
  const {
    bookings,
    loading,
    error,
    pagination,
    fetchBookings,
    updateBookingStatus,
  } = useBookings();

  const [filters, setFilters] = useState({
    status: "",
    date: "",
    stylist: "",
    page: 1,
    limit: 10,
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchBookings(filters);
  }, [filters, fetchBookings]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    const result = await updateBookingStatus(bookingId, newStatus);
    
    if (result.success) {
      showMessage({
        type: "success",
        text: `Booking status updated to ${newStatus.toLowerCase()} successfully!`
      });
    } else {
      showMessage({
        type: "error",
        text: result.error
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message && (
        <div className={`px-4 py-3 rounded-lg flex items-center ${
          message.type === "success"
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          <svg className={`w-5 h-5 mr-3 flex-shrink-0 ${
            message.type === "success" ? "text-green-500" : "text-red-500"
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {message.type === "success" ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          {message.text}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error Loading Bookings</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={() => fetchBookings(filters)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      <ManagerBookingFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <ManagerBookingTable
        bookings={bookings}
        pagination={pagination}
        onPageChange={handlePageChange}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default ManagerBookingManagement;