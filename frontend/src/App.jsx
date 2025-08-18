import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Salons from "./pages/Salons";
import Profile from "./pages/Profile";
import UserManagementPage from "./pages/admin/UserManagementPage"
import AdminLogin from "./pages/admin/AdminLogin"
import SalonManagementPage from "./pages/admin/SalonManagementPage";
import { AuthProvider } from "./contexts/AuthContext";

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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
