import React, { useState, useCallback } from "react";
import { bookingApi } from "../api/services/bookingApi";

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const fetchBookings = useCallback(async (params = {}) => {
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

      const response = await bookingApi.getBookings(cleanParams);
      let bookingsData = [];
      let paginationData = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      };

      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          bookingsData = response.data.data;
          paginationData = response.data.pagination || paginationData;
        }
        else if (Array.isArray(response.data)) {
          bookingsData = response.data;
        }
        else if (
          response.data.bookings &&
          Array.isArray(response.data.bookings)
        ) {
          bookingsData = response.data.bookings;
          paginationData = response.data.pagination || paginationData;
        }
        else if (response.data && typeof response.data === "object") {
          bookingsData = [];
          console.warn("⚠️ Unexpected response structure:", response.data);
        }
      }

      console.log("📋 Processed bookings data:", bookingsData);
      console.log("📄 Pagination data:", paginationData);

      const transformedBookings = bookingsData.map((booking) => {
        const customer = booking.customer || {};
        const stylist = booking.stylist || {};
        const services = booking.services || [];
        const timeslots = booking.timeslots || [];

        return {
          id: booking.id,
          customerName: customer.fullName || customer.name || "N/A",
          customerPhone: customer.phone || booking.customerPhone || "N/A",
          customerEmail: customer.email || booking.customerEmail || "N/A",
          stylistName:
            stylist.fullName || stylist.name || booking.stylistName || "N/A",
          services: Array.isArray(services)
            ? services
                .map((s) => s.name || s.service?.name)
                .filter(Boolean)
                .join(", ") || "N/A"
            : booking.services || "N/A",
          date:
            booking.date ||
            (timeslots[0] && timeslots[0].startTime
              ? new Date(timeslots[0].startTime).toLocaleDateString("vi-VN")
              : "N/A"),
          time:
            booking.time ||
            (timeslots[0] && timeslots[0].startTime
              ? new Date(timeslots[0].startTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"),
          status: booking.status || "UNKNOWN",
          totalAmount: booking.totalPrice || booking.totalAmount || 0,
          createdAt: booking.createdAt,
        };
      });

      setBookings(transformedBookings);
      setPagination(paginationData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
      setBookings([]);
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

  const updateBookingStatus = useCallback(async (bookingId, status) => {
    try {
      const response = await bookingApi.updateBookingStatus(bookingId, status);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );

      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update booking status",
      };
    }
  }, []);

  return {
    bookings,
    loading,
    error,
    pagination,
    fetchBookings,
    updateBookingStatus,
    refetch: fetchBookings,
  };
};

export const useBookingDetail = (id) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooking = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await bookingApi.getBookingById(id);
      setBooking(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch booking");
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  return { booking, loading, error, refetch: fetchBooking };
};

export default useBookings;
