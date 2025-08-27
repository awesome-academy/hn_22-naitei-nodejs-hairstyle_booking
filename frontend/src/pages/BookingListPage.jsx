import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ConfirmModal from "../components/common/ConfirmModal";
import ReviewModal from "../components/booking/ReviewModal";
import { useBookings } from "../hooks/useBookings";

const BookingListPage = () => {
  const navigate = useNavigate();
  const {
    bookings,
    loading,
    error,
    pagination,
    fetchBookings,
    updateBookingStatus,
    pendingReviews,
    reviewLoading,
    submitReview,
  } = useBookings();

  const [filters, setFilters] = useState({
    status: "",
    page: 1,
    limit: 10,
  });

  const [message, setMessage] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBookingInfo, setSelectedBookingInfo] = useState(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReviewBooking, setCurrentReviewBooking] = useState(null);
  const [hasShownAutoReview, setHasShownAutoReview] = useState(false);

  useEffect(() => {
    fetchBookings(filters);
  }, [filters, fetchBookings]);

  useEffect(() => {
    if (pendingReviews.length > 0 && !showReviewModal && !hasShownAutoReview) {
      console.log("Auto-showing review modal for:", pendingReviews[0]);
      setCurrentReviewBooking(pendingReviews[0]);
      setShowReviewModal(true);
      setHasShownAutoReview(true); // ✅ Mark as shown
    }
  }, [pendingReviews, showReviewModal, hasShownAutoReview]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancelClick = (booking) => {
    setSelectedBookingId(booking.id);
    setSelectedBookingInfo({
      salonName: booking.salon.name,
      bookingId: booking.id.slice(-8),
    });
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    if (!selectedBookingId) return;

    setShowCancelModal(false);

    const result = await updateBookingStatus(selectedBookingId, "CANCELLED");

    if (result.success) {
      showMessage({
        type: "success",
        text: `Booking cancelled successfully!`,
      });
      fetchBookings(filters);
    } else {
      showMessage({
        type: "error",
        text: result.error,
      });
    }

    setSelectedBookingId(null);
    setSelectedBookingInfo(null);
  };

  const handleCloseModal = () => {
    setShowCancelModal(false);
    setSelectedBookingId(null);
    setSelectedBookingInfo(null);
  };

  const handleReviewSubmit = async (bookingId, reviewData) => {
    const result = await submitReview(bookingId, reviewData);

    if (result.success) {
      showMessage({
        type: "success",
        text: "Thank you for your review!",
      });
      await fetchBookings(filters);
      const remainingReviews = pendingReviews.filter((b) => b.id !== bookingId);
      if (remainingReviews.length > 0) {
        setCurrentReviewBooking(remainingReviews[0]);
      } else {
        setShowReviewModal(false);
        setCurrentReviewBooking(null);
        setHasShownAutoReview(false);
      }
    }

    return result;
  };

  const handleManualReviewClick = (booking) => {
    setCurrentReviewBooking(booking);
    setShowReviewModal(true);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      CANCELLED_EARLY: "bg-red-100 text-red-800 border-red-200",
    };

    const statusLabels = {
      PENDING: "Pending",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
      CANCELLED_EARLY: "Cancelled Early",
    };

    return (
      <span
        className={`
        px-3 py-1 text-xs font-medium rounded-full border
        ${statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200"}
      `}
      >
        {statusLabels[status] || status.replace("_", " ")}
      </span>
    );
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatDateTimeRange = (startTime, endTime) => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const isSameDate = startDate.toDateString() === endDate.toDateString();

    if (isSameDate) {
      return `${formatDate(startTime)} ${formatTime(startTime)} - ${formatTime(
        endTime
      )}`;
    } else {
      return `${formatDateTime(startTime)} - ${formatDateTime(endTime)}`;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {pendingReviews.length > 0 && (
        <div className="bg-blue-600 text-white py-3">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">
                You have {pendingReviews.length} completed booking
                {pendingReviews.length > 1 ? "s" : ""} awaiting review
              </span>
            </div>
          </div>
        </div>
      )}

      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
              <p className="text-pink-100">Manage your salon appointments</p>
            </div>

            <button
              onClick={() => {
                if (pendingReviews.length > 0) {
                  showMessage({
                    type: "error",
                    text: "Please complete your pending reviews before making new bookings",
                  });
                  return;
                }
                navigate("/booking/new");
              }}
              className="bg-white text-pink-600 px-6 py-3 rounded-lg font-medium hover:bg-pink-50 transition-all duration-200 flex items-center space-x-2 shadow-lg"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>New Booking</span>
            </button>
          </div>
        </div>
      </section>

      {message && (
        <div className="container mx-auto px-6 mt-6">
          <div
            className={`px-4 py-3 rounded-lg flex items-center ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : message.type === "warning"
                ? "bg-yellow-50 border border-yellow-200 text-yellow-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  message.type === "success"
                    ? "M5 13l4 4L19 7"
                    : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                }
              />
            </svg>
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Status:
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                    page: 1,
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="CANCELLED_EARLY">Cancelled Early</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Total: {pagination.totalItems} booking
              {pagination.totalItems !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Bookings
                </h3>
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

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven&apos;t made any salon appointments yet.
            </p>
            <button
              onClick={() => {
                if (pendingReviews.length > 0) {
                  showMessage({
                    type: "error",
                    text: "Please complete your pending reviews before making new bookings",
                  });
                  return;
                }
                navigate("/booking/new");
              }}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
            >
              Book Your First Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${
                  booking.status === "COMPLETED" && !booking.review
                    ? "ring-2 ring-blue-500 ring-opacity-50"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Booking #{booking.id.slice(-8)}
                      </h3>
                      {getStatusBadge(booking.status)}

                      {booking.status === "COMPLETED" && !booking.review && (
                        <span className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 text-xs font-medium rounded-full border">
                          Review Required
                        </span>
                      )}

                      {booking.review && (
                        <span className="bg-green-100 text-green-800 border-green-200 px-3 py-1 text-xs font-medium rounded-full border flex items-center">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405.1L10 14.25l4.068 2.906c.714 1.356 1.6.713 1.405-.1l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Reviewed
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Salon:</span>
                        <p className="font-medium text-gray-900">
                          {booking.salon.name}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-600">Stylist:</span>
                        <p className="font-medium text-gray-900">
                          {booking.stylist.fullName}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-600">Services:</span>
                        <p className="font-medium text-gray-900">
                          {booking.services.map((s) => s.name).join(", ")}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-600">Time:</span>
                        <p className="font-medium text-gray-900">
                          {booking.timeslots && booking.timeslots.length > 0
                            ? (() => {
                                const sortedSlots = [...booking.timeslots].sort(
                                  (a, b) =>
                                    new Date(a.startTime).getTime() -
                                    new Date(b.startTime).getTime()
                                );

                                const firstSlot = sortedSlots[0];
                                const lastSlot =
                                  sortedSlots[sortedSlots.length - 1];

                                return formatDateTimeRange(
                                  firstSlot.startTime,
                                  lastSlot.endTime
                                );
                              })()
                            : "Time not set"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-lg font-bold text-pink-600">
                        {booking.totalPrice.toLocaleString("vi-VN")}đ
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => navigate(`/booking/${booking.id}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </button>

                        {booking.status === "PENDING" && (
                          <button
                            onClick={() => handleCancelClick(booking)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Cancel
                          </button>
                        )}

                        {booking.status === "COMPLETED" && !booking.review && (
                          <button
                            onClick={() => handleManualReviewClick(booking)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                          >
                            Write Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.min(pagination.totalPages, prev.page + 1),
                  }))
                }
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={handleCloseModal}
        onConfirm={confirmCancelBooking}
        title="Cancel Booking"
        message={
          selectedBookingInfo
            ? `Are you sure you want to cancel booking #${selectedBookingInfo.bookingId} at "${selectedBookingInfo.salonName}"? This action cannot be undone.`
            : "Are you sure you want to cancel this booking? This action cannot be undone."
        }
        confirmText="Yes, Cancel Booking"
        cancelText="No, Keep Booking"
        type="danger"
      />

      <ReviewModal
        isOpen={showReviewModal}
        booking={currentReviewBooking}
        onSubmit={handleReviewSubmit}
        loading={reviewLoading}
      />

      <Footer />
    </div>
  );
};

export default BookingListPage;
