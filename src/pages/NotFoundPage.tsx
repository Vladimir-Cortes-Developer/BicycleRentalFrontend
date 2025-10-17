import { Link } from 'react-router-dom'
import { ROUTES } from '../constants'

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="text-xl text-gray-600 mt-4">Página no encontrada</p>
      <Link to={ROUTES.HOME} className="mt-6 inline-block text-sena-orange hover:underline">
        Volver al inicio
      </Link>
    </div>
  </div>
)
export default NotFoundPage