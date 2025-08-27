import { useState, useCallback, useMemo } from "react";
import { bookingApi } from "../api/services/bookingApi";
import { serviceApi } from "../api/services/serviceApi";
import { stylistApi } from "../api/services/stylistApi";

export const useBooking = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [bookingData, setBookingData] = useState({
    salonId: "",
    stylistId: "",
    serviceIds: [],
    workScheduleId: "",
    timeSlotIds: [],
    totalPrice: 0,
  });

  const [availableData, setAvailableData] = useState({
    stylists: [],
    services: [],
    timeSlots: [],
    workSchedules: [],
  });

  const updateBookingData = useCallback((updates) => {
    setBookingData((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const fetchStylists = useCallback(async (salonId) => {
    try {
      setLoading(true);
      const response = await stylistApi.getStylists({ salonId });
      setAvailableData((prev) => ({
        ...prev,
        stylists: response.data.data || [],
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stylists");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await serviceApi.getServices();
      setAvailableData((prev) => ({
        ...prev,
        services: response.data.data || [],
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTimeSlots = useCallback(async (stylistId) => {
    try {
      setLoading(true);
      const response = await bookingApi.getAvailableTimeSlots(stylistId);
      setAvailableData((prev) => ({
        ...prev,
        timeSlots: response.data || [],
        workSchedules: response.data || [],
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch time slots");
    } finally {
      setLoading(false);
    }
  }, []);

  const totalPrice = useMemo(() => {
    const selectedServices = availableData.services.filter((service) =>
      bookingData.serviceIds.includes(service.id)
    );
    return selectedServices.reduce((sum, service) => sum + service.price, 0);
  }, [bookingData.serviceIds, availableData.services]);

  const submitBooking = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const finalBookingData = {
        ...bookingData,
        totalPrice,
      };

      const response = await bookingApi.createBooking(finalBookingData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create booking";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [bookingData, totalPrice]);

  const resetForm = useCallback(() => {
    setStep(1);
    setBookingData({
      salonId: "",
      stylistId: "",
      serviceIds: [],
      workScheduleId: "",
      timeSlotIds: [],
      totalPrice: 0,
    });
    setAvailableData({
      stylists: [],
      services: [],
      timeSlots: [],
      workSchedules: [],
    });
    setError(null);
  }, []);

  return {
    step,
    setStep,
    bookingData,
    updateBookingData,
    availableData,
    loading,
    error,
    totalPrice,
    fetchStylists,
    fetchServices,
    fetchTimeSlots,
    submitBooking,
    resetForm,
  };
};

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

  const [pendingReviews, setPendingReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchBookings = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await bookingApi.getBookings(cleanParams);
      const { data, pagination: paginationData } = response.data;

      setBookings(data || []);
      setPagination(
        paginationData || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        }
      );

      const completedWithoutReview = (data || []).filter(
        (booking) => booking.status === "COMPLETED" && !booking.review &&
          booking.review !== 0
      );
      setPendingReviews(completedWithoutReview);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
      setBookings([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      });
      setPendingReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBookingById = useCallback(async (bookingId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingApi.getBookingById(bookingId);
      return { success: true, data: response.data };
    } catch (err) {
      const error =
        err.response?.data?.message || "Failed to fetch booking details";
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBookingStatus = useCallback(async (bookingId, status) => {
    try {
      await bookingApi.updateBookingStatus(bookingId, status);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update booking status",
      };
    }
  }, []);

  const submitReview = useCallback(async (bookingId, reviewData) => {
    try {
      setReviewLoading(true);
      const response = await bookingApi.reviewBooking(bookingId, reviewData);
      setPendingReviews((prev) =>
        prev.filter((booking) => booking.id !== bookingId)
      );
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, review: response.data }
            : booking
        )
      );

      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to submit review",
      };
    } finally {
      setReviewLoading(false);
    }
  }, []);

  return {
    bookings,
    loading,
    error,
    pagination,
    fetchBookings,
    fetchBookingById,
    updateBookingStatus,
    pendingReviews,
    reviewLoading,
    submitReview,
  };
};

export default useBooking;
