import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks'
import { ROUTES } from '../constants'

export const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth()

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

  // If already authenticated, redirect to home
  return !isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.HOME} replace />
}