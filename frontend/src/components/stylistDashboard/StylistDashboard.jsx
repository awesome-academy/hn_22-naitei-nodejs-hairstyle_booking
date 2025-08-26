import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function StylistDashboard() {
  const [view, setView] = useState("month"); // or "week"
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [rawSchedules, setRawSchedules] = useState([]);
  const [error, setError] = useState("");

  const getDayKey = (date) => new Date(date).toISOString().slice(0, 10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/time-schedule/me");
        setRawSchedules(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error(err);
        setError("Không thể tải lịch làm việc.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const normalizeSchedules = (schedules) => {
    return schedules.flatMap((ws) => {
      const date = getDayKey(ws.workingDate);

      if (ws.isDayOff) {
        return [
          {
            date,
            title: "Nghỉ",
            status: "OFF",
          },
        ];
      }

      return ws.timeSlots.map((slot) => {
        const start = new Date(slot.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const end = new Date(slot.endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        return {
          date,
          title: `${start}-${end}`,
          status: slot.isBooked ? "BOOKED" : "AVAILABLE",
        };
      });
    });
  };

  const normalized = useMemo(() => normalizeSchedules(rawSchedules), [rawSchedules]);

  const monthDays = useMemo(() => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startDay = start.getDay() || 7;
    start.setDate(start.getDate() - (startDay - 1));

    const days = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    const day = start.getDay() || 7;
    start.setDate(start.getDate() - (day - 1));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentDate]);

  const getEventsByDate = (date) => {
    return normalized.filter((e) => e.date === getDayKey(date));
  };

  const renderDayCell = (date) => {
    const events = getEventsByDate(date);
    const isToday = getDayKey(date) === getDayKey(new Date());
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();

    return (
      <div
        key={date}
        className={`min-h-[160px] border border-gray-200 p-3 overflow-hidden transition-all duration-200 hover:shadow-md ${
          isCurrentMonth ? "bg-white" : "bg-gray-50/50"
        } ${isToday ? "ring-2 ring-emerald-400 ring-offset-1" : ""}`}
      >
        <div className="flex justify-between items-center mb-2">
          <span 
            className={`text-sm font-medium ${
              isCurrentMonth 
                ? isToday 
                  ? "text-emerald-600 font-semibold" 
                  : "text-gray-900" 
                : "text-gray-400"
            }`}
          >
            {date.getDate()}
          </span>
          {isToday && (
            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium shadow-sm">
              Hôm nay
            </span>
          )}
        </div>
        <div className="space-y-1.5 text-xs">
          {events.slice(0, 3).map((ev, i) => (
            <div
              key={i}
              className={`truncate px-2 py-1.5 rounded-lg font-medium shadow-sm transition-all duration-150 ${
                ev.status === "OFF"
                  ? "bg-red-100 text-red-700 border-l-3 border-red-400"
                  : ev.status === "BOOKED"
                  ? "bg-blue-100 text-blue-700 border-l-3 border-blue-400"
                  : "bg-emerald-100 text-emerald-700 border-l-3 border-emerald-400"
              }`}
            >
              {ev.title}
            </div>
          ))}
          {events.length > 3 && (
            <div className="text-gray-500 text-[11px] font-medium mt-2 px-1">
              +{events.length - 3} lịch khác...
            </div>
          )}
        </div>
      </div>
    );
  };

  const goToday = () => setCurrentDate(new Date());
  const prev = () => {
    const newDate = new Date(currentDate);
    if (view === "month") newDate.setMonth(currentDate.getMonth() - 1);
    else newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };
  const next = () => {
    const newDate = new Date(currentDate);
    if (view === "month") newDate.setMonth(currentDate.getMonth() + 1);
    else newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const monthLabel = useMemo(
    () =>
      currentDate.toLocaleDateString("vi-VN", {
        month: "long",
        year: "numeric",
      }),
    [currentDate]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📅 Tổng quan lịch làm việc
          </h1>
          <p className="text-gray-600">Quản lý và theo dõi lịch trình làm việc của bạn</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView("month")}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  view === "month" 
                    ? "bg-emerald-600 text-white shadow-sm" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                }`}
              >
                Tháng
              </button>
              <button
                onClick={() => setView("week")}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  view === "week" 
                    ? "bg-emerald-600 text-white shadow-sm" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                }`}
              >
                Tuần
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <button 
                onClick={goToday} 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 hover:shadow-sm"
              >
                Hôm nay
              </button>
              <button 
                onClick={prev} 
                className="px-3 py-2 bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-200 hover:shadow-sm"
              >
                Trước
              </button>
              <div className="min-w-[150px] text-center font-semibold text-gray-800 text-lg">
                {monthLabel}
              </div>
              <button 
                onClick={next} 
                className="px-3 py-2 bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-200 hover:shadow-sm"
              >
                Sau
              </button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent"></div>
                <span className="text-lg">Đang tải lịch làm việc...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 inline-block">
                {error}
              </div>
            </div>
          ) : view === "month" ? (
            <div className="grid grid-cols-7">
              {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"].map((d) => (
                <div
                  key={d}
                  className="text-sm font-semibold border-b border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-center"
                >
                  {d}
                </div>
              ))}
              {monthDays.map((d) => renderDayCell(d))}
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {weekDays.map((d, index) => (
                <div key={d} className="border-r border-gray-200 last:border-r-0">
                  <div className="text-sm font-semibold border-b border-gray-200 p-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-center">
                    {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"][index]}
                  </div>
                  {renderDayCell(d)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Chú thích:</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-100 border-l-3 border-emerald-400 rounded"></div>
              <span className="text-gray-700">Có thể đặt lịch</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-l-3 border-blue-400 rounded"></div>
              <span className="text-gray-700">Đã có lịch hẹn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border-l-3 border-red-400 rounded"></div>
              <span className="text-gray-700">Ngày nghỉ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
