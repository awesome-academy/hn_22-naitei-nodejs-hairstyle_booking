import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import LoadingSpinner from "../common/LoadingSpinner";

const TimeSlotSelection = ({
  timeSlots,
  selectedTimeSlotIds,
  selectedServiceIds,
  services,
  onTimeSlotsSelect,
  loading,
}) => {
  const [selectedDate, setSelectedDate] = useState("");

  const totalDuration = useMemo(() => {
    const selectedServices = services.filter((service) =>
      selectedServiceIds.includes(service.id)
    );
    return selectedServices.reduce(
      (total, service) => total + (service.duration || 30),
      0
    );
  }, [selectedServiceIds, services]);

  const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getVietnamHour = (utcTimeString) => {
    const date = new Date(utcTimeString);
    const vietnamFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "numeric",
      hour12: false,
    });
    return parseInt(vietnamFormatter.format(date));
  };

  const groupedTimeSlots = useMemo(() => {
    if (!timeSlots || timeSlots.length === 0) return {};

    const grouped = {};

    timeSlots.forEach((workSchedule) => {
      const date = workSchedule.workingDate.split("T")[0];

      if (!grouped[date]) {
        grouped[date] = {
          workSchedule: {
            id: workSchedule.id,
            date: date,
            workingDate: workSchedule.workingDate,
            isDayOff: workSchedule.isDayOff,
          },
          timeSlots: [],
        };
      }

      if (workSchedule.timeSlots && !workSchedule.isDayOff) {
        workSchedule.timeSlots.forEach((slot) => {
          grouped[date].timeSlots.push({
            ...slot,
            workSchedule: grouped[date].workSchedule,
          });
        });
      }
    });

    Object.keys(grouped).forEach((date) => {
      grouped[date].timeSlots.sort(
        (a, b) => new Date(a.startTime) - new Date(b.startTime)
      );
    });

    return grouped;
  }, [timeSlots]);

  const availableDates = Object.keys(groupedTimeSlots).sort();

  const getValidBlocks = (slots, requiredDuration) => {
    const slotDuration = 15; // phút
    const requiredSlots = Math.ceil(requiredDuration / slotDuration);

    const consecutiveGroups = [];
    let currentGroup = [];

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];

      if (slot.isBooked) {
        if (currentGroup.length > 0) {
          consecutiveGroups.push([...currentGroup]);
          currentGroup = [];
        }
        continue;
      }

      if (currentGroup.length === 0) {
        currentGroup = [slot];
      } else {
        const lastSlot = currentGroup[currentGroup.length - 1];
        const lastEndTime = new Date(lastSlot.endTime);
        const currentStartTime = new Date(slot.startTime);

        if (Math.abs(currentStartTime - lastEndTime) < 1000) {
          currentGroup.push(slot);
        } else {
          if (currentGroup.length > 0) {
            consecutiveGroups.push([...currentGroup]);
          }
          currentGroup = [slot];
        }
      }
    }

    if (currentGroup.length > 0) {
      consecutiveGroups.push(currentGroup);
    }

    const validBlocks = [];
    consecutiveGroups.forEach((group) => {
      for (let i = 0; i <= group.length - requiredSlots; i++) {
        const windowSlots = group.slice(i, i + requiredSlots);
        validBlocks.push({
          slots: windowSlots,
          startTime: windowSlots[0].startTime,
          endTime: windowSlots[windowSlots.length - 1].endTime,
        });
      }
    });

    return validBlocks;
  };

  const getTimeSlotsByShift = (slots, requiredDuration) => {
    const morningSlots = slots.filter((slot) => {
      const hour = getVietnamHour(slot.startTime);
      return hour >= 8 && hour < 12;
    });

    const afternoonSlots = slots.filter((slot) => {
      const hour = getVietnamHour(slot.startTime);
      return hour >= 13 && hour < 18;
    });

    const morningBlocks = getValidBlocks(morningSlots, requiredDuration).map(
      (b) => ({ ...b, shift: "Morning" })
    );
    const afternoonBlocks = getValidBlocks(
      afternoonSlots,
      requiredDuration
    ).map((b) => ({ ...b, shift: "Afternoon" }));

    return [...morningBlocks, ...afternoonBlocks];
  };

  const handleSlotGroupSelect = (slotGroup, workScheduleId) => {
    const slotIds = slotGroup.map((slot) => slot.id);
    onTimeSlotsSelect(slotIds, workScheduleId);
  };

  if (loading) return <LoadingSpinner />;

  if (availableDates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No available time slots</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Booking Duration</h3>
        <p className="text-sm text-blue-700">
          Total time needed:{" "}
          <span className="font-medium">{totalDuration} minutes</span>
        </p>
        <p className="text-xs text-blue-600 mt-1">
          We&apos;ll automatically select consecutive time slots for your
          services.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date:
        </label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">Choose a date...</option>
          {availableDates.map((date) => (
            <option key={date} value={date}>
              {formatDate(date)}
            </option>
          ))}
        </select>
      </div>

      {selectedDate && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Available Time Slots for {formatDate(selectedDate)}
          </h3>

          {(() => {
            const dayData = groupedTimeSlots[selectedDate];
            const availableBlocks = getTimeSlotsByShift(
              dayData.timeSlots,
              totalDuration
            );

            if (availableBlocks.length === 0) {
              return (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    No available time slots for the required duration on this
                    date.
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-6">
                {["Morning", "Afternoon"].map((shift) => {
                  const shiftBlocks = availableBlocks.filter(
                    (b) => b.shift === shift
                  );
                  if (shiftBlocks.length === 0) return null;

                  return (
                    <div key={shift}>
                      <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mr-3
                          ${
                            shift === "Morning"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {shift === "Morning" ? "🌅" : "🌆"} {shift} Shift
                        </span>
                        <span className="text-sm text-gray-600">
                          ({shiftBlocks.length} available slot
                          {shiftBlocks.length > 1 ? "s" : ""})
                        </span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {shiftBlocks.map((block, idx) => {
                          const isSelected =
                            selectedTimeSlotIds.length > 0 &&
                            selectedTimeSlotIds.every((id) =>
                              block.slots.some((slot) => slot.id === id)
                            );

                          return (
                            <div
                              key={`${shift}-${idx}`}
                              onClick={() =>
                                handleSlotGroupSelect(
                                  block.slots,
                                  dayData.workSchedule.id
                                )
                              }
                              className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                                ${
                                  isSelected
                                    ? "border-pink-500 bg-pink-50 ring-2 ring-pink-200"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                              <div className="text-center">
                                <div className="text-lg font-semibold text-gray-900">
                                  {formatTime(block.startTime)} -{" "}
                                  {formatTime(block.endTime)}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {totalDuration} minutes
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

TimeSlotSelection.propTypes = {
  timeSlots: PropTypes.array.isRequired,
  selectedTimeSlotIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedServiceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      duration: PropTypes.number,
    })
  ).isRequired,
  onTimeSlotsSelect: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default TimeSlotSelection;
