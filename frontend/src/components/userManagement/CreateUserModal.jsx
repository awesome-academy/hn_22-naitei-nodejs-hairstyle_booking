import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSalons } from "../../hooks/useSalons";

const CreateUserModal = ({ isOpen, onClose, onCreateUser, userRole }) => {
  const { salons } = useSalons();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    role: userRole === "MANAGER" ? "STYLIST" : "",
    salonId: "", // For manager creation
  });

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (
      formData.phone &&
      !/^\+[1-9]\d{1,14}$/.test(formData.phone.replace(/[\s\-().]/g, ""))
    ) {
      newErrors.phone = "Please enter a valid international phone number";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (formData.role === "MANAGER" && !formData.salonId) {
      newErrors.salonId = "Salon is required for managers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await onCreateUser(formData);

      if (result.success) {
        setFormData({
          fullName: "",
          email: "",
          password: "",
          phone: "",
          gender: "",
          role: userRole === "MANAGER" ? "STYLIST" : "",
          salonId: "",
        });
        setErrors({});
      } else {
        if (typeof result.error === "string") {
          setErrors({ general: result.error });
        }
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const getRoleOptions = () => {
    if (userRole === "ADMIN") {
      return [
        { value: "", label: "Select Role" },
        { value: "MANAGER", label: "Manager" },
        { value: "STYLIST", label: "Stylist" },
      ];
    } else if (userRole === "MANAGER") {
      return [{ value: "STYLIST", label: "Stylist" }];
    }
    return [];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Create New User
                  </h3>

                  {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                      {errors.general}
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.fullName ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Enter full name"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.password ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Enter password (min 6 characters)"
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.phone ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="+84912345678"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role *
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.role ? "border-red-300" : "border-gray-300"
                        }`}
                        disabled={userRole === "MANAGER"}
                      >
                        {getRoleOptions().map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.role && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.role}
                        </p>
                      )}
                    </div>

                    {/* Salon Selection (for Manager role) */}
                    {formData.role === "MANAGER" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Salon *
                        </label>
                        <select
                          name="salonId"
                          value={formData.salonId}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.salonId
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select salon</option>
                          {salons.map((salon) => (
                            <option key={salon.id} value={salon.id}>
                              {salon.name}
                            </option>
                          ))}
                        </select>
                        {errors.salonId && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.salonId}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
CreateUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateUser: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default CreateUserModal;
