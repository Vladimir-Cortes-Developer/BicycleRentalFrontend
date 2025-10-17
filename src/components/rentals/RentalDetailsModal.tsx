import { X, Bike, User, Calendar, Clock, MapPin, DollarSign, Info } from 'lucide-react'
import { Modal } from '../common/Modal'
import { Badge } from '../common/Badge'
import { Rental, Bicycle, User as UserType } from '../../types'
import { formatDateTime, formatCurrency, formatDuration } from '../../utils/format'
import { getRentalStatusBadge } from '../../utils/helpers'

interface RentalDetailsModalProps {
  rental: Rental | null
  isOpen: boolean
  onClose: () => void
}

export const RentalDetailsModal = ({ rental, isOpen, onClose }: RentalDetailsModalProps) => {
  if (!rental) return null

  const bicycle = typeof rental.bicycleId === 'object' ? rental.bicycleId : null
  const user = typeof rental.userId === 'object' ? rental.userId : null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sena-orange to-orange-400 rounded-lg flex items-center justify-center">
              <Bike className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Detalles del Alquiler</h2>
              <p className="text-sm text-gray-500">ID: {rental._id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Estado:</span>
            <Badge className={getRentalStatusBadge(rental.status).className}>
              {getRentalStatusBadge(rental.status).text}
            </Badge>
          </div>

          {/* Bicycle Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bike className="w-5 h-5 text-sena-orange" />
              <h3 className="font-semibold text-gray-900">Información de la Bicicleta</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Marca</p>
                <p className="font-medium text-gray-900">{bicycle?.brand || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Modelo</p>
                <p className="font-medium text-gray-900">{bicycle?.model || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Código</p>
                <p className="font-medium text-gray-900">{bicycle?.code || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Color</p>
                <p className="font-medium text-gray-900">{bicycle?.color || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tarifa por hora</p>
                <p className="font-medium text-sena-orange">
                  {bicycle?.rentalPricePerHour
                    ? formatCurrency(bicycle.rentalPricePerHour)
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* User Information */}
          {user && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Información del Usuario</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Nombre</p>
                  <p className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Documento</p>
                  <p className="font-medium text-gray-900">
                    {user.documentType} {user.documentNumber}
                  </p>
                </div>
                {user.socioeconomicStratum && (
                  <div>
                    <p className="text-xs text-gray-500">Estrato</p>
                    <p className="font-medium text-gray-900">Estrato {user.socioeconomicStratum}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rental Timeline */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Línea de Tiempo</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fecha de Inicio</p>
                  <p className="font-medium text-gray-900">{formatDateTime(rental.startDate)}</p>
                </div>
              </div>

              {rental.endDate && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fecha de Fin</p>
                    <p className="font-medium text-gray-900">{formatDateTime(rental.endDate)}</p>
                  </div>
                </div>
              )}

              {rental.durationInHours && rental.durationInHours > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duración</p>
                    <p className="font-medium text-gray-900">
                      {formatDuration(rental.durationInHours)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location Information */}
          {(rental.startLocation || rental.endLocation) && (
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Ubicaciones</h3>
              </div>
              <div className="space-y-3">
                {rental.startLocation && (
                  <div>
                    <p className="text-xs text-gray-500">Ubicación de Inicio</p>
                    <p className="font-medium text-gray-900">
                      Lat: {rental.startLocation.coordinates[1]}, Lng:{' '}
                      {rental.startLocation.coordinates[0]}
                    </p>
                  </div>
                )}
                {rental.endLocation && (
                  <div>
                    <p className="text-xs text-gray-500">Ubicación de Fin</p>
                    <p className="font-medium text-gray-900">
                      Lat: {rental.endLocation.coordinates[1]}, Lng:{' '}
                      {rental.endLocation.coordinates[0]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cost Information */}
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-sena-orange" />
              <h3 className="font-semibold text-gray-900">Costos</h3>
            </div>
            <div className="space-y-2">
              {rental.estimatedCost && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Costo Estimado:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(rental.estimatedCost)}
                  </span>
                </div>
              )}

              {rental.discount && rental.discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Descuento {rental.discountPercentage ? `(${rental.discountPercentage}%)` : ''}:
                  </span>
                  <span className="font-medium text-green-600">
                    -{formatCurrency(rental.discount)}
                  </span>
                </div>
              )}

              {rental.finalCost && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Costo Final:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(rental.finalCost)}
                  </span>
                </div>
              )}

              {rental.totalCost && (
                <div className="flex items-center justify-between pt-2 border-t border-orange-200">
                  <span className="text-base font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-sena-orange">
                    {formatCurrency(rental.totalCost)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Información Adicional</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">Creado el</p>
                <p className="font-medium text-gray-900">{formatDateTime(rental.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Última actualización</p>
                <p className="font-medium text-gray-900">{formatDateTime(rental.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  )
}