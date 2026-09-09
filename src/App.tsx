import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './pages/shared/Layout';
import ProtectedRoute from './pages/shared/ProtectedRoute';

import Home from './pages/public/Home';
import Halls from './pages/public/Halls';
import HallDetails from './pages/public/HallDetails';
import PackageSelection from './pages/customer/PackageSelection';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import NotFound from './pages/shared/NotFound';
import Booking from './pages/customer/Booking';
import BookingSubmitted from './pages/customer/BookingSubmitted';


import Dashboard from './pages/customer/Dashboard';
import BookingDetails from './pages/customer/BookingDetails';
import Profile from './pages/customer/Profile';
import Payment from './pages/customer/Payment';
import CustomerNotifications from './pages/customer/Notifications';
import Wishlist from './pages/customer/Wishlist';

// Admin Pages
import BudgetCalculator from './pages/public/BudgetCalculator';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminHalls from './pages/admin/AdminHalls';
import AdminReports from './pages/admin/AdminReports';
import AdminPackages from './pages/admin/AdminPackages';
import AdminPayments from './pages/admin/AdminPayments';
import AdminCancellations from './pages/admin/AdminCancellations';
import AdminReviews from './pages/admin/AdminReviews';
import AdminAvailability from './pages/admin/AdminAvailability';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminEventTypes from './pages/admin/AdminEventTypes';
import AdminHallMaintenance from './pages/admin/AdminHallMaintenance';
import AdminSettings from './pages/admin/AdminSettings';
import AdminNotifications from './pages/admin/AdminNotifications';

import AppLoader from './pages/shared/AppLoader';
import { seedMoreReviews } from './scripts/seedMoreReviews';
import { deleteOldCancellations } from './scripts/deleteOldCancellations';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    (window as any).deleteOld = async () => {
      await deleteOldCancellations();
      alert('Old test data deleted! Reload the page.');
    };
    (window as any).runMoreReviews = async () => {
      await seedMoreReviews();
      alert('10 new reviews added! Reload the page.');
    };
    console.log('💡 TIP: Type window.deleteOld() or window.runMoreReviews() in the console.');
  }, []);

  return (
    <AuthProvider>
      <AppProvider>
        <ToastProvider>
        <AppLoader>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              <Route index element={<Home />} />
              <Route path="halls" element={<Halls />} />
              <Route path="halls/:id" element={<HallDetails />} />
              <Route path="budget-calculator" element={<BudgetCalculator />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="booking/packages" element={<PackageSelection />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes (Requires Customer Login) */}
              <Route element={<ProtectedRoute requiredRole="user" />}>
                <Route path="booking" element={<Booking />} />
                <Route path="booking/submitted" element={<BookingSubmitted />} />
                <Route path="booking/payment/:id" element={<Payment />} />


                <Route path="dashboard" element={<Dashboard />} />
                <Route path="dashboard/booking/:id" element={<BookingDetails />} />
                <Route path="profile" element={<Profile />} />
                <Route path="notifications" element={<CustomerNotifications />} />
                <Route path="wishlist" element={<Wishlist />} />
              </Route>

              {/* Administrative Routes (Requires Admin Login) */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="admin/bookings" element={<AdminBookings />} />
                <Route path="admin/halls" element={<AdminHalls />} />
                <Route path="admin/reports" element={<AdminReports />} />
                <Route path="admin/packages" element={<AdminPackages />} />

                <Route path="admin/payments" element={<AdminPayments />} />
                <Route path="admin/cancellations" element={<AdminCancellations />} />
                <Route path="admin/reviews" element={<AdminReviews />} />
                <Route path="admin/availability" element={<AdminAvailability />} />
                <Route path="admin/customers" element={<AdminCustomers />} />
                <Route path="admin/event-types" element={<AdminEventTypes />} />
                <Route path="admin/maintenance" element={<AdminHallMaintenance />} />
                <Route path="admin/settings" element={<AdminSettings />} />
                <Route path="admin/notifications" element={<AdminNotifications />} />
              </Route>
              
              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
        </AppLoader>
        </ToastProvider>
      </AppProvider>
    </AuthProvider>
  );
}
