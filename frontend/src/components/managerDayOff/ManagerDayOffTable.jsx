import React from "react";
import PropTypes from "prop-types";

const ManagerDayOffTable = ({ dayOffRequests, onStatusUpdate }) => {
  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("vi-VN");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Day Off Requests</h3>
        <p className="text-sm text-gray-600">
          Total: {dayOffRequests.length} requests
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stylist
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Day Off Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dayOffRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {request.stylistName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(request.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {request.dayOffDate}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {request.reason}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(request.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {request.status === "PENDING" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onStatusUpdate(request.id, "APPROVED")}
                        className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onStatusUpdate(request.id, "REJECTED")}
                        className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {request.status !== "PENDING" && (
                    <span className="text-gray-400 text-sm">
                      {request.status === "APPROVED" ? "Approved" : "Rejected"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dayOffRequests.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No day off requests
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No day off requests found.
          </p>
        </div>
      )}
    </div>
  );
};

ManagerDayOffTable.propTypes = {
  dayOffRequests: PropTypes.array.isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
};

export default ManagerDayOffTable;
