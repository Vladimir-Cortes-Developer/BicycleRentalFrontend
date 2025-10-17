import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { ROUTES } from '../../constants'
import { Menu, X, Bike, Calendar, User, LogOut, Home, History } from 'lucide-react'
import { useState } from 'react'

const MainLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  const navItems = [
    { name: 'Inicio', path: ROUTES.HOME, icon: Home },
    { name: 'Bicicletas', path: ROUTES.BICYCLES, icon: Bike },
    { name: 'Mi Alquiler', path: ROUTES.MY_RENTAL, icon: Bike },
    { name: 'Historial', path: ROUTES.RENTAL_HISTORY, icon: History },
    { name: 'Eventos', path: ROUTES.EVENTS, icon: Calendar },
    { name: 'Mis Eventos', path: ROUTES.MY_EVENTS, icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to={ROUTES.HOME} className="flex items-center space-x-2">
                <Bike className="h-8 w-8 text-sena-orange" />
                <span className="text-xl font-bold text-gray-900">SENA Bikes</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-sena-orange hover:bg-gray-100 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to={ROUTES.PROFILE}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-sena-orange hover:bg-gray-100"
              >
                <User className="h-4 w-4" />
                <span>{user?.firstName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-sena-orange hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-sena-orange hover:bg-gray-100"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <Link
                to={ROUTES.PROFILE}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-sena-orange hover:bg-gray-100"
              >
                <User className="h-5 w-5" />
                <span>Perfil</span>
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  handleLogout()
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
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
            © 2024 SENA - Sistema de Alquiler de Bicicletas
          </p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout