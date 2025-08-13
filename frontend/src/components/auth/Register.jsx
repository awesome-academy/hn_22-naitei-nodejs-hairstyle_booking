import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dob = new Date(formData.dateOfBirth);
  const dateOnly = isNaN(dob.getTime()) ? formData.dateOfBirth : dob.toISOString().slice(0, 10);
  const [formData, setFormData] = useState({
    fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
    phone: formData.phoneNumber || undefined, 
    avatar: formData.avatar || undefined,
    address: formData.address || undefined,
    gender: formData.gender || undefined,
    dateOfBirth: dateOnly,
  });

  const API_PATH = import.meta.env.VITE_API_PATH;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setError("");
  };

  const handleRegister = async () => {
  const fullName = `${(formData.firstName || '').trim()} ${(formData.lastName || '').trim()}`.trim();

  if (
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword ||
    !fullName ||
    !formData.dateOfBirth 
  ) {
    setError("Please fill all required fields");
    return;
  }

  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters long");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  if (formData.phoneNumber && !/^0[0-9]{9}$/.test(formData.phoneNumber)) {
    setError("Phone number must start with 0 and be exactly 10 digits.");
    return;
  }

  try {
    setLoading(true);

    const dob = new Date(formData.dateOfBirth);
    const dateOnly = isNaN(dob.getTime())
      ? formData.dateOfBirth
      : dob.toISOString().slice(0, 10);

    const requestData = {
      fullName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      ...(formData.phoneNumber ? { phone: formData.phoneNumber } : {}),
      dateOfBirth: dateOnly,
    };

    const response = await axios.post(`${API_PATH}/auth/register`, requestData);

    if (response) {
      navigate("/login");
    }
    } catch (err) {
        if (err.response && err.response.data) {
        const data = err.response.data;
        if (Array.isArray(data.message)) {
            setError(data.message.join(", "));
        } else if (data.message) {
            setError(data.message);
        } else if (data.error) {
            setError(data.error);
        } else {
            setError("Registration failed. Please try again.");
        }
        } else {
        setError("An unexpected error occurred. Please try again.");
        }
    } finally {
        setLoading(false);
    }
 };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div
      className={`bg-white p-8 rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto transform transition-transform duration-500 ${
        isVisible ? "translate-y-0" : "translate-y-[-20px]"
      }`}
    >
      {/* Title */}
      <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
        Create Account
      </h2>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Password + Confirm */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Confirm <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Name fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Date of Birth */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-1">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="dateOfBirth"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
      </div>

      {/* Phone Number */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-1">
          Phone Number
        </label>
        <input
          type="text"
          name="phoneNumber"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
      </div>

      {/* Error */}
      {error && <div className="text-red-500 text-left mt-4">{error}</div>}

      {/* Register Button */}
      <button
        className={`w-full bg-red-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-600 transition duration-200 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Processing..." : "Create Account"}
      </button>

      {/* Login Link */}
      <p className="mt-4 text-center text-gray-600">
        Already have an account?{" "}
        <button
          onClick={goToLogin}
          className="text-red-500 font-semibold hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  </div>
  );
};

export default Register;
