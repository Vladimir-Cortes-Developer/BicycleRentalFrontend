import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bike, Clock, MapPin, Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Spinner } from '../../components/common/Spinner'
import { ConfirmModal } from '../../components/common/Modal'
import { rentalService } from '../../api'
import { Rental } from '../../types'
import { formatDate, formatCurrency } from '../../utils/format'
import { calculateRentalCost, calculateHoursBetweenDates } from '../../utils/helpers'
import { ROUTES } from '../../constants'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const MyRentalPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [rental, setRental] = useState<Rental | null>(null)
  const [loading, setLoading] = useState(true)
  const [returning, setReturning] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Load active rental
  useEffect(() => {
    const loadActiveRental = async () => {
      try {
        setLoading(true)
        const data = await rentalService.getActiveRental()
        setRental(data)
      } catch (error) {
        console.error('Error loading active rental:', error)
        toast.error('Error al cargar alquiler activo')
      } finally {
        setLoading(false)
      }
    }

    loadActiveRental()
  }, [])

  const calculateDuration = (): string => {
    if (!rental) return '0h 0m'

    const start = new Date(rental.startDate)
    const diffMs = currentTime.getTime() - start.getTime()
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const calculateEstimatedCost = () => {
    if (!rental || typeof rental.bicycleId !== 'object' || !rental.bicycleId) {
      return { subtotal: 0, discount: 0, total: 0 }
    }

    const hours = calculateHoursBetweenDates(rental.startDate, currentTime.toISOString())
    const roundedHours = Math.ceil(hours) // Round up to the nearest hour
    return calculateRentalCost(
      rental.bicycleId.rentalPricePerHour,
      roundedHours,
      user?.socioeconomicStratum
    )
  }

  const handleReturnBicycle = async () => {
    if (!rental) return

    try {
      setReturning(true)
      await rentalService.returnBicycle(rental._id)
      toast.success('Bicicleta devuelta exitosamente')
      setShowReturnModal(false)
      // Navigate to rental history
      navigate(ROUTES.RENTAL_HISTORY)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al devolver bicicleta')
    } finally {
      setReturning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!rental) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <Bike className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No tienes alquiler activo
            </h2>
            <p className="text-gray-600 mb-6">
              Explora nuestro catálogo de bicicletas y comienza tu próxima aventura
            </p>
            <Button onClick={() => navigate(ROUTES.BICYCLES)}>
              Ver Bicicletas Disponibles
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const bicycle = typeof rental.bicycleId === 'object' ? rental.bicycleId : null
  const estimatedCost = calculateEstimatedCost()
  const duration = calculateDuration()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Alquiler Activo</h1>
        <p className="text-gray-600 mt-2">Gestiona tu alquiler de bicicleta</p>
      </div>

      {/* Active Rental Alert */}
      <div className="mb-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">Alquiler en curso</p>
                <p className="text-sm text-gray-600">
                  No olvides devolver la bicicleta cuando termines
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bicycle Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bike className="w-6 h-6 text-sena-orange" />
            Información de la Bicicleta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bicycle Image Placeholder */}
            <div className="h-64 bg-gradient-to-br from-sena-orange to-orange-400 flex items-center justify-center rounded-lg">
              <Bike className="w-32 h-32 text-white opacity-50" />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {bicycle?.brand} {bicycle?.model}
                </h3>
                <p className="text-gray-600">Código: {bicycle?.code}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Ubicación actual
                    </p>
                    <p className="text-gray-600">
                      {bicycle?.currentLocation?.address || 'No disponible'}
                    </p>
                  </div>
                </div>

                {bicycle?.currentLocation?.coordinates && (
                  <p className="text-sm text-gray-500 ml-7">
                    Lat: {bicycle.currentLocation.coordinates[1]}, Lng:{' '}
                    {bicycle.currentLocation.coordinates[0]}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tarifa por hora:</span>
                  <span className="text-xl font-bold text-sena-orange">
                    {formatCurrency(bicycle?.rentalPricePerHour || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rental Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-sena-green" />
            Detalles del Alquiler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de inicio
              </label>
              <div className="flex items-center gap-2 text-gray-900">
                <Calendar className="w-4 h-4 text-gray-400" />
                {formatDate(rental.startDate)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración actual
              </label>
              <div className="flex items-center gap-2 text-gray-900">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="font-bold text-sena-orange">{duration}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <Badge className="badge-success">Activo</Badge>
            </div>

            {user?.socioeconomicStratum && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estrato socioeconómico
                </label>
                <div className="text-gray-900">
                  Estrato {user.socioeconomicStratum} (
                  {estimatedCost.discount > 0
                    ? `${((estimatedCost.discount / estimatedCost.subtotal) * 100).toFixed(0)}% descuento`
                    : 'Sin descuento'}
                  )
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cost Estimation */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            Costo Estimado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-900">
                Este es un costo estimado basado en el tiempo transcurrido. El costo final se
                calculará al momento de la devolución.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-medium">{formatCurrency(estimatedCost.subtotal)}</span>
            </div>

            {estimatedCost.discount > 0 && (
              <div className="flex items-center justify-between text-green-600">
                <span>Descuento:</span>
                <span className="font-medium">-{formatCurrency(estimatedCost.discount)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total estimado:</span>
                <span className="text-2xl font-bold text-sena-orange">
                  {formatCurrency(estimatedCost.total)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return Button */}
      <div className="flex justify-end">
        <Button
          variant="danger"
          size="lg"
          onClick={() => setShowReturnModal(true)}
          className="flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Devolver Bicicleta
        </Button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onConfirm={handleReturnBicycle}
        title="Confirmar Devolución"
        message={`¿Estás seguro que deseas devolver la bicicleta ${bicycle?.brand} ${bicycle?.model}? El costo estimado es de ${formatCurrency(estimatedCost.total)}.`}
        confirmText="Devolver Bicicleta"
        isLoading={returning}
      />
    </div>
  )
}

export default MyRentalPage