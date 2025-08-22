import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSalons } from "../../hooks/useSalons";

const CreateUserModal = ({ isOpen, onClose, onCreateUser, userRole }) => {
  const { salons, fetchSalons } = useSalons();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    role: "MANAGER",
    salonId: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchSalons();
    }
  }, [isOpen, fetchSalons]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        gender: "",
        role: userRole === "ADMIN" ? "MANAGER" : "STYLIST",
        salonId: "",
      });
      setErrors({});
    }
  }, [isOpen, userRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "role" && value !== "MANAGER") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        salonId: "",
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (errors.general) {
      setErrors((prev) => ({
        ...prev,
        general: "",
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

  const mapBackendErrorsToFields = (errorData) => {
    const mappedErrors = {};

    if (typeof errorData === "string") {
      const errorMessage = errorData.toLowerCase();

      if (
        errorMessage.includes("phone") ||
        errorMessage.includes("phone number")
      ) {
        mappedErrors.phone = errorData;
      } else if (errorMessage.includes("email")) {
        mappedErrors.email = errorData;
      } else if (errorMessage.includes("password")) {
        mappedErrors.password = errorData;
      } else if (
        errorMessage.includes("name") ||
        errorMessage.includes("fullname")
      ) {
        mappedErrors.fullName = errorData;
      } else if (errorMessage.includes("salon")) {
        mappedErrors.salonId = errorData;
      } else if (errorMessage.includes("role")) {
        mappedErrors.role = errorData;
      } else {
        mappedErrors.general = errorData;
      }
    } else if (Array.isArray(errorData)) {
      errorData.forEach((error) => {
        const errorMessage = error.toLowerCase();

        if (
          errorMessage.includes("phone") ||
          errorMessage.includes("phone number")
        ) {
          mappedErrors.phone = error;
        } else if (errorMessage.includes("email")) {
          mappedErrors.email = error;
        } else if (errorMessage.includes("password")) {
          mappedErrors.password = error;
        } else if (
          errorMessage.includes("name") ||
          errorMessage.includes("fullname")
        ) {
          mappedErrors.fullName = error;
        } else if (errorMessage.includes("salon")) {
          mappedErrors.salonId = error;
        } else if (errorMessage.includes("role")) {
          mappedErrors.role = error;
        } else {
          mappedErrors.general = mappedErrors.general
            ? `${mappedErrors.general}; ${error}`
            : error;
        }
      });
    } else if (typeof errorData === "object" && errorData !== null) {
      Object.keys(errorData).forEach((key) => {
        const normalizedKey = key.toLowerCase();

        if (normalizedKey === "phone" || normalizedKey === "phonenumber") {
          mappedErrors.phone = errorData[key];
        } else if (normalizedKey === "email") {
          mappedErrors.email = errorData[key];
        } else if (normalizedKey === "password") {
          mappedErrors.password = errorData[key];
        } else if (normalizedKey === "fullname" || normalizedKey === "name") {
          mappedErrors.fullName = errorData[key];
        } else if (normalizedKey === "salon" || normalizedKey === "salonid") {
          mappedErrors.salonId = errorData[key];
        } else if (normalizedKey === "role") {
          mappedErrors.role = errorData[key];
        } else {
          mappedErrors[key] = errorData[key];
        }
      });
    } else {
      mappedErrors.general = "An unexpected error occurred. Please try again.";
    }

    return mappedErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("📝 Form submitted, validating...");
    console.log("📝 Current form data:", formData);

    setErrors({});

    const isValid = validateForm();

    if (!isValid) {
      console.log("❌ Validation failed, stopping submission");
      return;
    }

    console.log("✅ Validation passed, proceeding with submission");

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
          role: userRole === "ADMIN" ? "MANAGER" : "STYLIST",
          salonId: "",
        });
        setErrors({});
        onClose();
      } else {
        console.log("❌ Create user error result:", result);

        const mappedErrors = mapBackendErrorsToFields(result.error);
        setErrors(mappedErrors);
      }
    } catch (error) {
      console.error("❌ Create user exception:", error);

      let errorToProcess = null;

      if (error.response?.data?.message) {
        errorToProcess = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorToProcess = error.response.data.error;
      } else if (error.response?.data?.errors) {
        errorToProcess = error.response.data.errors;
      } else if (error.message) {
        errorToProcess = error.message;
      } else {
        errorToProcess = `An unexpected error occurred while creating ${formData.role.toLowerCase()}.`;
      }

      const mappedErrors = mapBackendErrorsToFields(errorToProcess);
      setErrors(mappedErrors);
    } finally {
      setLoading(false);
    }
  };

  const getRoleOptions = () => {
    if (userRole === "ADMIN") {
      return [{ value: "MANAGER", label: "Manager" }];
    } else if (userRole === "MANAGER") {
      return [{ value: "STYLIST", label: "Stylist" }];
    }
    return [];
  };

  const getModalTitle = () => {
    if (userRole === "ADMIN") {
      return "Create New Manager";
    } else if (userRole === "MANAGER") {
      return "Create New Stylist";
    }
    return "Create New User";
  };

  const getInfoMessage = () => {
    if (userRole === "ADMIN") {
      return "As an administrator, you can create managers and assign them to salons.";
    } else if (userRole === "MANAGER") {
      return "As a manager, you can create stylists for your salon.";
    }
    return "Create a new user account.";
  };

  if (!isOpen) return null;

  const roleOptions = getRoleOptions();

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
                    {getModalTitle()}
                  </h3>

                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
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
                      <p className="text-sm text-blue-700">
                        {getInfoMessage()}
                      </p>
                    </div>
                  </div>

                  {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start">
                        <svg
                          className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0"
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
                        <p className="text-sm text-red-700 font-medium">
                          {errors.general}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.fullName
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                        placeholder="Enter full name"
                        disabled={loading}
                      />
                      {errors.fullName && (
                        <div className="mt-1 flex items-start">
                          <svg
                            className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0"
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
                          <p className="text-sm text-red-600 font-medium">
                            {errors.fullName}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                        placeholder="Enter email address"
                        disabled={loading}
                      />
                      {errors.email && (
                        <div className="mt-1 flex items-start">
                          <svg
                            className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0"
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
                          <p className="text-sm text-red-600 font-medium">
                            {errors.email}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.password
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                        placeholder="Enter password (min 6 characters)"
                        disabled={loading}
                      />
                      {errors.password && (
                        <div className="mt-1 flex items-start">
                          <svg
                            className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0"
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
                          <p className="text-sm text-red-600 font-medium">
                            {errors.password}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.phone
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                        placeholder="+84912345678"
                        disabled={loading}
                      />
                      {errors.phone && (
                        <div className="mt-1 flex items-start">
                          <svg
                            className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0"
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
                          <p className="text-sm text-red-600 font-medium">
                            {errors.phone}
                          </p>
                        </div>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Enter international phone number with country code
                        (e.g., +84912345678)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        disabled={loading}
                      >
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role *
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.role
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                        disabled={loading || roleOptions.length <= 1}
                      >
                        {roleOptions.length > 0 ? (
                          roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))
                        ) : (
                          <option value="">No role available</option>
                        )}
                      </select>
                      {errors.role && (
                        <div className="mt-1 flex items-start">
                          <svg
                            className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0"
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
                          <p className="text-sm text-red-600 font-medium">
                            {errors.role}
                          </p>
                        </div>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        {userRole === "ADMIN"
                          ? "You can only create managers"
                          : "You can only create stylists for your salon"}
                      </p>
                    </div>

                    {formData.role === "MANAGER" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assign to Salon *
                        </label>
                        <select
                          name="salonId"
                          value={formData.salonId}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                            errors.salonId
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                          disabled={loading}
                        >
                          <option value="">Select salon to manage</option>
                          {salons.map((salon) => (
                            <option key={salon.id} value={salon.id}>
                              {salon.name} - {salon.address}
                            </option>
                          ))}
                        </select>
                        {errors.salonId && (
                          <div className="mt-1 flex items-start">
                            <svg
                              className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0"
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
                            <p className="text-sm text-red-600 font-medium">
                              {errors.salonId}
                            </p>
                          </div>
                        )}

                        {salons.length === 0 && (
                          <p className="mt-1 text-sm text-gray-500">
                            Loading salons...
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
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  `Create ${
                    formData.role === "MANAGER" ? "Manager" : "Stylist"
                  }`
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-colors"
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
