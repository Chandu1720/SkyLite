import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { ChatBot } from './components/chat/ChatBot';
import { WelcomePromoModal } from './components/common/WelcomePromoModal';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { OccasionsPage } from './pages/customer/OccasionsPage';
import { TheatresPage } from './pages/customer/TheatresPage';
import { TheatreDetailPage } from './pages/customer/TheatreDetailPage';
import { PackagesPage } from './pages/customer/PackagesPage';
import { GalleryPage } from './pages/customer/GalleryPage';
import { BookingPage } from './pages/customer/BookingPage';
import { PaymentPage } from './pages/customer/PaymentPage';
import { BookingConfirmationPage } from './pages/customer/BookingConfirmationPage';
import { BookingStatusPage } from './pages/customer/BookingStatusPage';
import { ContactPage } from './pages/customer/ContactPage';
import { HowItWorksPage } from './pages/customer/HowItWorksPage';
import { PrivacyPolicyPage } from './pages/customer/PrivacyPolicyPage';
import { TermsPage } from './pages/customer/TermsPage';
import { CancellationPolicyPage } from './pages/customer/CancellationPolicyPage';

// Admin Pages
import { LoginPage as AdminLoginPage } from './pages/admin/LoginPage';
import { AdminLayout } from './components/layout/AdminLayout';
import { DashboardPage as AdminDashboardPage } from './pages/admin/DashboardPage';
import { BookingsPage as AdminBookingsPage } from './pages/admin/BookingsPage';
import { BookingDetailPage as AdminBookingDetailPage } from './pages/admin/BookingDetailPage';
import { CalendarPage as AdminCalendarPage } from './pages/admin/CalendarPage';
import { SlotsPage as AdminSlotsPage } from './pages/admin/SlotsPage';
import { TheatresPage as AdminTheatresPage } from './pages/admin/TheatresPage';
import { OccasionsPage as AdminOccasionsPage } from './pages/admin/OccasionsPage';
import { PackagesPage as AdminPackagesPage } from './pages/admin/PackagesPage';
import { AddOnsPage as AdminAddOnsPage } from './pages/admin/AddOnsPage';
import { CouponsPage as AdminCouponsPage } from './pages/admin/CouponsPage';
import { CustomersPage as AdminCustomersPage } from './pages/admin/CustomersPage';
import { PaymentsPage as AdminPaymentsPage } from './pages/admin/PaymentsPage';
import { ReportsPage as AdminReportsPage } from './pages/admin/ReportsPage';
import { SettingsPage as AdminSettingsPage } from './pages/admin/SettingsPage';
import { AuditLogsPage as AdminAuditLogsPage } from './pages/admin/AuditLogsPage';

// Protected Route for Admin
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-darker flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <ThemeProvider>
      <AuthProvider>
        <BookingProvider>
          <ToastProvider>
            <Routes>
            {/* Customer Facing Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/occasions" element={<OccasionsPage />} />
            <Route path="/theatres" element={<TheatresPage />} />
            <Route path="/theatres/:id" element={<TheatreDetailPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/payment/:ref" element={<PaymentPage />} />
            <Route path="/booking/confirmation/:ref" element={<BookingConfirmationPage />} />
            <Route path="/booking/status" element={<BookingStatusPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedAdminRoute>
                  <AdminBookingsPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/bookings/:id"
              element={
                <ProtectedAdminRoute>
                  <AdminBookingDetailPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/calendar"
              element={
                <ProtectedAdminRoute>
                  <AdminCalendarPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/slots"
              element={
                <ProtectedAdminRoute>
                  <AdminSlotsPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/theatres"
              element={
                <ProtectedAdminRoute>
                  <AdminTheatresPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/occasions"
              element={
                <ProtectedAdminRoute>
                  <AdminOccasionsPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/packages"
              element={
                <ProtectedAdminRoute>
                  <AdminPackagesPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/addons"
              element={
                <ProtectedAdminRoute>
                  <AdminAddOnsPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/coupons"
              element={
                <ProtectedAdminRoute>
                  <AdminCouponsPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <ProtectedAdminRoute>
                  <AdminCustomersPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <ProtectedAdminRoute>
                  <AdminPaymentsPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedAdminRoute>
                  <AdminReportsPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedAdminRoute>
                  <AdminSettingsPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedAdminRoute>
                  <AdminAuditLogsPage />
                </ProtectedAdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {!isAdminRoute && (
            <>
              <WelcomePromoModal />
              <ChatBot />
            </>
          )}
          </ToastProvider>
        </BookingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
