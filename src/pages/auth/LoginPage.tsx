import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { Button, Input, Card } from '../../components/common'
import { ROUTES } from '../../constants'
import { Bike } from 'lucide-react'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login({ email, password })

      // Get the updated user info to check role
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user.role === 'admin') {
          navigate(ROUTES.ADMIN_DASHBOARD)
        } else {
          navigate(ROUTES.HOME)
        }
      } else {
        navigate(ROUTES.HOME)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sena-orange to-sena-green flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Bike className="h-16 w-16 text-sena-orange" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SENA Bikes</h1>
          <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="correo@ejemplo.com"
          />

          <Input
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            Iniciar Sesión
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to={ROUTES.REGISTER} className="text-sena-orange font-medium hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default LoginPage