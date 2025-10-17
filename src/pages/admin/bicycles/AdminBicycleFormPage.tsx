import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Bike, ArrowLeft, Save } from 'lucide-react'
import { Card, CardContent } from '../../../components/common/Card'
import { Button } from '../../../components/common/Button'
import { Input } from '../../../components/common/Input'
import { Spinner } from '../../../components/common/Spinner'
import { bicycleService, regionalService } from '../../../api'
import { CreateBicycleDto, UpdateBicycleDto, BicycleStatus, Regional } from '../../../types'
import { ROUTES } from '../../../constants'
import toast from 'react-hot-toast'

const AdminBicycleFormPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [regionals, setRegionals] = useState<Regional[]>([])
  const [loadingRegionals, setLoadingRegionals] = useState(true)

  const [formData, setFormData] = useState<CreateBicycleDto>({
    code: '',
    brand: '',
    model: '',
    color: '',
    status: 'available',
    rentalPricePerHour: '',
    regionalId: '',
    purchaseDate: '',
    lastMaintenanceDate: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load regionals
  useEffect(() => {
    loadRegionals()
  }, [])

  // Load bicycle data if editing
  useEffect(() => {
    if (isEditMode && id) {
      loadBicycle(id)
    }
  }, [id, isEditMode])

  const loadRegionals = async () => {
    try {
      setLoadingRegionals(true)
      const data = await regionalService.getActive()
      setRegionals(data)

      // Set first regional as default if creating new bicycle
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

  const loadBicycle = async (bicycleId: string) => {
    try {
      setLoading(true)
      const bicycle = await bicycleService.getById(bicycleId)

      setFormData({
        code: bicycle.code,
        brand: bicycle.brand,
        model: bicycle.model || '',
        color: bicycle.color,
        status: bicycle.status,
        rentalPricePerHour: bicycle.rentalPricePerHour.toString(),
        regionalId: typeof bicycle.regionalId === 'string' ? bicycle.regionalId : bicycle.regionalId._id,
        purchaseDate: bicycle.purchaseDate ? bicycle.purchaseDate.split('T')[0] : '',
        lastMaintenanceDate: bicycle.lastMaintenanceDate ? bicycle.lastMaintenanceDate.split('T')[0] : '',
      })
    } catch (error) {
      console.error('Error loading bicycle:', error)
      toast.error('Error al cargar bicicleta')
      navigate(ROUTES.ADMIN_BICYCLES)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.code) newErrors.code = 'Código es requerido'
    if (!formData.brand) newErrors.brand = 'Marca es requerida'
    if (!formData.color) newErrors.color = 'Color es requerido'
    if (!formData.rentalPricePerHour) newErrors.rentalPricePerHour = 'Tarifa es requerida'
    if (!formData.regionalId) newErrors.regionalId = 'Regional es requerida'

    // Validate price is a number
    if (formData.rentalPricePerHour && isNaN(Number(formData.rentalPricePerHour))) {
      newErrors.rentalPricePerHour = 'La tarifa debe ser un número válido'
    }

    // Validate price is positive
    if (formData.rentalPricePerHour && Number(formData.rentalPricePerHour) <= 0) {
      newErrors.rentalPricePerHour = 'La tarifa debe ser mayor a 0'
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
      const dataToSend: CreateBicycleDto | UpdateBicycleDto = {
        ...formData,
        rentalPricePerHour: Number(formData.rentalPricePerHour),
        model: formData.model || undefined,
        purchaseDate: formData.purchaseDate || undefined,
        lastMaintenanceDate: formData.lastMaintenanceDate || undefined,
      }

      if (isEditMode && id) {
        await bicycleService.update(id, dataToSend as UpdateBicycleDto)
        toast.success('Bicicleta actualizada exitosamente')
      } else {
        await bicycleService.create(dataToSend as CreateBicycleDto)
        toast.success('Bicicleta creada exitosamente')
      }

      navigate(ROUTES.ADMIN_BICYCLES)
    } catch (error: any) {
      console.error('Error saving bicycle:', error)
      toast.error(error.response?.data?.message || 'Error al guardar bicicleta')
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
          onClick={() => navigate(ROUTES.ADMIN_BICYCLES)}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la lista
        </Button>

        <div className="flex items-center gap-3">
          <Bike className="w-8 h-8 text-sena-orange" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Editar Bicicleta' : 'Nueva Bicicleta'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Actualiza la información de la bicicleta' : 'Agrega una nueva bicicleta al sistema'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    name="code"
                    label="Código *"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="BK-001"
                    required
                  />
                  {errors.code && <p className="text-sm text-red-600 mt-1">{errors.code}</p>}
                </div>

                <div>
                  <Input
                    type="text"
                    name="brand"
                    label="Marca *"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Trek, Giant, etc."
                    required
                  />
                  {errors.brand && <p className="text-sm text-red-600 mt-1">{errors.brand}</p>}
                </div>

                <div>
                  <Input
                    type="text"
                    name="model"
                    label="Modelo"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Mountain X2"
                  />
                  {errors.model && <p className="text-sm text-red-600 mt-1">{errors.model}</p>}
                </div>

                <div>
                  <Input
                    type="text"
                    name="color"
                    label="Color *"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Rojo, Azul, Negro, etc."
                    required
                  />
                  {errors.color && <p className="text-sm text-red-600 mt-1">{errors.color}</p>}
                </div>
              </div>
            </div>

            {/* Rental and Status */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Alquiler y Estado</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    type="number"
                    name="rentalPricePerHour"
                    label="Tarifa por Hora (COP) *"
                    value={formData.rentalPricePerHour}
                    onChange={handleChange}
                    placeholder="5000"
                    required
                    min="0"
                    step="100"
                  />
                  {errors.rentalPricePerHour && (
                    <p className="text-sm text-red-600 mt-1">{errors.rentalPricePerHour}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="available">Disponible</option>
                    <option value="rented">Alquilada</option>
                    <option value="maintenance">Mantenimiento</option>
                    <option value="retired">Retirada</option>
                  </select>
                  {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
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
                  {errors.regionalId && <p className="text-sm text-red-600 mt-1">{errors.regionalId}</p>}
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
                    name="purchaseDate"
                    label="Fecha de Compra"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                  />
                  {errors.purchaseDate && <p className="text-sm text-red-600 mt-1">{errors.purchaseDate}</p>}
                </div>

                <div>
                  <Input
                    type="date"
                    name="lastMaintenanceDate"
                    label="Último Mantenimiento"
                    value={formData.lastMaintenanceDate}
                    onChange={handleChange}
                  />
                  {errors.lastMaintenanceDate && (
                    <p className="text-sm text-red-600 mt-1">{errors.lastMaintenanceDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.ADMIN_BICYCLES)}
              >
                Cancelar
              </Button>
              <Button type="submit" isLoading={saving} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isEditMode ? 'Actualizar' : 'Crear'} Bicicleta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminBicycleFormPage