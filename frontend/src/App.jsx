import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import CustomerProtectedRoute from "./components/common/CustomerProtectedRoute";
import AdminProtectedRoute from "./components/common/AdminProtectedRoute";
import ManagerProtectedRoute from "./components/common/ManagerProtectedRoute";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Salons from "./pages/Salons";
import Stylists from "./pages/Stylists";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import NotificationsPage from "./pages/NotificationsPage";
import ForgotPassword from "./components/auth/ForgotPassword";

import Profile from "./pages/Profile";
import BookingFormPage from "./pages/BookingFormPage";
import BookingListPage from "./pages/BookingListPage";
import BookingDetailPage from "./pages/BookingDetailPage";

import AdminLogin from "./pages/admin/AdminLogin";
import UserManagementPage from "./pages/admin/UserManagementPage";
import SalonManagementPage from "./pages/admin/SalonManagementPage";
import ServiceManagementPage from "./pages/admin/ServiceManagementPage";

import ManagerDashboardPage from "./pages/manager/ManagerDashboardPage";
import ManagerStylistManagementPage from "./pages/manager/ManagerStylistManagementPage";
import ManagerDayOffManagementPage from "./pages/manager/ManagerDayOffManagementPage";
import ManagerBookingManagementPage from "./pages/manager/ManagerBookingManagementPage";

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
          <Route path="/notifications" element={<NotificationsPage />} /> 
          <Route path="/stylists" element={<Stylists />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="/manager/dashboard" element={<ManagerDashboardPage />} />
          <Route path="/manager/stylists" element={<ManagerStylistManagementPage />} />
          <Route path="/manager/dayoff" element={<ManagerDayOffManagementPage />} />
          
          {/* Stylist */}
          <Route path="/stylist-dashboard" element={<StylistDashboardPage />} />
          <Route path="/stylist-dashboard/notifications" element={<StylistNotificationsPage />} />
          <Route path="/stylist-dashboard/notifications/*"element={<StylistNotificationsPage />} />
          <Route path="/stylist-dashboard/leaves" element={<StylistLeaveManagementPage />} />
          <Route path="/stylist-dashboard/leaves/create" element={<StylistCreateLeavePage />} />
          <Route path="/profile" element={
            <CustomerProtectedRoute>
              <Profile />
            </CustomerProtectedRoute>
          } />
          <Route path="/booking" element={
            <CustomerProtectedRoute>
              <BookingListPage />
            </CustomerProtectedRoute>
          } />
          <Route path="/booking/new" element={
            <CustomerProtectedRoute>
              <BookingFormPage />
            </CustomerProtectedRoute>
          } />
          <Route path="/booking/:id" element={
            <CustomerProtectedRoute>
              <BookingDetailPage />
            </CustomerProtectedRoute>
          } />

          <Route path="/user-management" element={
            <AdminProtectedRoute>
              <UserManagementPage />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/salons" element={
            <AdminProtectedRoute>
              <SalonManagementPage />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/services" element={
            <AdminProtectedRoute>
              <ServiceManagementPage />
            </AdminProtectedRoute>
          } />

          <Route path="/manager/dashboard" element={
            <ManagerProtectedRoute>
              <ManagerDashboardPage />
            </ManagerProtectedRoute>
          } />
          <Route path="/manager/stylists" element={
            <ManagerProtectedRoute>
              <ManagerStylistManagementPage />
            </ManagerProtectedRoute>
          } />
          <Route path="/manager/dayoff" element={
            <ManagerProtectedRoute>
              <ManagerDayOffManagementPage />
            </ManagerProtectedRoute>
          } />
          <Route path="/manager/bookings" element={
            <ManagerProtectedRoute>
              <ManagerBookingManagementPage />
            </ManagerProtectedRoute>
          } />

          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Page not found</p>
                <a 
                  href="/" 
                  className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition"
                >
                  Go Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
