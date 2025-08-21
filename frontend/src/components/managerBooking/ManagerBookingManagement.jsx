// frontend/src/components/managerBooking/ManagerBookingManagement.jsx
import React, { useState, useEffect } from "react";
import ManagerBookingFilters from "./ManagerBookingFilters";
import ManagerBookingTable from "./ManagerBookingTable";
import LoadingSpinner from "../common/LoadingSpinner";

const ManagerBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    date: "",
    stylist: "",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with real API call
      setTimeout(() => {
        const mockBookings = [
          {
            id: 1,
            customerName: "Nguyễn Văn A",
            customerPhone: "0901234567",
            stylistName: "Trần Thị B",
            service: "Hair Cut & Style",
            date: "2024-01-15",
            time: "09:00",
            status: "CONFIRMED",
            totalAmount: 250000,
          },
          {
            id: 2,
            customerName: "Lê Thị C",
            customerPhone: "0902345678",
            stylistName: "Phạm Văn D",
            service: "Hair Coloring",
            date: "2024-01-15",
            time: "10:30",
            status: "PENDING",
            totalAmount: 500000,
          },
        ];

        setBookings(mockBookings);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: mockBookings.length,
          itemsPerPage: 10,
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    }
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
    try {
      // TODO: Implement API call to update booking status
      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ManagerBookingFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Bookings Table */}
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