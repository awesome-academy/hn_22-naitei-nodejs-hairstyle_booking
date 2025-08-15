import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AvatarUpload from "./AvatarUpload";

const EditProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    gender: "",
    avatar: "",
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setErrors({});
      if (profile) {
        setFormData({
          fullName: profile.fullName || "",
          phone: profile.phone || "",
          gender: profile.gender || "",
          avatar: profile.avatar || "",
        });
      }
    }
  }, [isOpen, profile]);

  const handleClose = () => {
    setIsVisible(false);
    setErrors({});
    setTimeout(() => onClose(), 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAvatarChange = (avatarData) => {
    setFormData((prev) => ({
      ...prev,
      avatar: avatarData,
    }));

    if (errors.avatar) {
      setErrors((prev) => ({
        ...prev,
        avatar: "",
      }));
    }
  };

  const validatePhone = (phone) => {
    if (!phone) return true; 

    const internationalPhoneRegex = /^\+[1-9]\d{1,14}$/;

    const cleanPhone = phone.replace(/[\s\-().]/g, "");

    return internationalPhoneRegex.test(cleanPhone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone =
        "Please enter a valid international phone number with country code (e.g., +84912345678, +1234567890, +44123456789)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";

    let cleanPhone = phone.replace(/[\s\-().]/g, "");

    if (!cleanPhone.startsWith("+")) {
      if (cleanPhone.startsWith("0")) {
        cleanPhone = "+84" + cleanPhone.substring(1);
      } else if (/^\d+$/.test(cleanPhone)) {
        cleanPhone = "+" + cleanPhone;
      }
    }

    return cleanPhone;
  };

  const processAvatarForBackend = (avatar) => {
    if (!avatar) return "";

    if (avatar.startsWith("data:image/")) {
      return `https://api.example.com/uploads/avatar_${Date.now()}.jpg`;
    }

    return avatar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        fullName: formData.fullName.trim(),
        gender: formData.gender || undefined,
      };

      if (formData.phone) {
        const formattedPhone = formatPhoneNumber(formData.phone);
        if (formattedPhone) {
          submitData.phone = formattedPhone;
        }
      }

      if (formData.avatar) {
        submitData.avatar = processAvatarForBackend(formData.avatar);
      }

      console.log("Submitting profile data:", submitData);

      const result = await onSave(submitData);
      if (result.success) {
        handleClose();
      }
    } catch (error) {
      console.error("Error saving profile:", error);

      if (error.response?.data?.message) {
        const backendErrors = {};
        const messages = Array.isArray(error.response.data.message)
          ? error.response.data.message
          : [error.response.data.message];

        messages.forEach((msg) => {
          const lowerMsg = msg.toLowerCase();
          if (lowerMsg.includes("phone")) {
            backendErrors.phone =
              "Invalid phone number format. Please include country code (e.g., +84912345678, +1234567890)";
          } else if (lowerMsg.includes("avatar") || lowerMsg.includes("url")) {
            backendErrors.avatar = "Invalid avatar format";
          } else if (
            lowerMsg.includes("fullname") ||
            lowerMsg.includes("name")
          ) {
            backendErrors.fullName = msg;
          } else {
            backendErrors.general = msg;
          }
        });

        setErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/70 z-50 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto relative transform transition-transform duration-500 ${
          isVisible ? "translate-y-0 scale-100" : "-translate-y-5 scale-95"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {errors.general}
            </div>
          )}

          <div className="text-center pb-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Profile Picture
            </h3>
            <AvatarUpload
              currentAvatar={formData.avatar}
              onAvatarChange={handleAvatarChange}
              disabled={loading}
            />
            {errors.avatar && (
              <p className="mt-2 text-sm text-red-600">{errors.avatar}</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Personal Information
            </h3>

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.fullName
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="Enter your full name"
                disabled={loading}
                required
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Phone - International support */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number (International)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.phone
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="Enter international phone number (e.g., +84912345678)"
                disabled={loading}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
              <div className="mt-1 text-xs text-gray-500 space-y-1">
                <p className="font-medium">
                  International format with country code required:
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Vietnam: +84912345678</li>
                  <li>USA: +1234567890</li>
                  <li>UK: +44123456789</li>
                  <li>Japan: +819012345678</li>
                  <li>Korea: +821012345678</li>
                  <li>Thailand: +66812345678</li>
                </ul>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={loading}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    fullName: PropTypes.string,
    phone: PropTypes.string,
    gender: PropTypes.string,
    avatar: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
};

export default EditProfileModal;
