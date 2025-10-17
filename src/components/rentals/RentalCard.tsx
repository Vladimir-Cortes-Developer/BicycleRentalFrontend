import { Bike, Clock, Calendar, DollarSign, MapPin } from 'lucide-react'
import { Card, CardContent } from '../common/Card'
import { Badge } from '../common/Badge'
import { Rental, Bicycle, User } from '../../types'
import { formatDate, formatDateTime, formatCurrency, formatDuration } from '../../utils/format'
import { getRentalStatusBadge } from '../../utils/helpers'

interface RentalCardProps {
  rental: Rental
  onClick?: () => void
}

export const RentalCard = ({ rental, onClick }: RentalCardProps) => {
  const bicycle = typeof rental.bicycleId === 'object' ? rental.bicycleId : null
  const user = typeof rental.userId === 'object' ? rental.userId : null

  const duration = rental.durationInHours || 0
  const cost = rental.totalCost || rental.finalCost || rental.estimatedCost

  return (
    <Card
      className={`hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            {/* Bicycle Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-sena-orange to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bike className="w-6 h-6 text-white" />
            </div>

            {/* Bicycle Info */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                {bicycle?.brand} {bicycle?.model}
              </h3>
              <p className="text-sm text-gray-600">Código: {bicycle?.code}</p>
              {user && (
                <p className="text-sm text-gray-600">
                  Usuario: {user.firstName} {user.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <Badge className={getRentalStatusBadge(rental.status).className}>
            {getRentalStatusBadge(rental.status).text}
          </Badge>
        </div>

        {/* Rental Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Inicio</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDateTime(rental.startDate)}
              </p>
            </div>
          </div>

          {rental.endDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Fin</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDateTime(rental.endDate)}
                </p>
              </div>
            </div>
          )}

          {duration > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Duración</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDuration(duration)}
                </p>
              </div>
            </div>
          )}

          {cost !== undefined && cost > 0 && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Costo</p>
                <p className="text-sm font-bold text-sena-orange">
                  {formatCurrency(cost)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Location (if available) */}
        {bicycle?.currentLocation && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Ubicación</p>
                <p className="text-sm text-gray-900">
                  {bicycle.currentLocation.coordinates
                    ? `Lat: ${bicycle.currentLocation.coordinates[1]}, Lng: ${bicycle.currentLocation.coordinates[0]}`
                    : 'No disponible'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Discount Info */}
        {rental.discount && rental.discount > 0 && (
          <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-800">
              Descuento aplicado: {formatCurrency(rental.discount)}
              {rental.discountPercentage && ` (${rental.discountPercentage}%)`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}