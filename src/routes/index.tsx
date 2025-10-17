import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute, AdminRoute, PublicRoute } from '../guards'
import { useAuth } from '../hooks'
import { ROUTES } from '../constants'

// Layouts
import MainLayout from '../components/layout/MainLayout'
import AdminLayout from '../components/layout/AdminLayout'

// Public Pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// User Pages
import HomePage from '../pages/HomePage'
import BicyclesPage from '../pages/bicycles/BicyclesPage'
import BicycleDetailPage from '../pages/bicycles/BicycleDetailPage'
import MyRentalPage from '../pages/rentals/MyRentalPage'
import RentalHistoryPage from '../pages/rentals/RentalHistoryPage'
import EventsPage from '../pages/events/EventsPage'
// import EventsPage from '../pages/events/EventsPageSimple'
import EventDetailPage from '../pages/events/EventDetailPage'
import MyEventsPage from '../pages/events/MyEventsPage'
import ProfilePage from '../pages/ProfilePage'

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminBicyclesPage from '../pages/admin/bicycles/AdminBicyclesPage'
import AdminBicycleFormPage from '../pages/admin/bicycles/AdminBicycleFormPage'
import AdminRentalsPage from '../pages/admin/rentals/AdminRentalsPage'
import AdminEventsPage from '../pages/admin/events/AdminEventsPage'
import AdminEventFormPage from '../pages/admin/events/AdminEventFormPage'
import AdminMaintenancePage from '../pages/admin/maintenance/AdminMaintenancePage'
import AdminMaintenanceFormPage from '../pages/admin/maintenance/AdminMaintenanceFormPage'
import AdminReportsPage from '../pages/admin/reports/AdminReportsPage'
import AdminMapPage from '../pages/admin/map/AdminMapPage'

// Error Pages
import NotFoundPage from '../pages/NotFoundPage'

// Root redirect component based on user role
const RootRedirect = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sena-orange"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (isAdmin) {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
  }

  return <Navigate to={ROUTES.HOME} replace />
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      {/* Private Routes - User */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.BICYCLES} element={<BicyclesPage />} />
          <Route path={ROUTES.BICYCLE_DETAIL} element={<BicycleDetailPage />} />
          <Route path={ROUTES.MY_RENTAL} element={<MyRentalPage />} />
          <Route path={ROUTES.RENTAL_HISTORY} element={<RentalHistoryPage />} />
          <Route path={ROUTES.EVENTS} element={<EventsPage />} />
          <Route path={ROUTES.EVENT_DETAIL} element={<EventDetailPage />} />
          <Route path={ROUTES.MY_EVENTS} element={<MyEventsPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
          <Route path={ROUTES.ADMIN_BICYCLES} element={<AdminBicyclesPage />} />
          <Route path={ROUTES.ADMIN_BICYCLES_CREATE} element={<AdminBicycleFormPage />} />
          <Route path={ROUTES.ADMIN_BICYCLES_EDIT} element={<AdminBicycleFormPage />} />
          <Route path={ROUTES.ADMIN_RENTALS} element={<AdminRentalsPage />} />
          <Route path={ROUTES.ADMIN_EVENTS} element={<AdminEventsPage />} />
          <Route path={ROUTES.ADMIN_EVENTS_CREATE} element={<AdminEventFormPage />} />
          <Route path={ROUTES.ADMIN_EVENTS_EDIT} element={<AdminEventFormPage />} />
          <Route path={ROUTES.ADMIN_MAINTENANCE} element={<AdminMaintenancePage />} />
          <Route path={ROUTES.ADMIN_MAINTENANCE_CREATE} element={<AdminMaintenanceFormPage />} />
          <Route path={ROUTES.ADMIN_MAINTENANCE_EDIT} element={<AdminMaintenanceFormPage />} />
          <Route path={ROUTES.ADMIN_REPORTS} element={<AdminReportsPage />} />
          <Route path={ROUTES.ADMIN_MAP} element={<AdminMapPage />} />
        </Route>
      </Route>

      {/* Redirect root based on role */}
      <Route path="/" element={<RootRedirect />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes