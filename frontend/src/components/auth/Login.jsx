import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Login = ({ onClose }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const API_PATH = import.meta.env.VITE_API_PATH;

  const handleLogin = () => {
    axios.post(`${API_PATH}/Auth/login`, { email, password })
      .then(res => {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userRole", user.role?.name || user.role);

        switch (user.role?.name || user.role) {
          case "Manager":
            navigate("/manager-dashboard");
            break;
          case "Stylist":
            navigate("/stylist-dashboard");
            break;
          case "Customer":
            navigate("/customer-dashboard");
            break;
          default:
            setError("Unknown role. Please contact admin.");
        }
      })
      .catch(err => {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      });
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const goToRegister = () => {
    handleClose();
    navigate("/register");
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/70 z-50 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className={`bg-white p-6 rounded-lg shadow-lg w-96 relative transform transition-transform duration-500 ${isVisible ? "translate-y-0" : "-translate-y-5"}`}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold">X</button>

        <h2 className="text-2xl font-bold text-center text-pink-500">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mt-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            setError("");
          }}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mt-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            setError("");
          }}
        />

        <button
          className="w-full bg-pink-500 text-white px-4 py-2 rounded-lg mt-6 hover:bg-pink-600 transition"
          onClick={handleLogin}
        >
          Login
        </button>

        {error && <div className="text-red-500 text-left mt-2">{error}</div>}

        <p className="mt-4 text-center text-gray-600">
          Don’t have an account?{" "}
          <button onClick={goToRegister} className="text-pink-500 font-semibold hover:underline">
            Create Account
          </button>
        </p>

        <p className="mt-2 text-center text-gray-600">
          Forgot your password?{" "}
          <Link to="/forgot-password" className="text-pink-500 font-semibold hover:underline">
            Reset Password
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
