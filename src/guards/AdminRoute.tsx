import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks'
import { ROUTES } from '../constants'

export const AdminRoute = () => {
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

  if (!isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <Outlet />
}