import React from "react";
import PropTypes from "prop-types";

const ProfileCard = ({ profile, onEdit }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadgeColor = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "stylist":
        return "bg-green-100 text-green-800";
      case "customer":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-20 h-20 rounded-full object-cover border-4 border-white"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`${
                profile.avatar ? "hidden" : "flex"
              } w-20 h-20 rounded-full bg-white/20 items-center justify-center border-4 border-white`}
            >
              <svg
                className="w-10 h-10"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                profile.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              {profile.fullName || "Unknown User"}
            </h2>
            <p className="text-white/80">{profile.email}</p>
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                  profile.role?.name
                )}`}
              >
                {profile.role?.name || "No Role"}
              </span>
            </div>
          </div>

          <button
            onClick={onEdit}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            title="Edit Profile"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Basic Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-700">Email</p>
                  <p className="font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>

              {profile.phone && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-700">Phone</p>
                    <p className="font-medium text-gray-900">{profile.phone}</p>
                  </div>
                </div>
              )}

              {profile.gender && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-600 mr-3"
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
                  <div>
                    <p className="text-sm text-gray-700">Gender</p>
                    <p className="font-medium capitalize text-gray-900">
                      {profile.gender}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a4 4 0 118 0v4M4 12a8 8 0 0116 0M4 12a8 8 0 018-8m8 8a8 8 0 11-16 0"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-700">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      profile.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {profile.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a4 4 0 118 0v4M4 12a8 8 0 0116 0M4 12a8 8 0 018-8m8 8a8 8 0 11-16 0"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-700">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-700">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(profile.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {profile.role?.name === "CUSTOMER" && profile.memberTier && (
          <div className="mt-6 p-4 bg-pink-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Customer Information
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-pink-600">
                  {profile.totalCompleted || 0}
                </p>
                <p className="text-sm text-gray-600">Completed Bookings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-600">
                  {(profile.totalSpending || 0).toLocaleString()} VND
                </p>
                <p className="text-sm text-gray-600">Total Spending</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-600">
                  {profile.memberTier?.name || "Bronze"}
                </p>
                <p className="text-sm text-gray-600">Member Tier</p>
              </div>
            </div>
          </div>
        )}

        {profile.role?.name === "STYLIST" && profile.salon && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Stylist Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Salon</p>
                <p className="font-medium">{profile.salon.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-yellow-500">
                    {profile.rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    ({profile.ratingCount || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {profile.role?.name === "MANAGER" && profile.salon && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Manager Information
            </h3>
            <div>
              <p className="text-sm text-gray-600">Managing Salon</p>
              <p className="font-medium">{profile.salon.name}</p>
              <p className="text-sm text-gray-500">{profile.salon.address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ProfileCard.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    avatar: PropTypes.string,
    gender: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    role: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    memberTier: PropTypes.object,
    totalCompleted: PropTypes.number,
    totalSpending: PropTypes.number,
    totalCancelled: PropTypes.number,
    salon: PropTypes.object,
    rating: PropTypes.number,
    ratingCount: PropTypes.number,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ProfileCard;
