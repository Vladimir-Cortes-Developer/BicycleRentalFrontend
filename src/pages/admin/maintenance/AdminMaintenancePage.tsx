import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wrench, Plus, Edit, Trash2, Search, Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent } from '../../../components/common/Card'
import { Button } from '../../../components/common/Button'
import { Badge } from '../../../components/common/Badge'
import { Input } from '../../../components/common/Input'
import { Spinner } from '../../../components/common/Spinner'
import { ConfirmModal } from '../../../components/common/Modal'
import { maintenanceService } from '../../../api'
import { MaintenanceLog, MaintenanceType, Bicycle } from '../../../types'
import { formatDate, formatCurrency } from '../../../utils/format'
import { ROUTES } from '../../../constants'
import toast from 'react-hot-toast'

const AdminMaintenancePage = () => {
  const navigate = useNavigate()
  const [maintenances, setMaintenances] = useState<MaintenanceLog[]>([])
  const [filteredMaintenances, setFilteredMaintenances] = useState<MaintenanceLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<MaintenanceType | 'all'>('all')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [maintenanceToDelete, setMaintenanceToDelete] = useState<MaintenanceLog | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Load maintenances
  useEffect(() => {
    loadMaintenances()
  }, [])

  const loadMaintenances = async () => {
    try {
      setLoading(true)
      const data = await maintenanceService.getAll()
      setMaintenances(data)
      setFilteredMaintenances(data)
    } catch (error) {
      console.error('Error loading maintenances:', error)
      toast.error('Error al cargar mantenimientos')
    } finally {
      setLoading(false)
    }
  }

  // Apply filters
  useEffect(() => {
    let filtered = [...maintenances]

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter((maintenance) => {
        const bicycle = maintenance.bicycleId as Bicycle
        return (
          maintenance.description?.toLowerCase().includes(lowerSearch) ||
          maintenance.performedBy?.toLowerCase().includes(lowerSearch) ||
          (typeof bicycle === 'object' && bicycle.code?.toLowerCase().includes(lowerSearch))
        )
      })
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((maintenance) => maintenance.maintenanceType === typeFilter)
    }

    setFilteredMaintenances(filtered)
  }, [searchTerm, typeFilter, maintenances])

  const handleDelete = (maintenance: MaintenanceLog) => {
    setMaintenanceToDelete(maintenance)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!maintenanceToDelete) return

    try {
      setIsDeleting(true)
      await maintenanceService.delete(maintenanceToDelete._id)
      toast.success('Mantenimiento eliminado exitosamente')
      setDeleteModalOpen(false)
      setMaintenanceToDelete(null)
      await loadMaintenances()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar mantenimiento')
    } finally {
      setIsDeleting(false)
    }
  }

  const getMaintenanceTypeBadge = (type: MaintenanceType) => {
    const badges = {
      preventive: { text: 'Preventivo', className: 'bg-blue-100 text-blue-800' },
      corrective: { text: 'Correctivo', className: 'bg-yellow-100 text-yellow-800' },
      inspection: { text: 'Inspección', className: 'bg-purple-100 text-purple-800' },
      repair: { text: 'Reparación', className: 'bg-red-100 text-red-800' },
      other: { text: 'Otro', className: 'bg-gray-100 text-gray-800' },
    }
    return badges[type]
  }

  const stats = {
    total: maintenances.length,
    preventive: maintenances.filter((m) => m.maintenanceType === 'preventive').length,
    corrective: maintenances.filter((m) => m.maintenanceType === 'corrective').length,
    totalCost: maintenances.reduce((sum, m) => sum + (m.cost || 0), 0),
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
              <Wrench className="w-8 h-8 text-sena-orange" />
              Gestión de Mantenimientos
            </h1>
            <p className="text-gray-600 mt-2">
              Administra todos los mantenimientos del sistema
            </p>
          </div>
          <Button
            onClick={() => navigate(ROUTES.ADMIN_MAINTENANCE_CREATE)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Mantenimiento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Wrench className="w-6 h-6 text-blue-600" />
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
                <p className="text-sm text-gray-600">Preventivos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.preventive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Wrench className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Correctivos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.corrective}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Costo Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalCost)}
                </p>
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
                  placeholder="Buscar mantenimientos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as MaintenanceType | 'all')}
              className="input-field min-w-[150px]"
            >
              <option value="all">Todos los tipos</option>
              <option value="preventive">Preventivo</option>
              <option value="corrective">Correctivo</option>
              <option value="inspection">Inspección</option>
              <option value="repair">Reparación</option>
              <option value="other">Otro</option>
            </select>

            {/* Clear Filters */}
            {(searchTerm || typeFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setTypeFilter('all')
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      {filteredMaintenances.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Mostrando {filteredMaintenances.length} de {maintenances.length} mantenimientos
          </p>
        </div>
      )}

      {/* Maintenances Table */}
      {filteredMaintenances.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {maintenances.length === 0
                ? 'No hay mantenimientos registrados'
                : 'No se encontraron resultados'}
            </h2>
            <p className="text-gray-600 mb-6">
              {maintenances.length === 0
                ? 'Comienza creando tu primer registro de mantenimiento'
                : 'Intenta ajustar los filtros de búsqueda'}
            </p>
            {maintenances.length === 0 && (
              <Button onClick={() => navigate(ROUTES.ADMIN_MAINTENANCE_CREATE)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Mantenimiento
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
                    Bicicleta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Realizado Por
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaintenances.map((maintenance) => {
                  const bicycle = maintenance.bicycleId as Bicycle
                  return (
                    <tr key={maintenance._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {typeof bicycle === 'object' ? bicycle.code : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {typeof bicycle === 'object'
                              ? `${bicycle.brand} ${bicycle.model || ''}`
                              : ''}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={
                            getMaintenanceTypeBadge(maintenance.maintenanceType).className
                          }
                        >
                          {getMaintenanceTypeBadge(maintenance.maintenanceType).text}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 max-w-xs truncate">
                          {maintenance.description || 'Sin descripción'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {formatDate(maintenance.maintenanceDate)}
                        </p>
                        {maintenance.nextMaintenanceDate && (
                          <p className="text-xs text-gray-500">
                            Próximo: {formatDate(maintenance.nextMaintenanceDate)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {maintenance.cost ? formatCurrency(maintenance.cost) : '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {maintenance.performedBy || 'No especificado'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                ROUTES.ADMIN_MAINTENANCE_EDIT.replace(':id', maintenance._id)
                              )
                            }
                            className="text-sena-orange hover:text-orange-700"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(maintenance)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
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
          setMaintenanceToDelete(null)
        }}
        onConfirm={confirmDelete}
        title="Eliminar Mantenimiento"
        message={`¿Estás seguro que deseas eliminar este registro de mantenimiento? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  )
}

export default AdminMaintenancePage