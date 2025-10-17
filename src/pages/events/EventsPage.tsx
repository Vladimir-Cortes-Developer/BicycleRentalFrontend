import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Search, Filter } from 'lucide-react'
import { Card, CardContent } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
// import { Select } from '../../components/common/Select'
import { Spinner } from '../../components/common/Spinner'
import { ConfirmModal } from '../../components/common/Modal'
import { EventCard } from '../../components/events'
import { eventService } from '../../api'
import { Event, EventStatus } from '../../types'
import { ROUTES } from '../../constants'
import toast from 'react-hot-toast'

const EventsPage = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState<Event[]>([])
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all')
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadEvents()
    loadMyEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      console.log('Loading events, showUpcomingOnly:', showUpcomingOnly)
      const data = showUpcomingOnly
        ? await eventService.getUpcoming()
        : await eventService.getAll()
      console.log('Events loaded:', data)
      console.log('Number of events:', data?.length || 0)
      setEvents(data || [])
    } catch (error) {
      console.error('Error loading events:', error)
      toast.error('Error al cargar eventos')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const loadMyEvents = async () => {
    try {
      const data = await eventService.getMyEvents()
      console.log('My events loaded:', data?.length || 0)
      setMyEvents(data || [])
    } catch (error) {
      console.error('Error loading my events:', error)
      setMyEvents([])
    }
  }

  useEffect(() => {
    loadEvents()
  }, [showUpcomingOnly])

  const isRegistered = (eventId: string) => {
    return myEvents.some((e) => e._id === eventId)
  }

  const filteredEvents = events.filter((event) => {
    // Filter by status
    if (statusFilter !== 'all' && event.status !== statusFilter) return false

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        event.name.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.eventType?.toLowerCase().includes(searchLower) ||
        event.meetingPoint?.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  const handleViewDetails = (event: Event) => {
    navigate(ROUTES.EVENT_DETAIL.replace(':id', event._id))
  }

  const handleRegister = (event: Event) => {
    setSelectedEvent(event)
    setShowRegisterModal(true)
  }

  const handleCancelRegistration = (event: Event) => {
    setSelectedEvent(event)
    setShowCancelModal(true)
  }

  const confirmRegister = async () => {
    if (!selectedEvent) return

    try {
      setActionLoading(true)
      await eventService.registerToEvent(selectedEvent._id, { eventId: selectedEvent._id })
      toast.success('Registro exitoso al evento')
      setShowRegisterModal(false)
      setSelectedEvent(null)
      // Reload events to update participant count
      await loadEvents()
      await loadMyEvents()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrarse al evento')
    } finally {
      setActionLoading(false)
    }
  }

  const confirmCancel = async () => {
    if (!selectedEvent) return

    try {
      setActionLoading(true)
      await eventService.cancelRegistration(selectedEvent._id)
      toast.success('Registro cancelado exitosamente')
      setShowCancelModal(false)
      setSelectedEvent(null)
      // Reload events
      await loadEvents()
      await loadMyEvents()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cancelar registro')
    } finally {
      setActionLoading(false)
    }
  }

  console.log('EventsPage render - loading:', loading)
  console.log('EventsPage render - events:', events)
  console.log('EventsPage render - filteredEvents:', filteredEvents)

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
              Eventos
            </h1>
            <p className="text-gray-600 mt-2">
              Descubre y únete a eventos de ciclismo en tu región
            </p>
          </div>
          <Button
            onClick={() => navigate(ROUTES.MY_EVENTS)}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Mis Eventos
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>

            {/* Search */}
            <div className="flex-1 min-w-[250px] max-w-md">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EventStatus | 'all')}
              className="input-field min-w-[150px]"
            >
              <option value="all">Todos los estados</option>
              <option value="published">Publicado</option>
              <option value="draft">Borrador</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>

            {/* Upcoming Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUpcomingOnly}
                onChange={(e) => setShowUpcomingOnly(e.target.checked)}
                className="w-4 h-4 text-sena-orange border-gray-300 rounded focus:ring-sena-orange"
              />
              <span className="text-sm text-gray-700">Solo próximos</span>
            </label>

            {/* Clear Filters */}
            {(searchTerm || statusFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      {filteredEvents.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Mostrando {filteredEvents.length} de {events.length} eventos
          </p>
        </div>
      )}

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {events.length === 0
                ? (showUpcomingOnly ? 'No hay eventos próximos' : 'No hay eventos disponibles')
                : 'No se encontraron resultados'}
            </h2>
            <p className="text-gray-600 mb-6">
              {events.length === 0
                ? (showUpcomingOnly
                    ? 'No hay eventos programados para las próximas fechas. Prueba ver todos los eventos o vuelve más tarde.'
                    : 'Pronto habrá nuevos eventos de ciclismo')
                : 'Intenta ajustar los filtros de búsqueda'}
            </p>
            {events.length === 0 && showUpcomingOnly && (
              <Button
                onClick={() => setShowUpcomingOnly(false)}
                className="mx-auto"
              >
                Ver Todos los Eventos
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onViewDetails={handleViewDetails}
              onRegister={handleRegister}
              onCancel={handleCancelRegistration}
              isRegistered={isRegistered(event._id)}
            />
          ))}
        </div>
      )}

      {/* Register Modal */}
      <ConfirmModal
        isOpen={showRegisterModal}
        onClose={() => {
          setShowRegisterModal(false)
          setSelectedEvent(null)
        }}
        onConfirm={confirmRegister}
        title="Confirmar Registro"
        message={`¿Estás seguro que deseas registrarte al evento "${selectedEvent?.name}"?`}
        confirmText="Confirmar Registro"
        isLoading={actionLoading}
      />

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

export default EventsPage