import { useState, useEffect } from 'react'
import {
  TrendingUp,
  DollarSign,
  Bike,
  Users,
  Calendar,
  Download,
  Filter,
  BarChart3,
} from 'lucide-react'
import { Card, CardContent } from '../../../components/common/Card'
import { Button } from '../../../components/common/Button'
import { Spinner } from '../../../components/common/Spinner'
import { Badge } from '../../../components/common/Badge'
import { reportService, bicycleService, rentalService } from '../../../api'
import {
  DashboardStats,
  BicycleRentalStats,
  UserStratumReport,
  RevenueReport,
  Bicycle,
  Rental,
} from '../../../types'
import { formatCurrency, formatDate } from '../../../utils/format'
import toast from 'react-hot-toast'

const AdminReportsPage = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [mostRentedBicycles, setMostRentedBicycles] = useState<BicycleRentalStats[]>([])
  const [usersByStratum, setUsersByStratum] = useState<UserStratumReport[]>([])
  const [revenueByDateRange, setRevenueByDateRange] = useState<RevenueReport[]>([])
  const [allBicycles, setAllBicycles] = useState<Bicycle[]>([])
  const [allRentals, setAllRentals] = useState<Rental[]>([])

  // Filters
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    loadReportsData()
  }, [])

  const loadReportsData = async () => {
    try {
      setLoading(true)

      // Load all reports data in parallel
      const [
        dashboardStats,
        rentedBicycles,
        stratumData,
        bicycles,
        rentals,
      ] = await Promise.all([
        reportService.getDashboardStats(),
        reportService.getMostRentedBicycles(10),
        reportService.getUsersByStratum(),
        bicycleService.getAll(),
        rentalService.getAll(),
      ])

      setStats(dashboardStats)
      setMostRentedBicycles(rentedBicycles)
      setUsersByStratum(stratumData)
      setAllBicycles(bicycles)
      setAllRentals(rentals)
    } catch (error) {
      console.error('Error loading reports data:', error)
      toast.error('Error al cargar datos de reportes')
    } finally {
      setLoading(false)
    }
  }

  const loadRevenueByDateRange = async () => {
    if (!startDate || !endDate) {
      toast.error('Por favor selecciona un rango de fechas')
      return
    }

    try {
      const data = await reportService.getRevenueByDateRange(startDate, endDate)
      setRevenueByDateRange(data)
      toast.success('Reporte de ingresos cargado')
    } catch (error) {
      console.error('Error loading revenue report:', error)
      toast.error('Error al cargar reporte de ingresos')
    }
  }

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error('No hay datos para exportar')
      return
    }

    const headers = Object.keys(data[0]).join(',')
    const rows = data.map((item) => Object.values(item).join(',')).join('\n')
    const csv = `${headers}\n${rows}`

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success('Reporte exportado exitosamente')
  }

  // Calculate additional metrics
  const calculateMetrics = () => {
    if (!stats) return null

    const completedRentals = allRentals.filter((r) => r.status === 'completed')
    const averageRentalDuration =
      completedRentals.reduce((sum, r) => sum + (r.durationInHours || 0), 0) /
        (completedRentals.length || 1)

    const averageRentalCost =
      completedRentals.reduce((sum, r) => sum + (r.totalCost || 0), 0) /
        (completedRentals.length || 1)

    const totalDiscounts = completedRentals.reduce((sum, r) => sum + (r.discount || 0), 0)

    return {
      averageRentalDuration: averageRentalDuration.toFixed(2),
      averageRentalCost,
      totalDiscounts,
      completedRentalsCount: completedRentals.length,
    }
  }

  const metrics = calculateMetrics()

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
              <BarChart3 className="w-8 h-8 text-sena-orange" />
              Reportes y Estadísticas
            </h1>
            <p className="text-gray-600 mt-2">Análisis detallado del sistema SENA Bikes</p>
          </div>
          <Button onClick={() => window.print()} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Imprimir Reporte
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Mes: {formatCurrency(stats.monthlyRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Alquileres</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {allRentals.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Completados: {metrics?.completedRentalsCount || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Bike className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Duración Promedio</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {metrics?.averageRentalDuration || 0}h
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Por alquiler</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Costo Promedio</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(metrics?.averageRentalCost || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Por alquiler</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Revenue by Date Range */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-sena-orange" />
              Ingresos por Rango de Fechas
            </h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                exportToCSV(
                  revenueByDateRange.map((r) => ({
                    Mes: r.month,
                    Año: r.year,
                    'Total Ingresos': r.totalRevenue,
                    'Total Alquileres': r.totalRentals,
                    'Costo Promedio': r.averageRentalCost,
                    'Descuentos Dados': r.discountGiven,
                  })),
                  'ingresos_por_fecha'
                )
              }
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field w-full"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={loadRevenueByDateRange} className="w-full">
                Generar Reporte
              </Button>
            </div>
          </div>

          {revenueByDateRange.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Periodo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ingresos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Alquileres
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Promedio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Descuentos
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {revenueByDateRange.map((revenue, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">
                          {revenue.month} {revenue.year}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {formatCurrency(revenue.totalRevenue)}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{revenue.totalRentals}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {formatCurrency(revenue.averageRentalCost)}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {formatCurrency(revenue.discountGiven)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Most Rented Bicycles */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Top 10 Bicicletas Más Alquiladas
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  exportToCSV(
                    mostRentedBicycles.map((b) => ({
                      Código: b.bicycleCode,
                      Marca: b.brand,
                      Modelo: b.model || 'N/A',
                      'Total Alquileres': b.totalRentals,
                      'Ingresos Totales': b.totalRevenue,
                      'Duración Promedio (h)': b.averageDuration,
                    })),
                    'bicicletas_mas_alquiladas'
                  )
                }
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>

            {mostRentedBicycles.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No hay datos de alquileres disponibles
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Bicicleta
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Alquileres
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Ingresos
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mostRentedBicycles.map((bicycle, index) => (
                      <tr key={bicycle.bicycleId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center w-6 h-6 bg-sena-orange text-white rounded-full font-bold text-xs">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">
                            {bicycle.bicycleCode}
                          </p>
                          <p className="text-xs text-gray-500">
                            {bicycle.brand} {bicycle.model || ''}
                          </p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge className="bg-blue-100 text-blue-800">
                            {bicycle.totalRentals}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-sm font-semibold text-green-600">
                            {formatCurrency(bicycle.totalRevenue)}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users by Stratum */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Usuarios por Estrato Socioeconómico
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  exportToCSV(
                    usersByStratum.map((s) => ({
                      Estrato: s.stratum,
                      'Total Usuarios': s.userCount,
                      'Total Alquileres': s.totalRentals,
                      'Ingresos Totales': s.totalRevenue,
                      'Descuento Promedio': s.averageDiscount,
                    })),
                    'usuarios_por_estrato'
                  )
                }
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>

            {usersByStratum.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No hay datos de estratos disponibles
              </p>
            ) : (
              <div className="space-y-4">
                {usersByStratum.map((stratum) => (
                  <div key={stratum.stratum} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-800 rounded-lg font-bold">
                          {stratum.stratum}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Estrato {stratum.stratum}
                          </p>
                          <p className="text-xs text-gray-600">
                            {stratum.userCount} usuarios
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {formatCurrency(stratum.totalRevenue)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Alquileres</p>
                        <p className="font-semibold text-gray-900">{stratum.totalRentals}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Descuento Promedio</p>
                        <p className="font-semibold text-gray-900">
                          {stratum.averageDiscount}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bicycle Status Distribution */}
      {stats && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Distribución de Bicicletas por Estado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-green-900">Disponibles</p>
                  <Bike className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-900">{stats.availableBicycles}</p>
                <p className="text-xs text-green-700 mt-1">
                  {stats.totalBicycles > 0
                    ? Math.round((stats.availableBicycles / stats.totalBicycles) * 100)
                    : 0}
                  % del total
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-orange-900">Alquiladas</p>
                  <Bike className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-orange-900">{stats.rentedBicycles}</p>
                <p className="text-xs text-orange-700 mt-1">
                  {stats.totalBicycles > 0
                    ? Math.round((stats.rentedBicycles / stats.totalBicycles) * 100)
                    : 0}
                  % del total
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-yellow-900">En Mantenimiento</p>
                  <Bike className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-3xl font-bold text-yellow-900">{stats.maintenanceBicycles}</p>
                <p className="text-xs text-yellow-700 mt-1">
                  {stats.totalBicycles > 0
                    ? Math.round((stats.maintenanceBicycles / stats.totalBicycles) * 100)
                    : 0}
                  % del total
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-blue-900">Total</p>
                  <Bike className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-900">{stats.totalBicycles}</p>
                <p className="text-xs text-blue-700 mt-1">Bicicletas registradas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Total Discounts */}
      {metrics && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Total de Descuentos Otorgados
                </h3>
                <p className="text-4xl font-bold text-sena-orange">
                  {formatCurrency(metrics.totalDiscounts)}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Aplicados en {metrics.completedRentalsCount} alquileres completados
                </p>
              </div>
              <div className="p-4 bg-orange-100 rounded-lg">
                <TrendingUp className="w-12 h-12 text-sena-orange" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AdminReportsPage