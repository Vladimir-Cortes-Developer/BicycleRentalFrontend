import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Bike, MapPin, DollarSign, Calendar, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Spinner } from '../../components/common/Spinner'
import { ConfirmModal } from '../../components/common/Modal'
import { bicycleService, rentalService } from '../../api'
import { Bicycle } from '../../types'
import { formatCurrency } from '../../utils/format'
import { getBicycleStatusBadge, calculateRentalCost, getDiscountByStratum } from '../../utils/helpers'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants'
import toast from 'react-hot-toast'

const BicycleDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bicycle, setBicycle] = useState<Bicycle | null>(null)
  const [loading, setLoading] = useState(true)
  const [renting, setRenting] = useState(false)
  const [showRentalModal, setShowRentalModal] = useState(false)
  const [hasActiveRental, setHasActiveRental] = useState(false)

  useEffect(() => {
    const loadBicycle = async () => {
      if (!id) return

      try {
        setLoading(true)
        const data = await bicycleService.getById(id)
        setBicycle(data)
      } catch (error) {
        console.error('Error loading bicycle:', error)
        toast.error('Error al cargar bicicleta')
        navigate(ROUTES.BICYCLES)
      } finally {
        setLoading(false)
      }
    }

    loadBicycle()
  }, [id, navigate])

  // Check if user has active rental
  useEffect(() => {
    const checkActiveRental = async () => {
      try {
        const activeRental = await rentalService.getActiveRental()
        setHasActiveRental(!!activeRental)
      } catch (error) {
        console.error('Error checking active rental:', error)
      }
    }

    checkActiveRental()
  }, [])

  const handleRentBicycle = async () => {
    if (!bicycle || !id) return

    try {
      setRenting(true)
      await rentalService.rentBicycle({ bicycleId: id })
      toast.success('¡Bicicleta alquilada exitosamente!')
      setShowRentalModal(false)
      // Navigate to my rental page
      navigate(ROUTES.MY_RENTAL)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al alquilar bicicleta')
    } finally {
      setRenting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!bicycle) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <Bike className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bicicleta no encontrada</h2>
            <p className="text-gray-600 mb-6">La bicicleta que buscas no existe</p>
            <Link to={ROUTES.BICYCLES}>
              <Button>Volver al Catálogo</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isAvailable = bicycle.status === 'available'
  const discount = user?.socioeconomicStratum ? getDiscountByStratum(user.socioeconomicStratum) : 0
  const estimatedCost1Hour = calculateRentalCost(bicycle.rentalPricePerHour, 1, user?.socioeconomicStratum)
  const estimatedCost3Hours = calculateRentalCost(bicycle.rentalPricePerHour, 3, user?.socioeconomicStratum)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link to={ROUTES.BICYCLES}>
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver al Catálogo
          </Button>
        </Link>
      </div>

      {/* Bicycle Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Image */}
        <div>
          <Card>
            <CardContent className="p-0">
              <div className="h-96 bg-gradient-to-br from-sena-orange to-orange-400 flex items-center justify-center rounded-lg relative">
                <Bike className="w-40 h-40 text-white opacity-50" />

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className={getBicycleStatusBadge(bicycle.status).className}>
                    {getBicycleStatusBadge(bicycle.status).text}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {bicycle.brand} {bicycle.model}
            </h1>
            <p className="text-lg text-gray-600">Código: {bicycle.code}</p>
          </div>

          {/* Price */}
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tarifa por hora</p>
                  <p className="text-3xl font-bold text-sena-orange">
                    {formatCurrency(bicycle.rentalPricePerHour)}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <DollarSign className="w-8 h-8 text-sena-orange" />
                </div>
              </div>

              {discount > 0 && (
                <div className="mt-4 pt-4 border-t border-orange-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      Tienes {discount}% de descuento (Estrato {user?.socioeconomicStratum})
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Rental Warning */}
          {hasActiveRental && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Ya tienes un alquiler activo</p>
                    <p className="text-sm text-gray-600">
                      Debes devolver tu bicicleta actual antes de alquilar otra.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rental Button */}
          <Button
            size="lg"
            fullWidth
            onClick={() => setShowRentalModal(true)}
            disabled={!isAvailable || hasActiveRental}
            className="flex items-center justify-center gap-2"
          >
            {hasActiveRental ? (
              'Ya tienes un alquiler activo'
            ) : isAvailable ? (
              <>
                <Bike className="w-5 h-5" />
                Alquilar Bicicleta
              </>
            ) : (
              'No Disponible'
            )}
          </Button>

          {!isAvailable && !hasActiveRental && (
            <p className="text-sm text-gray-600 text-center">
              Esta bicicleta no está disponible en este momento
            </p>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sena-orange" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-900 mb-2">
              {bicycle.currentLocation?.address || 'Ubicación no disponible'}
            </p>
            {bicycle.currentLocation?.coordinates && (
              <p className="text-sm text-gray-600">
                Coordenadas: {bicycle.currentLocation.coordinates[1]},{' '}
                {bicycle.currentLocation.coordinates[0]}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sena-orange" />
              Información Adicional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Estado:</span>
                <Badge className={getBicycleStatusBadge(bicycle.status).className}>
                  {getBicycleStatusBadge(bicycle.status).text}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Marca:</span>
                <span className="font-medium text-gray-900">{bicycle.brand}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Modelo:</span>
                <span className="font-medium text-gray-900">{bicycle.model}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Código:</span>
                <span className="font-medium text-gray-900">{bicycle.code}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Estimation */}
      {isAvailable && (
        <Card>
          <CardHeader>
            <CardTitle>Estimación de Costos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">1 hora de alquiler</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{formatCurrency(estimatedCost1Hour.subtotal)}</span>
                  </div>
                  {estimatedCost1Hour.discount > 0 && (
                    <div className="flex items-center justify-between text-sm text-green-600">
                      <span>Descuento:</span>
                      <span>-{formatCurrency(estimatedCost1Hour.discount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-sena-orange">
                      {formatCurrency(estimatedCost1Hour.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">3 horas de alquiler</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{formatCurrency(estimatedCost3Hours.subtotal)}</span>
                  </div>
                  {estimatedCost3Hours.discount > 0 && (
                    <div className="flex items-center justify-between text-sm text-green-600">
                      <span>Descuento:</span>
                      <span>-{formatCurrency(estimatedCost3Hours.discount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-sena-orange">
                      {formatCurrency(estimatedCost3Hours.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900">
                  El costo final se calculará en base al tiempo real de uso. Los descuentos por estrato
                  socioeconómico se aplicarán automáticamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showRentalModal}
        onClose={() => setShowRentalModal(false)}
        onConfirm={handleRentBicycle}
        title="Confirmar Alquiler"
        message={`¿Estás seguro que deseas alquilar la bicicleta ${bicycle.brand} ${bicycle.model}? El costo por hora es de ${formatCurrency(bicycle.rentalPricePerHour)}${discount > 0 ? ` con ${discount}% de descuento` : ''}.`}
        confirmText="Confirmar Alquiler"
        isLoading={renting}
      />
    </div>
  )
}

export default BicycleDetailPage