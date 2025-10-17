import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Bike, User, Mail, Lock, Phone, MapPin, Hash } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Card, CardContent } from '../../components/common/Card'
import { authService, regionalService } from '../../api'
import { DocumentType, RegisterUserDto, Regional } from '../../types'
import { ROUTES } from '../../constants'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [regionals, setRegionals] = useState<Regional[]>([])
  const [loadingRegionals, setLoadingRegionals] = useState(true)

  // Form state
  const [formData, setFormData] = useState<RegisterUserDto>({
    documentType: DocumentType.CC,
    documentNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    socioeconomicStratum: undefined,
    regionalId: '',
  })

  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load regionals from backend
  useEffect(() => {
    const loadRegionals = async () => {
      try {
        setLoadingRegionals(true)
        const data = await regionalService.getAll()
        setRegionals(data)

        // Set first regional as default
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, regionalId: data[0]._id }))
        }
      } catch (error) {
        console.error('Error loading regionals:', error)
        toast.error('Error al cargar las regionales')
      } finally {
        setLoadingRegionals(false)
      }
    }

    loadRegionals()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Convert socioeconomicStratum to number
    if (name === 'socioeconomicStratum') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value) : undefined,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate required fields
    if (!formData.documentType) newErrors.documentType = 'Tipo de documento es requerido'
    if (!formData.documentNumber) newErrors.documentNumber = 'Número de documento es requerido'
    if (!formData.firstName) newErrors.firstName = 'Nombre es requerido'
    if (!formData.lastName) newErrors.lastName = 'Apellido es requerido'
    if (!formData.email) newErrors.email = 'Correo electrónico es requerido'
    if (!formData.password) newErrors.password = 'Contraseña es requerida'
    if (!formData.regionalId) newErrors.regionalId = 'Regional es requerida'

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido'
    }

    // Validate password length
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    // Validate password confirmation
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    // Validate document number (only numbers)
    if (formData.documentNumber && !/^\d+$/.test(formData.documentNumber)) {
      newErrors.documentNumber = 'El número de documento debe contener solo números'
    }

    // Validate phone (optional but must be valid if provided)
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos'
    }

    // Validate stratum (1-6)
    if (formData.socioeconomicStratum !== undefined) {
      if (formData.socioeconomicStratum < 1 || formData.socioeconomicStratum > 6) {
        newErrors.socioeconomicStratum = 'El estrato debe estar entre 1 y 6'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario')
      return
    }

    try {
      setIsLoading(true)

      // Prepare data (remove empty optional fields)
      const dataToSend: RegisterUserDto = {
        ...formData,
        phone: formData.phone || undefined,
        socioeconomicStratum: formData.socioeconomicStratum || undefined,
      }

      const response = await authService.register(dataToSend)

      // Store token and user
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }

      toast.success('¡Registro exitoso! Bienvenido')

      // Redirect based on role
      if (response.data?.user?.role === 'admin') {
        navigate(ROUTES.ADMIN_DASHBOARD)
      } else {
        navigate(ROUTES.HOME)
      }
    } catch (error: any) {
      console.error('Error during registration:', error)
      toast.error(error.response?.data?.message || 'Error al registrarse')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sena-orange to-sena-green flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-3xl">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Bike className="h-16 w-16 text-sena-orange" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">SENA Bikes</h1>
            <p className="text-gray-600 mt-2">Crea tu cuenta para comenzar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Documento *
                </label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className="input-field w-full"
                  required
                >
                  <option value={DocumentType.CC}>Cédula de Ciudadanía</option>
                  <option value={DocumentType.TI}>Tarjeta de Identidad</option>
                  <option value={DocumentType.CE}>Cédula de Extranjería</option>
                </select>
                {errors.documentType && (
                  <p className="text-sm text-red-600 mt-1">{errors.documentType}</p>
                )}
              </div>

              <div>
                <Input
                  type="text"
                  name="documentNumber"
                  label="Número de Documento *"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  placeholder="1234567890"
                  required

                />
                {errors.documentNumber && (
                  <p className="text-sm text-red-600 mt-1">{errors.documentNumber}</p>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  name="firstName"
                  label="Nombre *"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Juan"
                  required

                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <Input
                  type="text"
                  name="lastName"
                  label="Apellido *"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Pérez"
                  required

                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="email"
                  name="email"
                  label="Correo Electrónico *"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required

                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Input
                  type="tel"
                  name="phone"
                  label="Teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="3001234567"

                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Regional and Stratum */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Regional SENA (Departamento) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    name="regionalId"
                    value={formData.regionalId}
                    onChange={handleChange}
                    className="input-field w-full pl-10"
                    required
                    disabled={loadingRegionals}
                  >
                    {loadingRegionals ? (
                      <option>Cargando regionales...</option>
                    ) : regionals.length === 0 ? (
                      <option>No hay regionales disponibles</option>
                    ) : (
                      <>
                        <option value="">Seleccionar Regional</option>
                        {regionals.map((regional) => (
                          <option key={regional._id} value={regional._id}>
                            {regional.name} - {regional.city}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
                {errors.regionalId && (
                  <p className="text-sm text-red-600 mt-1">{errors.regionalId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estrato Socioeconómico
                </label>
                <select
                  name="socioeconomicStratum"
                  value={formData.socioeconomicStratum || ''}
                  onChange={handleChange}
                  className="input-field w-full"
                >
                  <option value="">Seleccionar (Opcional)</option>
                  <option value="1">Estrato 1</option>
                  <option value="2">Estrato 2</option>
                  <option value="3">Estrato 3</option>
                  <option value="4">Estrato 4</option>
                  <option value="5">Estrato 5</option>
                  <option value="6">Estrato 6</option>
                </select>
                {errors.socioeconomicStratum && (
                  <p className="text-sm text-red-600 mt-1">{errors.socioeconomicStratum}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="password"
                  name="password"
                  label="Contraseña *"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required

                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  name="confirmPassword"
                  label="Confirmar Contraseña *"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: '' }))
                    }
                  }}
                  placeholder="••••••••"
                  required

                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" fullWidth isLoading={isLoading} disabled={loadingRegionals}>
              Crear Cuenta
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to={ROUTES.LOGIN} className="text-sena-orange font-medium hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage
