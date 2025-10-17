import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bike, Search, Filter, MapPin, ArrowRight, X } from 'lucide-react'
import { Card, CardContent } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Input } from '../../components/common/Input'
import { Select } from '../../components/common/Select'
import { Spinner } from '../../components/common/Spinner'
import { bicycleService } from '../../api'
import { Bicycle, BicycleStatus } from '../../types'
import { formatCurrency } from '../../utils/format'
import { getBicycleStatusBadge } from '../../utils/helpers'
import { ROUTES } from '../../constants'
import toast from 'react-hot-toast'

const BicyclesPage = () => {
  const [bicycles, setBicycles] = useState<Bicycle[]>([])
  const [filteredBicycles, setFilteredBicycles] = useState<Bicycle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Load all bicycles
  useEffect(() => {
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

    loadBicycles()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...bicycles]

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (bike) =>
          bike.brand.toLowerCase().includes(lowerSearch) ||
          (bike.model || '').toLowerCase().includes(lowerSearch) ||
          bike.code.toLowerCase().includes(lowerSearch)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((bike) => bike.status === statusFilter)
    }

    setFilteredBicycles(filtered)
  }, [searchTerm, statusFilter, bicycles])

  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
  }

  const availableCount = bicycles.filter((b) => b.status === 'available').length
  const inUseCount = bicycles.filter((b) => b.status === 'rented').length
  const maintenanceCount = bicycles.filter((b) => b.status === 'maintenance').length

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'available', label: 'Disponibles' },
    { value: 'in_use', label: 'En uso' },
    { value: 'maintenance', label: 'En mantenimiento' },
    { value: 'out_of_service', label: 'Fuera de servicio' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Bike className="w-8 h-8 text-sena-orange" />
          Catálogo de Bicicletas
        </h1>
        <p className="text-gray-600 mt-2">
          Explora nuestro catálogo de {bicycles.length} bicicletas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-sena-green">{availableCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Bike className="w-6 h-6 text-sena-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En uso</p>
                <p className="text-2xl font-bold text-sena-orange">{inUseCount}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Bike className="w-6 h-6 text-sena-orange" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mantenimiento</p>
                <p className="text-2xl font-bold text-yellow-600">{maintenanceCount}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Bike className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por marca, modelo o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sena-orange focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </Button>

            {/* Filters (Desktop) */}
            <div className="hidden md:flex gap-4">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
                className="w-56"
              />

              {(searchTerm || statusFilter !== 'all') && (
                <Button variant="ghost" onClick={handleClearFilters} className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-4">
              <Select
                label="Estado"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
              />

              {(searchTerm || statusFilter !== 'all') && (
                <Button variant="ghost" onClick={handleClearFilters} fullWidth className="flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  Limpiar Filtros
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-600">
          Mostrando <span className="font-semibold">{filteredBicycles.length}</span> bicicleta(s)
          {(searchTerm || statusFilter !== 'all') && ' con filtros aplicados'}
        </p>
      </div>

      {/* Bicycles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBicycles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bike className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron bicicletas
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay bicicletas registradas en el sistema'}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <Button variant="outline" onClick={handleClearFilters}>
                Limpiar Filtros
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBicycles.map((bicycle) => (
            <Card key={bicycle._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Bicycle Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-sena-orange to-orange-400 flex items-center justify-center rounded-t-lg relative">
                  <Bike className="w-20 h-20 text-white opacity-50" />

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className={getBicycleStatusBadge(bicycle.status).className}>
                      {getBicycleStatusBadge(bicycle.status).text}
                    </Badge>
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-gray-900">
                      {bicycle.brand} {bicycle.model}
                    </h3>
                    <p className="text-sm text-gray-600">Código: {bicycle.code}</p>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">
                        {bicycle.currentLocation?.address || 'Ubicación no disponible'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Tarifa/hora:</span>
                      <span className="text-lg font-bold text-sena-orange">
                        {formatCurrency(bicycle.rentalPricePerHour || bicycle.hourlyRate || 0)}
                      </span>
                    </div>
                  </div>

                  <Link to={`${ROUTES.BICYCLES}/${bicycle._id}`}>
                    <Button
                      fullWidth
                      variant={bicycle.status === 'available' ? 'primary' : 'outline'}
                      className="flex items-center justify-center gap-2"
                    >
                      {bicycle.status === 'available' ? 'Alquilar' : 'Ver Detalles'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default BicyclesPage