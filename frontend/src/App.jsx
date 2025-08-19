import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Salons from "./pages/Salons";
import Profile from "./pages/Profile";
import UserManagementPage from "./pages/admin/UserManagementPage";
import AdminLogin from "./pages/admin/AdminLogin";
import SalonManagementPage from "./pages/admin/SalonManagementPage";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ServiceManagementPage from "./pages/admin/ServiceManagementPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/salons" element={<Salons />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/salons" element={<SalonManagementPage />} />
          <Route path="/admin/services" element={<ServiceManagementPage />} />
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
