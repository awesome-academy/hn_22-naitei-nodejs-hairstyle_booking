import React from "react";

const UserDetail = ({ user, onClose }) => {
  if (!user) return null;

  const displayValue = (value, placeholder = "Not specified") =>
    value !== undefined && value !== null ? value : placeholder;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-96 max-w-full p-6 shadow-lg relative">
        {/* Close button X đỏ */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors font-bold"
        >
          ✕
        </button>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName}
              className="h-20 w-20 rounded-full object-cover border-2 border-gray-300"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-300">
              <svg
                className="h-10 w-10 text-gray-600"
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
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          User Detail
        </h2>

        <div className="space-y-3">
          {/* Basic info */}
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Full Name:</span>
            <span className="text-gray-900">{displayValue(user.fullName)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-900">{displayValue(user.email)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Gender:</span>
            <span className="text-gray-900">{displayValue(user.gender)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Role:</span>
            <span className="text-gray-900">
              {user.role?.name || user.role}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Status:</span>
            <span
              className={`${
                user.isActive ? "text-green-600" : "text-red-600"
              } font-semibold`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          {user.phone && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Phone:</span>
              <span className="text-gray-900">{user.phone}</span>
            </div>
          )}

          {/* Extended fields for Customer */}
          {user.role?.name === "CUSTOMER" && (
            <>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Total Completed:
                </span>
                <span className="text-gray-900">
                  {displayValue(user.totalCompleted, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Total Cancelled:
                </span>
                <span className="text-gray-900">
                  {displayValue(user.totalCancelled, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Total Spending:
                </span>
                <span className="text-gray-900">
                  ${displayValue(user.totalSpending, 0)}
                </span>
              </div>
              {user.memberTier && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    Member Tier:
                  </span>
                  <span className="text-gray-900">
                    {user.memberTier.name} ({user.memberTier.discountPercent}%
                    off)
                  </span>
                </div>
              )}
            </>
          )}

          {/* Extended fields for Stylist */}
          {user.role?.name === "STYLIST" && (
            <>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Rating:</span>
                <span className="text-gray-900">
                  {displayValue(user.rating, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Rating Count:</span>
                <span className="text-gray-900">
                  {displayValue(user.ratingCount, 0)}
                </span>
              </div>
              {user.salon && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Salon:</span>
                  <span className="text-gray-900">{user.salon.name}</span>
                </div>
              )}
            </>
          )}

          {/* Extended fields for Manager */}
          {user.role?.name === "MANAGER" && user.salon && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Salon:</span>
              <span className="text-gray-900">{user.salon.name}</span>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
