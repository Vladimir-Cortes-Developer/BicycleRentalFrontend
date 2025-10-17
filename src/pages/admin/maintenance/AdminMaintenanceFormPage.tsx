import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Wrench, ArrowLeft, Save } from 'lucide-react'
import { Card, CardContent } from '../../../components/common/Card'
import { Button } from '../../../components/common/Button'
import { Input } from '../../../components/common/Input'
import { Spinner } from '../../../components/common/Spinner'
import { maintenanceService, bicycleService } from '../../../api'
import {
  CreateMaintenanceLogDto,
  UpdateMaintenanceLogDto,
  MaintenanceType,
  Bicycle,
} from '../../../types'
import { ROUTES } from '../../../constants'
import toast from 'react-hot-toast'

const AdminMaintenanceFormPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [bicycles, setBicycles] = useState<Bicycle[]>([])
  const [loadingBicycles, setLoadingBicycles] = useState(true)

  const [formData, setFormData] = useState<CreateMaintenanceLogDto>({
    bicycleId: '',
    maintenanceType: MaintenanceType.PREVENTIVE,
    description: '',
    cost: undefined,
    performedBy: '',
    maintenanceDate: new Date().toISOString().split('T')[0],
    nextMaintenanceDate: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load bicycles
  useEffect(() => {
    loadBicycles()
  }, [])

  // Load maintenance data if editing
  useEffect(() => {
    if (isEditMode && id) {
      loadMaintenance(id)
    }
  }, [id, isEditMode])

  const loadBicycles = async () => {
    try {
      setLoadingBicycles(true)
      const data = await bicycleService.getAll()
      setBicycles(data)

      // Set first bicycle as default if creating new maintenance
      if (!isEditMode && data.length > 0) {
        setFormData((prev) => ({ ...prev, bicycleId: data[0]._id }))
      }
    } catch (error) {
      console.error('Error loading bicycles:', error)
      toast.error('Error al cargar bicicletas')
    } finally {
      setLoadingBicycles(false)
    }
  }

  const loadMaintenance = async (maintenanceId: string) => {
    try {
      setLoading(true)
      const maintenance = await maintenanceService.getById(maintenanceId)

      setFormData({
        bicycleId:
          typeof maintenance.bicycleId === 'string'
            ? maintenance.bicycleId
            : maintenance.bicycleId._id,
        maintenanceType: maintenance.maintenanceType,
        description: maintenance.description || '',
        cost: maintenance.cost,
        performedBy: maintenance.performedBy || '',
        maintenanceDate: maintenance.maintenanceDate
          ? maintenance.maintenanceDate.split('T')[0]
          : '',
        nextMaintenanceDate: maintenance.nextMaintenanceDate
          ? maintenance.nextMaintenanceDate.split('T')[0]
          : '',
      })
    } catch (error) {
      console.error('Error loading maintenance:', error)
      toast.error('Error al cargar mantenimiento')
      navigate(ROUTES.ADMIN_MAINTENANCE)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    // Convert cost to number
    if (name === 'cost') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseFloat(value) : undefined,
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
    if (!formData.bicycleId) newErrors.bicycleId = 'Bicicleta es requerida'
    if (!formData.maintenanceType) newErrors.maintenanceType = 'Tipo de mantenimiento es requerido'
    if (!formData.maintenanceDate) newErrors.maintenanceDate = 'Fecha de mantenimiento es requerida'

    // Validate cost
    if (formData.cost !== undefined && formData.cost < 0) {
      newErrors.cost = 'El costo no puede ser negativo'
    }

    // Validate dates
    if (formData.maintenanceDate && formData.nextMaintenanceDate) {
      const maintenanceDate = new Date(formData.maintenanceDate)
      const nextMaintenanceDate = new Date(formData.nextMaintenanceDate)

      if (nextMaintenanceDate <= maintenanceDate) {
        newErrors.nextMaintenanceDate =
          'La fecha del próximo mantenimiento debe ser posterior a la fecha actual'
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
      const dataToSend: CreateMaintenanceLogDto | UpdateMaintenanceLogDto = {
        ...formData,
        description: formData.description || undefined,
        cost: formData.cost || undefined,
        performedBy: formData.performedBy || undefined,
        nextMaintenanceDate: formData.nextMaintenanceDate || undefined,
      }

      if (isEditMode && id) {
        await maintenanceService.update(id, dataToSend as UpdateMaintenanceLogDto)
        toast.success('Mantenimiento actualizado exitosamente')
      } else {
        await maintenanceService.create(dataToSend as CreateMaintenanceLogDto)
        toast.success('Mantenimiento creado exitosamente')
      }

      navigate(ROUTES.ADMIN_MAINTENANCE)
    } catch (error: any) {
      console.error('Error saving maintenance:', error)
      toast.error(error.response?.data?.message || 'Error al guardar mantenimiento')
    } finally {
      setSaving(false)
    }
  }

  if (loading || loadingBicycles) {
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
          onClick={() => navigate(ROUTES.ADMIN_MAINTENANCE)}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la lista
        </Button>

        <div className="flex items-center gap-3">
          <Wrench className="w-8 h-8 text-sena-orange" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode
                ? 'Actualiza la información del mantenimiento'
                : 'Registra un nuevo mantenimiento de bicicleta'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bicycle Selection */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de la Bicicleta</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bicicleta *
                </label>
                <select
                  name="bicycleId"
                  value={formData.bicycleId}
                  onChange={handleChange}
                  className="input-field w-full"
                  required
                  disabled={bicycles.length === 0}
                >
                  {bicycles.length === 0 ? (
                    <option>No hay bicicletas disponibles</option>
                  ) : (
                    <>
                      <option value="">Seleccionar bicicleta</option>
                      {bicycles.map((bicycle) => (
                        <option key={bicycle._id} value={bicycle._id}>
                          {bicycle.code} - {bicycle.brand} {bicycle.model} ({bicycle.status})
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {errors.bicycleId && <p className="text-sm text-red-600 mt-1">{errors.bicycleId}</p>}
              </div>
            </div>

            {/* Maintenance Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Mantenimiento</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Mantenimiento *
                  </label>
                  <select
                    name="maintenanceType"
                    value={formData.maintenanceType}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="preventive">Preventivo</option>
                    <option value="corrective">Correctivo</option>
                    <option value="inspection">Inspección</option>
                    <option value="repair">Reparación</option>
                    <option value="other">Otro</option>
                  </select>
                  {errors.maintenanceType && (
                    <p className="text-sm text-red-600 mt-1">{errors.maintenanceType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe el mantenimiento realizado..."
                    className="input-field w-full min-h-[100px]"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="number"
                      name="cost"
                      label="Costo (COP)"
                      value={formData.cost || ''}
                      onChange={handleChange}
                      placeholder="50000"
                      min="0"
                      step="0.01"
                    />
                    {errors.cost && <p className="text-sm text-red-600 mt-1">{errors.cost}</p>}
                  </div>

                  <div>
                    <Input
                      type="text"
                      name="performedBy"
                      label="Realizado Por"
                      value={formData.performedBy}
                      onChange={handleChange}
                      placeholder="Nombre del técnico"
                    />
                    {errors.performedBy && (
                      <p className="text-sm text-red-600 mt-1">{errors.performedBy}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Fechas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="date"
                    name="maintenanceDate"
                    label="Fecha de Mantenimiento *"
                    value={formData.maintenanceDate}
                    onChange={handleChange}
                    required
                  />
                  {errors.maintenanceDate && (
                    <p className="text-sm text-red-600 mt-1">{errors.maintenanceDate}</p>
                  )}
                </div>

                <div>
                  <Input
                    type="date"
                    name="nextMaintenanceDate"
                    label="Próximo Mantenimiento"
                    value={formData.nextMaintenanceDate}
                    onChange={handleChange}
                  />
                  {errors.nextMaintenanceDate && (
                    <p className="text-sm text-red-600 mt-1">{errors.nextMaintenanceDate}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Fecha estimada del próximo mantenimiento (opcional)
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.ADMIN_MAINTENANCE)}
              >
                Cancelar
              </Button>
              <Button type="submit" isLoading={saving} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isEditMode ? 'Actualizar' : 'Crear'} Mantenimiento
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminMaintenanceFormPage