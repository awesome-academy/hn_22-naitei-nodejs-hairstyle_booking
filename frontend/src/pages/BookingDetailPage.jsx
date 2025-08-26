import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ConfirmModal from "../components/common/ConfirmModal"; // ✅ Import ConfirmModal
import { bookingApi } from "../api/services/bookingApi";

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false); // ✅ State cho cancel modal

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingApi.getBookingById(id);
      setBooking(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch booking details"
      );
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancelBooking = () => {
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    try {
      setActionLoading(true);
      setShowCancelModal(false);

      await bookingApi.updateBookingStatus(id, { status: "CANCELLED" });

      showMessage({
        type: "success",
        text: "Booking cancelled successfully!",
      });

      await fetchBookingDetail();
    } catch (err) {
      showMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to cancel booking",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CONFIRMED: "bg-green-100 text-green-800 border-green-200",
      COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      CANCELLED_EARLY: "bg-red-100 text-red-800 border-red-200",
      CANCELLED_DAYOFF: "bg-red-100 text-red-800 border-red-200",
    };

    const statusLabels = {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
      CANCELLED_EARLY: "Cancelled Early",
      CANCELLED_DAYOFF: "Cancelled (Day Off)",
    };

    return (
      <span
        className={`
        px-4 py-2 text-sm font-medium rounded-full border
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "long",
      day: "numeric",
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

  const getBookingTimeDisplay = (timeslots) => {
    if (!timeslots || timeslots.length === 0) {
      return { date: "Time not set", timeRange: "" };
    }

    try {
      const sortedSlots = [...timeslots].sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );

      const firstSlot = sortedSlots[0];
      const lastSlot = sortedSlots[sortedSlots.length - 1];

      const dateStr = formatDate(firstSlot.startTime);
      const startTimeStr = formatTime(firstSlot.startTime);
      const endTimeStr = formatTime(lastSlot.endTime);

      return {
        date: dateStr,
        timeRange: `${startTimeStr} - ${endTimeStr}`,
      };
    } catch {
      return { date: "Time format error", timeRange: "" };
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-6 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-500 mb-4"
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
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Error Loading Booking
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="space-x-3">
              <button
                onClick={() => navigate("/booking")}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Back to Bookings
              </button>
              <button
                onClick={fetchBookingDetail}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) return null;

  const { date: appointmentDate, timeRange } = getBookingTimeDisplay(
    booking.timeslots
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {message && (
        <div className="container mx-auto px-6 pt-6">
          <div
            className={`flex items-center p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            <svg
              className={`w-5 h-5 mr-3 ${
                message.type === "success" ? "text-green-500" : "text-red-500"
              }`}
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

      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
                <p className="text-pink-100">
                  View and manage your appointment details
                </p>
              </div>
              <button
                onClick={() => navigate("/booking")}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center"
              >
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Bookings
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Booking Overview
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Created on {formatDate(booking.createdAt)}
                    </p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Salon Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-gray-400 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <span className="font-medium text-gray-900">
                            {booking.salon.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Stylist
                      </h3>
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-400 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="font-medium text-gray-900">
                          {booking.stylist.fullName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Appointment Time
                      </h3>
                      {booking.timeslots && booking.timeslots.length > 0 ? (
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <svg
                              className="w-5 h-5 text-gray-400 mr-3"
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
                            <span className="font-medium text-gray-900">
                              {appointmentDate}
                            </span>
                          </div>
                          {timeRange && (
                            <div className="flex items-center">
                              <svg
                                className="w-5 h-5 text-gray-400 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="font-medium text-gray-900">
                                {timeRange}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500">Time not set</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Services
                </h3>
                <div className="space-y-3">
                  {booking.services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                          <svg
                            className="w-5 h-5 text-pink-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {service.name}
                          </h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">
                          {service.price.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Price Summary
                </h3>
                <div className="space-y-3">
                  {booking.services.map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">{service.name}</span>
                      <span className="text-gray-900">
                        {service.price.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-gray-900">Total</span>
                      <span className="text-pink-600">
                        {booking.totalPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Actions
                </h3>
                <div className="space-y-3">
                  {booking.status === "PENDING" && (
                    <button
                      onClick={handleCancelBooking}
                      disabled={actionLoading}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {actionLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Cancelling...
                        </>
                      ) : (
                        "Cancel Booking"
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => navigate("/booking")}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Back to Bookings
                  </button>

                  {booking.status === "COMPLETED" && (
                    <button
                      onClick={() => navigate(`/booking/${booking.id}/review`)}
                      className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      Write Review
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Booking Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="text-gray-900 font-mono">
                      #{booking.id.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-900">
                      {formatDateTime(booking.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-gray-900">
                      {booking.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Appointment:</span>
                    <span className="text-gray-900">
                      {timeRange || "Time not set"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancelBooking}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        cancelText="No, Keep Booking"
        type="danger"
      />

      <Footer />
    </div>
  );
};

export default BookingDetailPage;
