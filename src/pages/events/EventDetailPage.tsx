import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Info,
  AlertCircle,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Spinner } from '../../components/common/Spinner'
import { ConfirmModal } from '../../components/common/Modal'
import { eventService } from '../../api'
import { Event } from '../../types'
import { formatDate, formatTime } from '../../utils/format'
import { getEventStatusBadge } from '../../utils/helpers'
import { ROUTES } from '../../constants'
import toast from 'react-hot-toast'

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadEvent()
    loadMyEvents()
  }, [id])

  const loadEvent = async () => {
    if (!id) return

    try {
      setLoading(true)
      const data = await eventService.getById(id)
      setEvent(data)
    } catch (error) {
      console.error('Error loading event:', error)
      toast.error('Error al cargar el evento')
      navigate(ROUTES.EVENTS)
    } finally {
      setLoading(false)
    }
  }

  const loadMyEvents = async () => {
    try {
      const data = await eventService.getMyEvents()
      setMyEvents(data)
    } catch (error) {
      console.error('Error loading my events:', error)
    }
  }

  const isRegistered = event ? myEvents.some((e) => e._id === event._id) : false
  const isFull = event?.maxParticipants
    ? event.currentParticipants >= event.maxParticipants
    : false
  const canRegister = event?.status === 'published' && !isFull && !isRegistered
  const isPastEvent = event ? new Date(event.eventDate) < new Date() : false

  const handleRegister = async () => {
    if (!event) return

    try {
      setActionLoading(true)
      await eventService.registerToEvent(event._id, { eventId: event._id })
      toast.success('Registro exitoso al evento')
      setShowRegisterModal(false)
      await loadEvent()
      await loadMyEvents()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrarse')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancelRegistration = async () => {
    if (!event) return

    try {
      setActionLoading(true)
      await eventService.cancelRegistration(event._id)
      toast.success('Registro cancelado exitosamente')
      setShowCancelModal(false)
      await loadEvent()
      await loadMyEvents()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cancelar')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Evento no encontrado</h2>
            <p className="text-gray-600 mb-6">El evento que buscas no existe</p>
            <Link to={ROUTES.EVENTS}>
              <Button>Volver a Eventos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link to={ROUTES.EVENTS}>
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver a Eventos
          </Button>
        </Link>
      </div>

      {/* Event Header */}
      <Card className="mb-6">
        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{event.name}</h1>
              {event.eventType && (
                <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                  {event.eventType}
                </span>
              )}
            </div>
            <Badge className={getEventStatusBadge(event.status).className}>
              {getEventStatusBadge(event.status).text}
            </Badge>
          </div>

          {event.description && (
            <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Event Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sena-orange" />
              Fecha y Hora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-semibold text-gray-900">{formatDate(event.eventDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Horario</p>
                <p className="font-semibold text-gray-900">
                  {event.startTime}
                  {event.endTime && ` - ${event.endTime}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sena-orange" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            {event.meetingPoint ? (
              <p className="text-gray-900">{event.meetingPoint}</p>
            ) : (
              <p className="text-gray-500">No especificado</p>
            )}
          </CardContent>
        </Card>

        {/* Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-sena-orange" />
              Participantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {event.currentParticipants}
              {event.maxParticipants && ` / ${event.maxParticipants}`}
            </p>
            {isFull && (
              <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                Evento Lleno
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Route Description */}
      {event.routeDescription && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-sena-orange" />
              Descripción de la Ruta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-line">{event.routeDescription}</p>
          </CardContent>
        </Card>
      )}

      {/* Registration Status */}
      {isRegistered && (
        <Card className="mb-6 bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Ya estás registrado</p>
                <p className="text-sm text-gray-600">
                  Estás inscrito en este evento. ¡Te esperamos!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {!isPastEvent && (
        <div className="flex items-center gap-4">
          {isRegistered ? (
            <Button
              variant="danger"
              size="lg"
              fullWidth
              onClick={() => setShowCancelModal(true)}
            >
              Cancelar Registro
            </Button>
          ) : canRegister ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setShowRegisterModal(true)}
            >
              Registrarse al Evento
            </Button>
          ) : (
            <Button variant="secondary" size="lg" fullWidth disabled>
              {isFull ? 'Evento Lleno' : 'No Disponible'}
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <ConfirmModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onConfirm={handleRegister}
        title="Confirmar Registro"
        message={`¿Estás seguro que deseas registrarte al evento "${event.name}"?`}
        confirmText="Confirmar Registro"
        isLoading={actionLoading}
      />

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelRegistration}
        title="Cancelar Registro"
        message={`¿Estás seguro que deseas cancelar tu registro al evento "${event.name}"?`}
        confirmText="Confirmar Cancelación"
        isLoading={actionLoading}
      />
    </div>
  )
}

export default EventDetailPage