import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const API_PATH = import.meta.env.VITE_API_PATH;

  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    avatar: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleRegister = async () => {
    const { fullName, email, password, confirmPassword, phone } = formData;

    if (!fullName || !email || !password || !confirmPassword || !phone) {
      setError("Please fill all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }


    let normalizedPhone = phone.trim();
    if (/^0\d{9}$/.test(normalizedPhone)) {
      normalizedPhone = '+84' + normalizedPhone.slice(1);
    }

    if (!/^\+84\d{9}$/.test(normalizedPhone)) {
      setError("Phone number must start with 0 or +84 and be valid 10 digits.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        fullName,
        email,
        password,
        phone: normalizedPhone,
        gender: formData.gender || undefined,
        avatar: formData.avatar || undefined,
      };

      const res = await axios.post(`${API_PATH}/auth/register`, payload);
      if (res) {
        navigate("/login");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        className={`bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-500 ${
          isVisible ? "translate-y-0" : "-translate-y-4"
        }`}
      >
        <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
          Create Account
        </h2>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Nguyễn Văn A"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="abc@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            value={formData.email}
            onChange={handleChange}
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
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Confirm <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="phone"
            placeholder="0123456789"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Gender (optional) */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Gender (optional)
          </label>
          <select
            name="gender"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Error */}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {/* Register Button */}
        <button
          className={`w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Processing..." : "Register"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
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
