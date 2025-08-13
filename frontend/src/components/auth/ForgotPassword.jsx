import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [isRequest, setIsRequest] = useState(true);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [receivedCode, setReceivedCode] = useState("");

  const API_PATH = import.meta.env.VITE_API_PATH;

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_PATH}/auth/forgot-password`,
        { email }
      );
      if (response) {
        setReceivedCode("");
        setIsRequest(false);
        setError("");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.Message ||
        "Unexpected error occurred";
      setError(msg);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    try {
      const verifyRes = await axios.post(`${API_PATH}/auth/verify-reset-otp`, {
        email,
        otp,
      });

      const { resetToken } = verifyRes.data || {};
      if (!resetToken) {
        setError("Failed to verify OTP. Please try again.");
        return;
      }

      const resetRes = await axios.post(`${API_PATH}/auth/reset-password`, {
        email,
        resetToken,
        newPassword,
      });

      if (resetRes) {
        navigate("/login");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Unexpected error occurred";
      setError(msg);

      if (typeof msg === "string" && msg.toLowerCase().includes("expired")) {
        try {
          const reReq = await axios.post(
            `${API_PATH}/auth/forgot-password`,
            { email }
          );
          if (reReq) {
            setIsRequest(false);
            setError("Your OTP has expired. A new OTP was sent to your email.");
          }
        } catch {
          setError("OTP expired. Failed to send a new OTP.");
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-red-200">
        {isRequest ? (
          <div>
            <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">
              Forgot Password
            </h2>
            {/* Show Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleForgotPassword}>
              {/* Enter email */}
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-medium mb-1">
                  Enter your email
                </label>
                <input
                  type="email"
                  placeholder="abc@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
              >
                Get Reset Code
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">
              Reset Password
            </h2>
            {/* Show Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Show received code */}
            {receivedCode && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700 mb-2 font-bold">Your reset code:</p>
                <p className="text-blue-700 text-xl font-mono text-center">
                  {receivedCode}
                </p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleResetPassword}>
              {/* Enter OTP */}
              <div className="flex flex-col">
                <label htmlFor="reset-code" className="text-sm font-medium mb-1">
                  Enter the OTP sent to your email
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456"
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Enter new Password */}
              <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-medium mb-1">
                  Enter your new password
                </label>
                <input
                  type="password"
                  placeholder="*********"
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Confirm password */}
              <div className="flex flex-col">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium mb-1"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  placeholder="********"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
              >
                Reset Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
