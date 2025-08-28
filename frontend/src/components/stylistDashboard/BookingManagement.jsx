import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import BookingDetail from "./BookingDetail";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/bookings", {
        params: {
          status: statusFilter || undefined,
          from: fromDate || undefined,
          to: toDate || undefined,
        },
      });
      setBookings(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách booking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookingDetail = async (id) => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/bookings/${id}`);
      setSelectedBooking(res.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải chi tiết booking.");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, newStatus) => {
    try {
      await axiosClient.patch(`/bookings/${id}/status`, { status: newStatus });
      alert("Cập nhật trạng thái thành công!");
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật trạng thái.");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
      COMPLETED: "bg-green-100 text-green-700 border-green-300", 
      CANCELLED: "bg-red-100 text-red-700 border-red-300"
    };
    
    const statusText = {
      PENDING: "Pending",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[status] || "bg-gray-100 text-gray-700 border-gray-300"}`}>
        {statusText[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-pink-500 border-t-transparent"></div>
              <span className="text-lg font-medium">Loading bookings...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 inline-block">
              <div className="text-red-600 text-lg font-medium">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Booking Management
          </h1>
          <p className="text-gray-600">Monitor and manage all customer appointments</p>
        </div>

        {/* Bộ lọc */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All status</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">From Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">To Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
              <button
                onClick={fetchBookings}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-pink-600 hover:to-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách booking */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Booking List ({bookings.length} results)
            </h3>
          </div>
          
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Data Available</h3>
              <p className="text-gray-500">No bookings match the current filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                            {(b.customer?.fullName || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {b.customer?.fullName || "(No name)"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {b.services?.map((s) => s.name).join(", ") || "No services"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(b.createdAt).toLocaleString("en-US")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(b.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => fetchBookingDetail(b.id)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <BookingDetail
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={updateBookingStatus}
        />
      </div>
    </div>
  );
};

export default BookingManagement;
