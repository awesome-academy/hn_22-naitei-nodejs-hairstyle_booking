import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const pickArray = (res) => {
    const candidates = [
      res,
      res?.data,
      res?.data?.data,
      res?.data?.items,
      res?.result,
      res?.payload,
    ];
    for (const c of candidates) {
      if (Array.isArray(c)) return c;
    }
    if (Array.isArray(res?.data?.result)) return res.data.result;
    return [];
  };

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/leaves");
      const arr = pickArray(res);
      setLeaves(arr.map(normalizeLeave));
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeLeave = (x) => {
    return {
      id: x.id ?? x._id ?? x.leaveId,
      date: x.date ?? x.leaveDate ?? x.day,
      reason: x.reason ?? x.note ?? "",
      status: x.status ?? x.state ?? "PENDING",
    };
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn nghỉ này?")) return;
    try {
      setCancellingId(id);
      await axiosClient.delete(`/leaves/${id}`);
      setLeaves((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: "CANCELLED" } : x))
      );
    } catch (error) {
      console.error("Lỗi khi hủy đơn:", error);
      alert("Không thể hủy đơn nghỉ.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Nghỉ phép
                </h1>
                <p className="text-gray-500 mt-1">Quản lý các yêu cầu nghỉ phép của bạn</p>
              </div>
            </div>
            
            <Link
              to="create"
              className="group flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="font-medium">Tạo yêu cầu</span>
            </Link>
          </div>
        </div>

        {/* Stats Summary */}
        {!loading && leaves.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { status: 'PENDING', label: 'Chờ duyệt', color: 'yellow' },
              { status: 'APPROVED', label: 'Đã duyệt', color: 'green' },
              { status: 'REJECTED', label: 'Từ chối', color: 'red' },
              { status: 'CANCELLED', label: 'Đã hủy', color: 'gray' }
            ].map(({ status, label, color }) => {
              const count = leaves.filter(l => l.status === status).length;
              return (
                <div key={status} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{label}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${statusDot(status)}`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100/80">
                  <Th>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Ngày</span>
                    </div>
                  </Th>
                  <Th>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Lý do</span>
                    </div>
                  </Th>
                  <Th>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Trạng thái</span>
                    </div>
                  </Th>
                  <Th className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                      <span>Thao tác</span>
                    </div>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <Td colSpan={4}>
                      <div className="flex items-center justify-center py-12">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                          <span className="text-gray-600 font-medium">Đang tải dữ liệu...</span>
                        </div>
                      </div>
                    </Td>
                  </tr>
                ) : leaves.length === 0 ? (
                  <tr>
                    <Td colSpan={4}>
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có đơn nghỉ nào</h3>
                        <p className="text-gray-500 mb-6">Bạn chưa tạo yêu cầu nghỉ phép nào</p>
                        <Link
                          to="create"
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                        >
                          Tạo yêu cầu đầu tiên
                        </Link>
                      </div>
                    </Td>
                  </tr>
                ) : (
                  leaves.map((x, index) => (
                    <tr
                      key={x.id}
                      className={`border-t border-gray-100 hover:bg-blue-50/50 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
                      }`}
                    >
                      <Td>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-600">
                              {formatVN(x.date).split('/')[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{formatVN(x.date)}</div>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <div className="max-w-xs">
                          {x.reason ? (
                            <span className="text-gray-700">{x.reason}</span>
                          ) : (
                            <span className="text-gray-400 italic">Không có lý do</span>
                          )}
                        </div>
                      </Td>
                      <Td>
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyle(x.status)}`}
                        >
                          <span className={`w-2 h-2 rounded-full mr-2 ${statusDot(x.status)}`}></span>
                          {labelStatus(x.status)}
                        </span>
                      </Td>
                      <Td className="text-right">
                        {x.status === "PENDING" ? (
                          <button
                            onClick={() => handleCancel(x.id)}
                            disabled={cancellingId === x.id}
                            className="group inline-flex items-center space-x-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            {cancellingId === x.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                                <span className="text-sm font-medium">Đang hủy...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-sm font-medium">Hủy</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Decoration */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        </div>
      </div>
    </div>
  );
}

const Th = (p) => (
  <th
    {...p}
    className={
      "px-6 py-4 text-left font-semibold text-gray-700 text-sm " + (p.className || "")
    }
  />
);
const Td = (p) => <td {...p} className={"px-6 py-4 " + (p.className || "")} />;

function formatVN(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function labelStatus(status) {
  switch (status) {
    case "PENDING":
      return "Chờ duyệt";
    case "APPROVED":
      return "Đã duyệt";
    case "REJECTED":
      return "Từ chối";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
}

function statusStyle(status) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    case "APPROVED":
      return "bg-green-50 text-green-700 border border-green-200";
    case "REJECTED":
      return "bg-red-50 text-red-700 border border-red-200";
    case "CANCELLED":
      return "bg-gray-50 text-gray-600 border border-gray-200";
    default:
      return "bg-gray-50 text-gray-600 border border-gray-200";
  }
}

function statusDot(status) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-400";
    case "APPROVED":
      return "bg-green-400";
    case "REJECTED":
      return "bg-red-400";
    case "CANCELLED":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
}
