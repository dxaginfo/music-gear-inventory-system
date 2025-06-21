import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// Store
import { store } from './store';

// Theme
import theme from './theme';

// Layout
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';

// Equipment Pages
import EquipmentListPage from './pages/equipment/EquipmentListPage';
import EquipmentDetailPage from './pages/equipment/EquipmentDetailPage';
import EquipmentAddPage from './pages/equipment/EquipmentAddPage';
import EquipmentEditPage from './pages/equipment/EquipmentEditPage';

// Maintenance Pages
import MaintenanceListPage from './pages/maintenance/MaintenanceListPage';
import MaintenanceDetailPage from './pages/maintenance/MaintenanceDetailPage';
import MaintenanceAddPage from './pages/maintenance/MaintenanceAddPage';

// Event Pages
import EventListPage from './pages/events/EventListPage';
import EventDetailPage from './pages/events/EventDetailPage';
import EventAddPage from './pages/events/EventAddPage';
import EventEditPage from './pages/events/EventEditPage';

// Rental Pages
import RentalListPage from './pages/rentals/RentalListPage';
import RentalDetailPage from './pages/rentals/RentalDetailPage';
import RentalAddPage from './pages/rentals/RentalAddPage';

// Report Pages
import ReportsPage from './pages/reports/ReportsPage';
import InventoryReportPage from './pages/reports/InventoryReportPage';
import MaintenanceReportPage from './pages/reports/MaintenanceReportPage';
import ValueReportPage from './pages/reports/ValueReportPage';

// Settings Pages
import SettingsPage from './pages/settings/SettingsPage';
import ProfilePage from './pages/settings/ProfilePage';
import OrganizationPage from './pages/settings/OrganizationPage';
import UsersPage from './pages/settings/UsersPage';
import CategoriesPage from './pages/settings/CategoriesPage';

// Error Pages
import NotFoundPage from './pages/errors/NotFoundPage';

// Guards
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route element={<GuestGuard />}>
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>
              </Route>

              {/* Protected Routes */}
              <Route element={<AuthGuard />}>
                <Route element={<MainLayout />}>
                  {/* Dashboard */}
                  <Route path="/dashboard" element={<DashboardPage />} />

                  {/* Equipment */}
                  <Route path="/equipment" element={<EquipmentListPage />} />
                  <Route path="/equipment/add" element={<EquipmentAddPage />} />
                  <Route path="/equipment/:id" element={<EquipmentDetailPage />} />
                  <Route path="/equipment/:id/edit" element={<EquipmentEditPage />} />

                  {/* Maintenance */}
                  <Route path="/maintenance" element={<MaintenanceListPage />} />
                  <Route path="/maintenance/add" element={<MaintenanceAddPage />} />
                  <Route path="/maintenance/:id" element={<MaintenanceDetailPage />} />

                  {/* Events */}
                  <Route path="/events" element={<EventListPage />} />
                  <Route path="/events/add" element={<EventAddPage />} />
                  <Route path="/events/:id" element={<EventDetailPage />} />
                  <Route path="/events/:id/edit" element={<EventEditPage />} />

                  {/* Rentals */}
                  <Route path="/rentals" element={<RentalListPage />} />
                  <Route path="/rentals/add" element={<RentalAddPage />} />
                  <Route path="/rentals/:id" element={<RentalDetailPage />} />

                  {/* Reports */}
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/reports/inventory" element={<InventoryReportPage />} />
                  <Route path="/reports/maintenance" element={<MaintenanceReportPage />} />
                  <Route path="/reports/value" element={<ValueReportPage />} />

                  {/* Settings */}
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/settings/profile" element={<ProfilePage />} />
                  <Route path="/settings/organization" element={<OrganizationPage />} />
                  <Route path="/settings/users" element={<UsersPage />} />
                  <Route path="/settings/categories" element={<CategoriesPage />} />
                </Route>
              </Route>

              {/* Redirect root to dashboard or login */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
          {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;