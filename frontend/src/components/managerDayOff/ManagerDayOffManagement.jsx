import React, { useState, useEffect } from "react";
import ManagerDayOffTable from "./ManagerDayOffTable";
import LoadingSpinner from "../common/LoadingSpinner";
import { useDayOffs } from "../../hooks/useDayOffs";

const ManagerDayOffManagement = () => {
  const {
    dayOffs,
    loading,
    error,
    pagination,
    fetchDayOffs,
    updateDayOffStatus,
  } = useDayOffs();

  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchDayOffs();
  }, [fetchDayOffs]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    const result = await updateDayOffStatus(requestId, newStatus);

    if (result.success) {
      showMessage({
        type: "success",
        text: `Day off request ${newStatus.toLowerCase()} successfully!`,
      });
    } else {
      showMessage({
        type: "error",
        text: result.error,
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

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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
                Error Loading Day Off Requests
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={() => fetchDayOffs()}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-500 mt-0.5 mr-3"
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
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Day Off Management
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Review day off requests from stylists in your salon. You can
              approve or reject requests based on salon schedule and
              availability.
            </p>
          </div>
        </div>
      </div>

      <ManagerDayOffTable
        dayOffRequests={dayOffs}
        pagination={pagination}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default ManagerDayOffManagement;
