import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Plus, Edit, Trash2, Search, Eye, Users } from 'lucide-react'
import { Card, CardContent } from '../../../components/common/Card'
import { Button } from '../../../components/common/Button'
import { Badge } from '../../../components/common/Badge'
import { Input } from '../../../components/common/Input'
import { Spinner } from '../../../components/common/Spinner'
import { ConfirmModal } from '../../../components/common/Modal'
import { eventService } from '../../../api'
import { Event, EventStatus } from '../../../types'
import { formatDate } from '../../../utils/format'
import { getEventStatusBadge } from '../../../utils/helpers'
import { ROUTES } from '../../../constants'
import toast from 'react-hot-toast'

const AdminEventsPage = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Load events
  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await eventService.getAll()
      setEvents(data)
      setFilteredEvents(data)
    } catch (error) {
      console.error('Error loading events:', error)
      toast.error('Error al cargar eventos')
    } finally {
      setLoading(false)
    }
  }

  // Apply filters
  useEffect(() => {
    let filtered = [...events]

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.name?.toLowerCase().includes(lowerSearch) ||
          event.description?.toLowerCase().includes(lowerSearch) ||
          event.eventType?.toLowerCase().includes(lowerSearch) ||
          event.meetingPoint?.toLowerCase().includes(lowerSearch)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((event) => event.status === statusFilter)
    }

    setFilteredEvents(filtered)
  }, [searchTerm, statusFilter, events])

  const handleDelete = (event: Event) => {
    setEventToDelete(event)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!eventToDelete) return

    try {
      setIsDeleting(true)
      await eventService.delete(eventToDelete._id)
      toast.success('Evento eliminado exitosamente')
      setDeleteModalOpen(false)
      setEventToDelete(null)
      await loadEvents()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar evento')
    } finally {
      setIsDeleting(false)
    }
  }

  const stats = {
    total: events.length,
    published: events.filter((e) => e.status === 'published').length,
    draft: events.filter((e) => e.status === 'draft').length,
    completed: events.filter((e) => e.status === 'completed').length,
  }

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
              Gestión de Eventos
            </h1>
            <p className="text-gray-600 mt-2">
              Administra todos los eventos del sistema
            </p>
          </div>
          <Button
            onClick={() => navigate(ROUTES.ADMIN_EVENTS_CREATE)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Evento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Publicados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Borradores</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 flex-wrap">
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

      {/* Events Table */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {events.length === 0 ? 'No hay eventos registrados' : 'No se encontraron resultados'}
            </h2>
            <p className="text-gray-600 mb-6">
              {events.length === 0
                ? 'Comienza creando tu primer evento'
                : 'Intenta ajustar los filtros de búsqueda'}
            </p>
            {events.length === 0 && (
              <Button onClick={() => navigate(ROUTES.ADMIN_EVENTS_CREATE)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Evento
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{event.name}</p>
                        {event.eventType && (
                          <p className="text-sm text-gray-500">{event.eventType}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-900">{formatDate(event.eventDate)}</p>
                        <p className="text-sm text-gray-500">
                          {event.startTime}
                          {event.endTime && ` - ${event.endTime}`}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {event.meetingPoint || 'No especificado'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Users className="w-4 h-4 text-gray-400" />
                        {event.currentParticipants}
                        {event.maxParticipants && ` / ${event.maxParticipants}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getEventStatusBadge(event.status).className}>
                        {getEventStatusBadge(event.status).text}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`${ROUTES.EVENTS}/${event._id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(ROUTES.ADMIN_EVENTS_EDIT.replace(':id', event._id))
                          }
                          className="text-sena-orange hover:text-orange-700"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setEventToDelete(null)
        }}
        onConfirm={confirmDelete}
        title="Eliminar Evento"
        message={`¿Estás seguro que deseas eliminar el evento "${eventToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  )
}

export default AdminEventsPage