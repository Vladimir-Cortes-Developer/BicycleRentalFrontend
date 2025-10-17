import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Spinner } from '../../components/common/Spinner'
import { ConfirmModal } from '../../components/common/Modal'
import { EventCard } from '../../components/events'
import { eventService } from '../../api'
import { Event } from '../../types'
import { ROUTES } from '../../constants'
import toast from 'react-hot-toast'

const MyEventsPage = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadMyEvents()
  }, [])

  const loadMyEvents = async () => {
    try {
      setLoading(true)
      const data = await eventService.getMyEvents()
      setEvents(data)
    } catch (error) {
      console.error('Error loading my events:', error)
      toast.error('Error al cargar tus eventos')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (event: Event) => {
    navigate(ROUTES.EVENT_DETAIL.replace(':id', event._id))
  }

  const handleCancelRegistration = (event: Event) => {
    setSelectedEvent(event)
    setShowCancelModal(true)
  }

  const confirmCancel = async () => {
    if (!selectedEvent) return

    try {
      setActionLoading(true)
      await eventService.cancelRegistration(selectedEvent._id)
      toast.success('Registro cancelado exitosamente')
      setShowCancelModal(false)
      setSelectedEvent(null)
      await loadMyEvents()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cancelar registro')
    } finally {
      setActionLoading(false)
    }
  }

  // Separate upcoming and past events
  const upcomingEvents = events.filter((event) => new Date(event.eventDate) >= new Date())
  const pastEvents = events.filter((event) => new Date(event.eventDate) < new Date())

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-sena-orange" />
              Mis Eventos
            </h1>
            <p className="text-gray-600 mt-2">Eventos en los que estás registrado</p>
          </div>
          <Button
            onClick={() => navigate(ROUTES.EVENTS)}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver Todos los Eventos
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No tienes eventos registrados
            </h2>
            <p className="text-gray-600 mb-6">
              Explora los eventos disponibles y regístrate en los que te interesen
            </p>
            <Button onClick={() => navigate(ROUTES.EVENTS)}>Ver Eventos Disponibles</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Próximos Eventos ({upcomingEvents.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onViewDetails={handleViewDetails}
                    onCancel={handleCancelRegistration}
                    isRegistered={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Eventos Pasados ({pastEvents.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onViewDetails={handleViewDetails}
                    isRegistered={true}
                    showActions={false}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Cancel Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false)
          setSelectedEvent(null)
        }}
        onConfirm={confirmCancel}
        title="Cancelar Registro"
        message={`¿Estás seguro que deseas cancelar tu registro al evento "${selectedEvent?.name}"?`}
        confirmText="Confirmar Cancelación"
        cancelText="Volver"
        isLoading={actionLoading}
      />
    </div>
  )
}

export default MyEventsPage