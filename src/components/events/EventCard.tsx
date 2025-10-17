import { Calendar, Clock, MapPin, Users, Info } from 'lucide-react'
import { Card, CardContent } from '../common/Card'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { Event } from '../../types'
import { formatDate, formatTime } from '../../utils/format'
import { getEventStatusBadge } from '../../utils/helpers'

interface EventCardProps {
  event: Event
  onViewDetails?: (event: Event) => void
  onRegister?: (event: Event) => void
  onCancel?: (event: Event) => void
  isRegistered?: boolean
  showActions?: boolean
}

export const EventCard = ({
  event,
  onViewDetails,
  onRegister,
  onCancel,
  isRegistered = false,
  showActions = true,
}: EventCardProps) => {
  const isFull = event.maxParticipants ? event.currentParticipants >= event.maxParticipants : false
  const canRegister = event.status === 'published' && !isFull && !isRegistered
  const isPastEvent = new Date(event.eventDate) < new Date()

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
            {event.eventType && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                {event.eventType}
              </span>
            )}
          </div>
          <Badge className={getEventStatusBadge(event.status).className}>
            {getEventStatusBadge(event.status).text}
          </Badge>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        )}

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">{formatDate(event.eventDate)}</span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">
              {event.startTime}
              {event.endTime && ` - ${event.endTime}`}
            </span>
          </div>

          {/* Meeting Point */}
          {event.meetingPoint && (
            <div className="flex items-center gap-2 text-sm col-span-full">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{event.meetingPoint}</span>
            </div>
          )}

          {/* Participants */}
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">
              {event.currentParticipants}
              {event.maxParticipants ? ` / ${event.maxParticipants}` : ''} participantes
            </span>
            {isFull && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                Lleno
              </span>
            )}
          </div>
        </div>

        {/* Route Description */}
        {event.routeDescription && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-blue-600 font-medium mb-1">Ruta:</p>
                <p className="text-sm text-blue-900 line-clamp-2">{event.routeDescription}</p>
              </div>
            </div>
          </div>
        )}

        {/* Registration Status */}
        {isRegistered && (
          <div className="mb-4 p-2 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 font-medium text-center">
              ✓ Ya estás registrado en este evento
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails?.(event)}
              className="flex-1"
            >
              Ver Detalles
            </Button>

            {!isPastEvent && (
              <>
                {isRegistered ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onCancel?.(event)}
                    className="flex-1"
                  >
                    Cancelar Registro
                  </Button>
                ) : canRegister ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onRegister?.(event)}
                    className="flex-1"
                  >
                    Registrarse
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" disabled className="flex-1">
                    {isFull ? 'Evento Lleno' : 'No Disponible'}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}