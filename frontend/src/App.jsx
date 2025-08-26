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
import ManagerDashboardPage from "./pages/manager/ManagerDashboardPage";
import ManagerStylistManagementPage from "./pages/manager/ManagerStylistManagementPage";
import ManagerDayOffManagementPage from "./pages/manager/ManagerDayOffManagementPage";
import Stylists from "./pages/Stylists";
import BookingFormPage from "./pages/BookingFormPage";
import BookingListPage from "./pages/BookingListPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import StylistNotificationsPage from "./pages/stylist/StylistNotificationsPage";
import StylistLeaveManagementPage from "./pages/stylist/StylistLeaveManagementPage";
import StylistCreateLeavePage from "./pages/stylist/StylistCreateLeavePage";
import StylistDashboardPage from "./pages/stylist/StylistDashboardPage";

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
          <Route path="/booking" element={<BookingListPage />} />
          <Route path="/booking/new" element={<BookingFormPage />} />
          <Route path="/booking/:id" element={<BookingDetailPage />} />
          <Route path="/stylists" element={<Stylists />} />
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/manager/dashboard" element={<ManagerDashboardPage />} />
          <Route path="/manager/stylists" element={<ManagerStylistManagementPage />} />
          <Route path="/manager/dayoff" element={<ManagerDayOffManagementPage />} />
          
          {/* Stylist */}
          <Route path="/stylist-dashboard" element={<StylistDashboardPage />} />
          <Route path="/stylist-dashboard/notifications" element={<StylistNotificationsPage />} />
          <Route path="/stylist-dashboard/notifications/*"element={<StylistNotificationsPage />} />
          <Route path="/stylist-dashboard/leaves" element={<StylistLeaveManagementPage />} />
          <Route path="/stylist-dashboard/leaves/create" element={<StylistCreateLeavePage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
