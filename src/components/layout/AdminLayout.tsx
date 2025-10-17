import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { ROUTES } from '../../constants'
import {
  Menu,
  X,
  Bike,
  Calendar,
  User,
  LogOut,
  LayoutDashboard,
  Wrench,
  FileText,
  Map,
} from 'lucide-react'
import { useState } from 'react'

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  const navItems = [
    { name: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
    { name: 'Bicicletas', path: ROUTES.ADMIN_BICYCLES, icon: Bike },
    { name: 'Alquileres', path: ROUTES.ADMIN_RENTALS, icon: Bike },
    { name: 'Eventos', path: ROUTES.ADMIN_EVENTS, icon: Calendar },
    { name: 'Mantenimiento', path: ROUTES.ADMIN_MAINTENANCE, icon: Wrench },
    { name: 'Reportes', path: ROUTES.ADMIN_REPORTS, icon: FileText },
    { name: 'Mapa', path: ROUTES.ADMIN_MAP, icon: Map },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-sena-dark text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to={ROUTES.ADMIN_DASHBOARD} className="flex items-center space-x-2">
                <Bike className="h-8 w-8 text-sena-orange" />
                <div>
                  <span className="text-xl font-bold">SENA Bikes</span>
                  <span className="block text-xs text-gray-400">Panel de Administración</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{user?.firstName}</span>
                <span className="text-xs bg-sena-orange px-2 py-0.5 rounded">Admin</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  handleLogout()
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-red-600"
              >
                <LogOut className="h-5 w-5" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2024 SENA - Panel de Administración
          </p>
        </div>
      </footer>
    </div>
  )
}

export default AdminLayout