// frontend/src/components/booking/BookingForm.jsx
import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../hooks/useBookings";
import { useSalons } from "../../hooks/useSalons";
import BookingStepIndicator from "./BookingStepIndicator";
import SalonSelection from "./SalonSelection";
import StylistSelection from "./StylistSelection";
import ServiceSelection from "./ServiceSelection";
import TimeSlotSelection from "./TimeSlotSelection";
import BookingConfirmation from "./BookingConfirmation";
import LoadingSpinner from "../common/LoadingSpinner";
import SuccessModal from "../common/SuccessModal";

const BookingForm = ({ preSelectedData = {} }) => {
  const navigate = useNavigate();
  const { salons, fetchSalons } = useSalons();

  const {
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
  } = useBooking();

  const [message, setMessage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const safePreSelectedData = useMemo(
    () => ({
      salonId: preSelectedData?.salonId || null,
      serviceIds: preSelectedData?.serviceIds || [],
      stylistId: preSelectedData?.stylistId || null,
    }),
    [
      preSelectedData?.salonId,
      preSelectedData?.serviceIds,
      preSelectedData?.stylistId,
    ]
  );

  const getCurrentSalon = () => {
    return salons.find((s) => s.id === bookingData.salonId);
  };

  const getCurrentStylist = () => {
    return availableData.stylists.find((s) => s.id === bookingData.stylistId);
  };

  const getCurrentServices = () => {
    return availableData.services.filter((s) =>
      bookingData.serviceIds.includes(s.id)
    );
  };

  const getCurrentTimeSlots = () => {
    const allTimeSlots = [];

    if (availableData.timeSlots && Array.isArray(availableData.timeSlots)) {
      availableData.timeSlots.forEach((schedule) => {
        if (schedule.timeSlots && Array.isArray(schedule.timeSlots)) {
          schedule.timeSlots.forEach((slot) => {
            allTimeSlots.push({
              ...slot,
              workScheduleId: schedule.id,
              workingDate: schedule.workingDate,
              isDayOff: schedule.isDayOff,
            });
          });
        }
      });
    }

    const selectedSlots = allTimeSlots.filter((ts) => {
      const tsId = ts.id;
      const isSelected = bookingData.timeSlotIds.includes(tsId);

      return isSelected;
    });
    return selectedSlots;
  };

  const getInitialStep = () => {
    if (safePreSelectedData.serviceIds.length > 0) {
      return 1;
    } else if (safePreSelectedData.salonId) {
      return 2; 
    }
    return 1;
  };

  useEffect(() => {
    const initializeForm = async () => {
      if (isInitialized) return;

      try {
        const initialStep = getInitialStep();
        setStep(initialStep);

        const updates = {};

        if (safePreSelectedData.salonId) {
          updates.salonId = safePreSelectedData.salonId;
        }

        if (safePreSelectedData.serviceIds.length > 0) {
          updates.serviceIds = safePreSelectedData.serviceIds;
        }

        if (safePreSelectedData.stylistId) {
          updates.stylistId = safePreSelectedData.stylistId;
        }

        if (Object.keys(updates).length > 0) {
          updateBookingData(updates);
        }

        const fetchPromises = [fetchSalons(), fetchServices()];

        if (safePreSelectedData.salonId) {
          fetchPromises.push(fetchStylists(safePreSelectedData.salonId));
        }

        if (safePreSelectedData.stylistId) {
          fetchPromises.push(fetchTimeSlots(safePreSelectedData.stylistId));
        }

        await Promise.all(fetchPromises);
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing form:", error);
        setIsInitialized(true);
      }
    };

    initializeForm();
  }, []); 

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleNext = async () => {
    try {
      if (step === 1 && !bookingData.salonId) {
        showMessage({ type: "error", text: "Please select a salon" });
        return;
      }

      if (step === 2 && bookingData.serviceIds.length === 0) {
        showMessage({
          type: "error",
          text: "Please select at least one service",
        });
        return;
      }

      if (step === 3 && !bookingData.stylistId) {
        showMessage({ type: "error", text: "Please select a stylist" });
        return;
      }

      if (step === 4 && bookingData.timeSlotIds.length === 0) {
        showMessage({ type: "error", text: "Please select time slots" });
        return;
      }

      if (step === 5) {
        const result = await submitBooking();
        if (result.success) {
          setShowSuccessModal(true);
          return;
        } else {
          showMessage({
            type: "error",
            text: result.error || "Failed to create booking",
          });
          return;
        }
      }

      if (step === 1 && bookingData.salonId) {
        if (
          safePreSelectedData.serviceIds.length > 0 &&
          bookingData.serviceIds.length > 0
        ) {
          await fetchStylists(bookingData.salonId);
          setStep(3);
          return;
        } else {
          await fetchServices();
          setStep(2);
          return;
        }
      }

      if (step === 2 && bookingData.serviceIds.length > 0) {
        await fetchStylists(bookingData.salonId);
        setStep(3);
        return;
      }

      if (step === 3 && bookingData.stylistId) {
        await fetchTimeSlots(bookingData.stylistId);
        setStep(4);
        return;
      }

      if (step === 4 && bookingData.timeSlotIds.length > 0) {
        setStep(5);
        return;
      }

      setStep(step + 1);
    } catch (err) {
      showMessage({
        type: "error",
        text: err.message || "An error occurred",
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate("/booking");
  };

  const getStepTitle = () => {
    const titles = {
      1: "Select Salon",
      2: "Select Services",
      3: "Choose Stylist",
      4: "Pick Time Slots",
      5: "Confirm Booking",
    };
    return titles[step] || "Book Appointment";
  };

  const getButtonText = () => {
    if (step === 5) return "Confirm Booking"; 
    if (step === 4) return "Review Booking"; 
    return "Continue";
  };

  const shouldSkipStep = (stepNumber) => {
    if (stepNumber === 1 && safePreSelectedData.salonId) return true;
    if (stepNumber === 2 && safePreSelectedData.serviceIds.length > 0)
      return true;
    return false;
  };

  if (loading && !isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-6 border-b">
        <BookingStepIndicator
          currentStep={step}
          totalSteps={5}
          preSelectedData={safePreSelectedData}
        />
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Booking Successful!"
        message="Your appointment has been booked successfully. You can view and manage your bookings in the booking list."
        buttonText="View My Bookings"
      />

      {message && (
        <div
          className={`flex-shrink-0 mx-6 mt-6 p-4 rounded-lg flex items-center ${
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
          {message.text}
        </div>
      )}

      <div className="flex-shrink-0 px-6 pt-6">
        <h2 className="text-2xl font-bold text-gray-900">{getStepTitle()}</h2>
        {safePreSelectedData.salonId && step === 1 && (
          <p className="text-green-600 mt-1">✓ Salon pre-selected</p>
        )}
        {safePreSelectedData.serviceIds.length > 0 && step === 2 && (
          <p className="text-green-600 mt-1">✓ Services pre-selected</p>
        )}
      </div>

      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {step === 1 && (
          <>
            {safePreSelectedData.serviceIds.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-green-900 mb-2">
                  Pre-selected Services:
                </h3>
                <div className="text-sm text-green-700">
                  You have selected {safePreSelectedData.serviceIds.length}{" "}
                  service(s). Please choose a salon that offers these services.
                </div>
              </div>
            )}

            <SalonSelection
              salons={salons}
              selectedSalonId={bookingData.salonId}
              onSalonSelect={(salonId) => updateBookingData({ salonId })}
              loading={loading}
              filteredByServices={safePreSelectedData.serviceIds}
            />
          </>
        )}

        {step === 2 && !shouldSkipStep(2) && (
          <ServiceSelection
            services={availableData.services}
            selectedServiceIds={bookingData.serviceIds}
            onServicesSelect={(serviceIds) => updateBookingData({ serviceIds })}
            loading={loading}
          />
        )}

        {step === 3 && (
          <StylistSelection
            stylists={availableData.stylists}
            selectedStylistId={bookingData.stylistId}
            onStylistSelect={(stylistId) => updateBookingData({ stylistId })}
            loading={loading}
            salonName={getCurrentSalon()?.name}
          />
        )}

        {step === 4 && (
          <TimeSlotSelection
            timeSlots={availableData.timeSlots}
            selectedTimeSlotIds={bookingData.timeSlotIds}
            selectedServiceIds={bookingData.serviceIds}
            services={availableData.services}
            onTimeSlotsSelect={(timeSlotIds, workScheduleId) =>
              updateBookingData({ timeSlotIds, workScheduleId })
            }
            loading={loading}
          />
        )}

        {step === 5 && (
          <BookingConfirmation
            bookingData={bookingData}
            salon={getCurrentSalon()}
            stylist={getCurrentStylist()}
            services={getCurrentServices()}
            timeSlots={getCurrentTimeSlots()}
            totalPrice={totalPrice}
          />
        )}
      </div>

      <div className="flex-shrink-0 p-6 border-t bg-gray-50">
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1 || loading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <div className="flex items-center gap-4">
            {step === 5 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-pink-600">
                  {totalPrice.toLocaleString("vi-VN")}đ
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
              >
                Reset
              </button>

              <button
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  getButtonText()
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

BookingForm.propTypes = {
  preSelectedData: PropTypes.shape({
    salonId: PropTypes.string,
    serviceIds: PropTypes.arrayOf(PropTypes.string),
    stylistId: PropTypes.string,
  }),
};

BookingForm.defaultProps = {
  preSelectedData: {
    salonId: null,
    serviceIds: [],
    stylistId: null,
  },
};

export default BookingForm;
