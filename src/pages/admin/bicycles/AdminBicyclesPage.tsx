import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bike, Plus, Edit, Trash2, Search, Eye } from 'lucide-react'
import { Card, CardContent } from '../../../components/common/Card'
import { Button } from '../../../components/common/Button'
import { Badge } from '../../../components/common/Badge'
import { Input } from '../../../components/common/Input'
import { Spinner } from '../../../components/common/Spinner'
import { ConfirmModal } from '../../../components/common/Modal'
import { bicycleService } from '../../../api'
import { Bicycle, BicycleStatus } from '../../../types'
import { formatCurrency, formatDate } from '../../../utils/format'
import { getBicycleStatusBadge } from '../../../utils/helpers'
import { ROUTES } from '../../../constants'
import toast from 'react-hot-toast'

const AdminBicyclesPage = () => {
  const navigate = useNavigate()
  const [bicycles, setBicycles] = useState<Bicycle[]>([])
  const [filteredBicycles, setFilteredBicycles] = useState<Bicycle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<BicycleStatus | 'all'>('all')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bicycleToDelete, setBicycleToDelete] = useState<Bicycle | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Load bicycles
  useEffect(() => {
    loadBicycles()
  }, [])

  const loadBicycles = async () => {
    try {
      setLoading(true)
      const data = await bicycleService.getAll()
      setBicycles(data)
      setFilteredBicycles(data)
    } catch (error) {
      console.error('Error loading bicycles:', error)
      toast.error('Error al cargar bicicletas')
    } finally {
      setLoading(false)
    }
  }

  // Apply filters
  useEffect(() => {
    let filtered = [...bicycles]

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (bike) =>
          bike.brand?.toLowerCase().includes(lowerSearch) ||
          bike.model?.toLowerCase().includes(lowerSearch) ||
          bike.code?.toLowerCase().includes(lowerSearch)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((bike) => bike.status === statusFilter)
    }

    setFilteredBicycles(filtered)
  }, [searchTerm, statusFilter, bicycles])

  const handleDelete = (bicycle: Bicycle) => {
    setBicycleToDelete(bicycle)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!bicycleToDelete) return

    try {
      setIsDeleting(true)
      await bicycleService.delete(bicycleToDelete._id)
      toast.success('Bicicleta eliminada exitosamente')
      setDeleteModalOpen(false)
      setBicycleToDelete(null)
      await loadBicycles()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar bicicleta')
    } finally {
      setIsDeleting(false)
    }
  }

  const stats = {
    total: bicycles.length,
    available: bicycles.filter((b) => b.status === 'available').length,
    rented: bicycles.filter((b) => b.status === 'rented').length,
    maintenance: bicycles.filter((b) => b.status === 'maintenance').length,
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
              <Bike className="w-8 h-8 text-sena-orange" />
              Gestión de Bicicletas
            </h1>
            <p className="text-gray-600 mt-2">
              Administra el catálogo completo de bicicletas
            </p>
          </div>
          <Button
            onClick={() => navigate(ROUTES.ADMIN_BICYCLES_CREATE)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Bicicleta
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bike className="w-6 h-6 text-blue-600" />
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
                <Bike className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Bike className="w-6 h-6 text-sena-orange" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Alquiladas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rented}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Bike className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mantenimiento</p>
                <p className="text-2xl font-bold text-gray-900">{stats.maintenance}</p>
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
                  placeholder="Buscar por marca, modelo o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BicycleStatus | 'all')}
              className="input-field min-w-[150px]"
            >
              <option value="all">Todos los estados</option>
              <option value="available">Disponible</option>
              <option value="rented">Alquilada</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="retired">Retirada</option>
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
      {filteredBicycles.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Mostrando {filteredBicycles.length} de {bicycles.length} bicicletas
          </p>
        </div>
      )}

      {/* Bicycles Table */}
      {filteredBicycles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bike className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {bicycles.length === 0 ? 'No hay bicicletas registradas' : 'No se encontraron resultados'}
            </h2>
            <p className="text-gray-600 mb-6">
              {bicycles.length === 0
                ? 'Comienza agregando tu primera bicicleta al sistema'
                : 'Intenta ajustar los filtros de búsqueda'}
            </p>
            {bicycles.length === 0 && (
              <Button onClick={() => navigate(ROUTES.ADMIN_BICYCLES_CREATE)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Bicicleta
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
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bicicleta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarifa/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Compra
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBicycles.map((bicycle) => (
                  <tr key={bicycle._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{bicycle.code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {bicycle.brand} {bicycle.model}
                        </p>
                        <p className="text-sm text-gray-500">{bicycle.color}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getBicycleStatusBadge(bicycle.status).className}>
                        {getBicycleStatusBadge(bicycle.status).text}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-sena-orange">
                        {formatCurrency(bicycle.rentalPricePerHour)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {bicycle.purchaseDate ? formatDate(bicycle.purchaseDate) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`${ROUTES.BICYCLES}/${bicycle._id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(ROUTES.ADMIN_BICYCLES_EDIT.replace(':id', bicycle._id))
                          }
                          className="text-sena-orange hover:text-orange-700"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(bicycle)}
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
          setBicycleToDelete(null)
        }}
        onConfirm={confirmDelete}
        title="Eliminar Bicicleta"
        message={`¿Estás seguro que deseas eliminar la bicicleta "${bicycleToDelete?.brand} ${bicycleToDelete?.model}" (${bicycleToDelete?.code})? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  )
}

export default AdminBicyclesPage