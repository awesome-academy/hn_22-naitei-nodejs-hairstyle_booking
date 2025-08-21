// frontend/src/components/managerDayOff/ManagerDayOffManagement.jsx
import React, { useState, useEffect } from "react";
import ManagerDayOffTable from "./ManagerDayOffTable";
import LoadingSpinner from "../common/LoadingSpinner";

const ManagerDayOffManagement = () => {
  const [dayOffRequests, setDayOffRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchDayOffRequests();
  }, []);

  const fetchDayOffRequests = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        const mockRequests = [
          {
            id: 1,
            stylistName: "Trần Thị B",
            requestDate: "2024-01-10",
            dayOffDate: "2024-01-20",
            reason: "Personal matters",
            status: "PENDING",
            createdAt: "2024-01-10T08:00:00Z",
          },
          {
            id: 2,
            stylistName: "Phạm Văn D",
            requestDate: "2024-01-12",
            dayOffDate: "2024-01-25",
            reason: "Medical appointment",
            status: "APPROVED",
            createdAt: "2024-01-12T10:30:00Z",
          },
        ];

        setDayOffRequests(mockRequests);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching day off requests:", error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setDayOffRequests((prev) =>
        prev.map((request) =>
          request.id === requestId ? { ...request, status: newStatus } : request
        )
      );

      setMessage({
        type: "success",
        text: `Day off request ${newStatus.toLowerCase()} successfully!`,
      });

      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({
        type: "error",
        text: "Failed to update day off request status",
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
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
        dayOffRequests={dayOffRequests}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default ManagerDayOffManagement;
