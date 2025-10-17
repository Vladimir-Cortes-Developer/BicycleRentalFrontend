import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { History, Search, Bike, Calendar, DollarSign, Eye, Download } from 'lucide-react'
import { Card, CardContent } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Table, Column } from '../../components/common/Table'
import { Pagination } from '../../components/common/Pagination'
import { Badge } from '../../components/common/Badge'
import { RentalDetailsModal } from '../../components/rentals'
import { rentalService } from '../../api'
import { Rental, RentalStatus, Bicycle } from '../../types'
import { formatDateTime, formatCurrency, formatDuration } from '../../utils/format'
import { getRentalStatusBadge } from '../../utils/helpers'
import { ROUTES } from '../../constants'
import toast from 'react-hot-toast'

const RentalHistoryPage = () => {
  const navigate = useNavigate()
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<RentalStatus | 'all'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortKey, setSortKey] = useState<string>('startDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Stats
  const [stats, setStats] = useState({
    totalRentals: 0,
    totalHours: 0,
    totalSpent: 0,
    activeRentals: 0,
  })

  // Load rentals
  useEffect(() => {
    const loadRentals = async () => {
      try {
        setLoading(true)
        console.log('Fetching rentals...')
        const data = await rentalService.getMyRentals()
        console.log('Rentals received:', data)
        console.log('Number of rentals:', data?.length || 0)

        if (!data) {
          console.warn('No data received from API')
          setRentals([])
          calculateStats([])
        } else if (Array.isArray(data)) {
          setRentals(data)
          calculateStats(data)
        } else {
          console.error('Invalid data format received:', data)
          setRentals([])
          calculateStats([])
        }
      } catch (error: any) {
        console.error('Error loading rentals:', error)
        console.error('Error details:', error.response?.data)
        toast.error(error.response?.data?.message || 'Error al cargar el historial de alquileres')
        setRentals([])
        calculateStats([])
      } finally {
        setLoading(false)
      }
    }

    loadRentals()
  }, [])

  const calculateStats = (rentalData: Rental[]) => {
    const totalRentals = rentalData.length
    const totalHours = rentalData.reduce((sum, r) => sum + (r.durationInHours || 0), 0)
    const totalSpent = rentalData.reduce((sum, r) => sum + (r.totalCost || r.finalCost || 0), 0)
    const activeRentals = rentalData.filter((r) => r.status === 'active').length

    setStats({
      totalRentals,
      totalHours,
      totalSpent,
      activeRentals,
    })
  }

  // Filter and sort rentals
  const filteredAndSortedRentals = useMemo(() => {
    let filtered = [...rentals]

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((rental) => rental.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((rental) => {
        const bicycle = typeof rental.bicycleId === 'object' ? rental.bicycleId : null
        if (!bicycle) return false

        const searchLower = searchTerm.toLowerCase()
        return (
          bicycle.brand?.toLowerCase().includes(searchLower) ||
          bicycle.model?.toLowerCase().includes(searchLower) ||
          bicycle.code?.toLowerCase().includes(searchLower) ||
          rental._id.toLowerCase().includes(searchLower)
        )
      })
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortKey) {
        case 'startDate':
          aValue = new Date(a.startDate).getTime()
          bValue = new Date(b.startDate).getTime()
          break
        case 'endDate':
          aValue = a.endDate ? new Date(a.endDate).getTime() : 0
          bValue = b.endDate ? new Date(b.endDate).getTime() : 0
          break
        case 'bicycle':
          const bicycleA = typeof a.bicycleId === 'object' ? a.bicycleId : null
          const bicycleB = typeof b.bicycleId === 'object' ? b.bicycleId : null
          aValue = bicycleA ? `${bicycleA.brand} ${bicycleA.model}` : ''
          bValue = bicycleB ? `${bicycleB.brand} ${bicycleB.model}` : ''
          break
        case 'duration':
          aValue = a.durationInHours || 0
          bValue = b.durationInHours || 0
          break
        case 'cost':
          aValue = a.totalCost || a.finalCost || 0
          bValue = b.totalCost || b.finalCost || 0
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [rentals, searchTerm, statusFilter, sortKey, sortDirection])

  // Paginate rentals
  const paginatedRentals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedRentals.slice(startIndex, endIndex)
  }, [filteredAndSortedRentals, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedRentals.length / itemsPerPage)

  // Handle sort
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  // Handle view details
  const handleViewDetails = (rental: Rental) => {
    setSelectedRental(rental)
    setIsDetailsModalOpen(true)
  }

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Bicicleta', 'Fecha Inicio', 'Fecha Fin', 'Duración', 'Costo', 'Estado']
    const rows = filteredAndSortedRentals.map((rental) => {
      const bicycle = typeof rental.bicycleId === 'object' ? rental.bicycleId : null
      return [
        rental._id,
        bicycle ? `${bicycle.brand} ${bicycle.model} (${bicycle.code})` : 'N/A',
        formatDateTime(rental.startDate),
        rental.endDate ? formatDateTime(rental.endDate) : 'N/A',
        rental.durationInHours ? formatDuration(rental.durationInHours) : 'N/A',
        rental.totalCost || rental.finalCost ? formatCurrency(rental.totalCost || rental.finalCost!) : 'N/A',
        rental.status,
      ]
    })

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `historial-alquileres-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Archivo CSV descargado exitosamente')
  }

  // Table columns
  const columns: Column<Rental>[] = [
    {
      key: 'bicycle',
      label: 'Bicicleta',
      sortable: true,
      render: (rental) => {
        const bicycle = typeof rental.bicycleId === 'object' ? rental.bicycleId : null
        return bicycle ? (
          <div>
            <p className="font-medium text-gray-900">
              {bicycle.brand} {bicycle.model}
            </p>
            <p className="text-xs text-gray-500">{bicycle.code}</p>
          </div>
        ) : (
          <span className="text-gray-400">N/A</span>
        )
      },
    },
    {
      key: 'startDate',
      label: 'Fecha Inicio',
      sortable: true,
      render: (rental) => (
        <span className="text-gray-900">{formatDateTime(rental.startDate)}</span>
      ),
    },
    {
      key: 'endDate',
      label: 'Fecha Fin',
      sortable: true,
      render: (rental) =>
        rental.endDate ? (
          <span className="text-gray-900">{formatDateTime(rental.endDate)}</span>
        ) : (
          <span className="text-gray-400">En curso</span>
        ),
    },
    {
      key: 'duration',
      label: 'Duración',
      sortable: true,
      render: (rental) =>
        rental.durationInHours && rental.durationInHours > 0 ? (
          <span className="text-gray-900">{formatDuration(rental.durationInHours)}</span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: 'cost',
      label: 'Costo',
      sortable: true,
      render: (rental) => {
        const cost = rental.totalCost || rental.finalCost
        return cost ? (
          <span className="font-semibold text-sena-orange">{formatCurrency(cost)}</span>
        ) : (
          <span className="text-gray-400">-</span>
        )
      },
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (rental) => (
        <Badge className={getRentalStatusBadge(rental.status).className}>
          {getRentalStatusBadge(rental.status).text}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      className: 'text-right',
      render: (rental) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleViewDetails(rental)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <History className="w-8 h-8 text-sena-orange" />
              Historial de Alquileres
            </h1>
            <p className="text-gray-600 mt-2">Gestiona y revisa todos tus alquileres</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleExportCSV}
              className="flex items-center gap-2"
              disabled={filteredAndSortedRentals.length === 0}
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
            <Button onClick={() => navigate(ROUTES.BICYCLES)} className="flex items-center gap-2">
              <Bike className="w-4 h-4" />
              Ver Bicicletas
            </Button>
          </div>
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
                <p className="text-sm text-gray-600">Total Alquileres</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRentals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <History className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Horas Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(stats.totalHours)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-sena-orange" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Gastado</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalSpent)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Bike className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeRentals}</p>
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
                  placeholder="Buscar por bicicleta, código o ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as RentalStatus | 'all')
                setCurrentPage(1)
              }}
              className="input-field min-w-[150px]"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
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
                  setCurrentPage(1)
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      {filteredAndSortedRentals.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Mostrando {filteredAndSortedRentals.length} de {rentals.length} alquileres
          </p>
        </div>
      )}

      {/* Table or Empty State */}
      {!loading && rentals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No tienes alquileres aún
            </h2>
            <p className="text-gray-600 mb-6">
              Explora nuestro catálogo de bicicletas y comienza tu primera aventura
            </p>
            <Button onClick={() => navigate(ROUTES.BICYCLES)}>
              Ver Bicicletas Disponibles
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <Table
            data={paginatedRentals}
            columns={columns}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
            emptyMessage="No se encontraron alquileres con los filtros aplicados"
            isLoading={loading}
          />
        </Card>
      )}

      {/* Pagination */}
      {filteredAndSortedRentals.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredAndSortedRentals.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage)
            setCurrentPage(1)
          }}
        />
      )}

      {/* Details Modal */}
      <RentalDetailsModal
        rental={selectedRental}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedRental(null)
        }}
      />
    </div>
  )
}

export default RentalHistoryPage