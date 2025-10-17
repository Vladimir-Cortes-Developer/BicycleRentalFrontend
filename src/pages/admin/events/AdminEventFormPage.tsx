import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Calendar, ArrowLeft, Save } from 'lucide-react'
import { Card, CardContent } from '../../../components/common/Card'
import { Button } from '../../../components/common/Button'
import { Input } from '../../../components/common/Input'
import { Spinner } from '../../../components/common/Spinner'
import { eventService, regionalService } from '../../../api'
import { CreateEventDto, UpdateEventDto, EventStatus, Regional } from '../../../types'
import { ROUTES } from '../../../constants'
import toast from 'react-hot-toast'

const AdminEventFormPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [regionals, setRegionals] = useState<Regional[]>([])
  const [loadingRegionals, setLoadingRegionals] = useState(true)

  const [formData, setFormData] = useState<CreateEventDto>({
    name: '',
    description: '',
    eventType: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    routeDescription: '',
    meetingPoint: '',
    maxParticipants: undefined,
    regionalId: '',
    status: 'draft',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load regionals
  useEffect(() => {
    loadRegionals()
  }, [])

  // Load event data if editing
  useEffect(() => {
    if (isEditMode && id) {
      loadEvent(id)
    }
  }, [id, isEditMode])

  const loadRegionals = async () => {
    try {
      setLoadingRegionals(true)
      const data = await regionalService.getActive()
      setRegionals(data)

      // Set first regional as default if creating new event
      if (!isEditMode && data.length > 0) {
        setFormData((prev) => ({ ...prev, regionalId: data[0]._id }))
      }
    } catch (error) {
      console.error('Error loading regionals:', error)
      toast.error('Error al cargar regionales')
    } finally {
      setLoadingRegionals(false)
    }
  }

  const loadEvent = async (eventId: string) => {
    try {
      setLoading(true)
      const event = await eventService.getById(eventId)

      setFormData({
        name: event.name,
        description: event.description || '',
        eventType: event.eventType || '',
        eventDate: event.eventDate ? event.eventDate.split('T')[0] : '',
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        routeDescription: event.routeDescription || '',
        meetingPoint: event.meetingPoint || '',
        maxParticipants: event.maxParticipants,
        regionalId: typeof event.regionalId === 'string' ? event.regionalId : event.regionalId._id,
        status: event.status,
      })
    } catch (error) {
      console.error('Error loading event:', error)
      toast.error('Error al cargar evento')
      navigate(ROUTES.ADMIN_EVENTS)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    // Convert maxParticipants to number
    if (name === 'maxParticipants') {
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

    // Required fields
    if (!formData.name) newErrors.name = 'Nombre es requerido'
    if (!formData.eventDate) newErrors.eventDate = 'Fecha es requerida'
    if (!formData.startTime) newErrors.startTime = 'Hora de inicio es requerida'
    if (!formData.regionalId) newErrors.regionalId = 'Regional es requerida'

    // Validate max participants
    if (formData.maxParticipants !== undefined && formData.maxParticipants <= 0) {
      newErrors.maxParticipants = 'El número máximo de participantes debe ser mayor a 0'
    }

    // Validate date is not in the past
    if (formData.eventDate) {
      const eventDate = new Date(formData.eventDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (eventDate < today) {
        newErrors.eventDate = 'La fecha del evento no puede ser en el pasado'
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
      setSaving(true)

      // Prepare data
      const dataToSend: CreateEventDto | UpdateEventDto = {
        ...formData,
        description: formData.description || undefined,
        eventType: formData.eventType || undefined,
        endTime: formData.endTime || undefined,
        routeDescription: formData.routeDescription || undefined,
        meetingPoint: formData.meetingPoint || undefined,
        maxParticipants: formData.maxParticipants || undefined,
      }

      if (isEditMode && id) {
        await eventService.update(id, dataToSend as UpdateEventDto)
        toast.success('Evento actualizado exitosamente')
      } else {
        await eventService.create(dataToSend as CreateEventDto)
        toast.success('Evento creado exitosamente')
      }

      navigate(ROUTES.ADMIN_EVENTS)
    } catch (error: any) {
      console.error('Error saving event:', error)
      toast.error(error.response?.data?.message || 'Error al guardar evento')
    } finally {
      setSaving(false)
    }
  }

  if (loading || loadingRegionals) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(ROUTES.ADMIN_EVENTS)}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la lista
        </Button>

        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-sena-orange" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Editar Evento' : 'Nuevo Evento'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode
                ? 'Actualiza la información del evento'
                : 'Crea un nuevo evento de ciclismo'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>
              <div className="space-y-4">
                <div>
                  <Input
                    type="text"
                    name="name"
                    label="Nombre del Evento *"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ciclopaseo SENA 2024"
                    required
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe el evento..."
                    className="input-field w-full min-h-[100px]"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <Input
                    type="text"
                    name="eventType"
                    label="Tipo de Evento"
                    value={formData.eventType}
                    onChange={handleChange}
                    placeholder="Ciclopaseo, Carrera, Tour, etc."
                  />
                  {errors.eventType && (
                    <p className="text-sm text-red-600 mt-1">{errors.eventType}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Fecha y Hora</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    type="date"
                    name="eventDate"
                    label="Fecha del Evento *"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                  />
                  {errors.eventDate && (
                    <p className="text-sm text-red-600 mt-1">{errors.eventDate}</p>
                  )}
                </div>

                <div>
                  <Input
                    type="time"
                    name="startTime"
                    label="Hora de Inicio *"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                  {errors.startTime && (
                    <p className="text-sm text-red-600 mt-1">{errors.startTime}</p>
                  )}
                </div>

                <div>
                  <Input
                    type="time"
                    name="endTime"
                    label="Hora de Fin"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                  {errors.endTime && (
                    <p className="text-sm text-red-600 mt-1">{errors.endTime}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h2>
              <div className="space-y-4">
                <div>
                  <Input
                    type="text"
                    name="meetingPoint"
                    label="Punto de Encuentro"
                    value={formData.meetingPoint}
                    onChange={handleChange}
                    placeholder="Parque Simón Bolívar, Entrada Principal"
                  />
                  {errors.meetingPoint && (
                    <p className="text-sm text-red-600 mt-1">{errors.meetingPoint}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Regional SENA *
                  </label>
                  <select
                    name="regionalId"
                    value={formData.regionalId}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                    disabled={regionals.length === 0}
                  >
                    {regionals.length === 0 ? (
                      <option>No hay regionales disponibles</option>
                    ) : (
                      regionals.map((regional) => (
                        <option key={regional._id} value={regional._id}>
                          {regional.name} - {regional.city}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.regionalId && (
                    <p className="text-sm text-red-600 mt-1">{errors.regionalId}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Route Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de la Ruta</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción de la Ruta
                </label>
                <textarea
                  name="routeDescription"
                  value={formData.routeDescription}
                  onChange={handleChange}
                  placeholder="Describe la ruta que se recorrerá..."
                  className="input-field w-full min-h-[120px]"
                  rows={5}
                />
                {errors.routeDescription && (
                  <p className="text-sm text-red-600 mt-1">{errors.routeDescription}</p>
                )}
              </div>
            </div>

            {/* Participants and Status */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Participantes y Estado
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="number"
                    name="maxParticipants"
                    label="Máximo de Participantes"
                    value={formData.maxParticipants || ''}
                    onChange={handleChange}
                    placeholder="50"
                    min="1"
                  />
                  {errors.maxParticipants && (
                    <p className="text-sm text-red-600 mt-1">{errors.maxParticipants}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Deja vacío para no limitar participantes
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                  {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => navigate(ROUTES.ADMIN_EVENTS)}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={saving} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isEditMode ? 'Actualizar' : 'Crear'} Evento
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminEventFormPage