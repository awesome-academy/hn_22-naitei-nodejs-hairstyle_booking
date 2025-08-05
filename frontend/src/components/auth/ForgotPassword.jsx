import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/services/authApi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    resetToken: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setMessage("");
    setError("");
  }, [step]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRequestOtp = async () => {
    if (!form.email) {
      setError("Please enter your email");
      return;
    }
    try {
      setLoading(true);
      await authApi.forgotPassword(form.email);
      setMessage("OTP has been sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!form.otp) {
      setError("Please enter the OTP");
      return;
    }
    try {
      setLoading(true);
      const res = await authApi.verifyOtp({ email: form.email, otp: form.otp });
      setForm((prev) => ({ ...prev, resetToken: res.resetToken }));
      setMessage("OTP verified. You can now reset your password.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const { newPassword, confirmPassword, email, resetToken } = form;

    if (!newPassword || !confirmPassword) {
      setError("Please enter all password fields");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await authApi.resetPassword({ email, resetToken, newPassword });
      setMessage("Password has been reset successfully. You can now login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label className="block mb-1 font-semibold text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Enter your registered email"
              required
            />
            <button
              onClick={handleRequestOtp}
              className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        );
      case 2:
        return (
          <>
            <label className="block mb-1 font-semibold text-gray-700">
              OTP Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Enter OTP sent to your email"
              required
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        );
      case 3:
        return (
          <>
            <label className="block mb-1 font-semibold text-gray-700">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Enter new password"
              required
            />
            <label className="block mb-1 mt-4 font-semibold text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Confirm new password"
              required
            />
            <button
              onClick={handleResetPassword}
              className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
          Forgot Password
        </h2>

        <div className="space-y-4">{renderStep()}</div>

        {message && (
          <div className="mt-4 text-green-600 text-sm text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
        )}

        <p className="mt-6 text-center text-gray-600">
          Remembered your password?{" "}
          <button
            className="text-red-500 font-semibold hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
