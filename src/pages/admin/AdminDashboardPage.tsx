import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bike,
  Users,
  DollarSign,
  Calendar,
  Wrench,
  TrendingUp,
  Activity,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Spinner } from '../../components/common/Spinner'
import { Badge } from '../../components/common/Badge'
import { reportService, eventService, maintenanceService } from '../../api'
import { DashboardStats, BicycleRentalStats, Event, MaintenanceLog } from '../../types'
import { formatCurrency, formatDate } from '../../utils/format'
import { ROUTES } from '../../constants'
import toast from 'react-hot-toast'

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [mostRentedBicycles, setMostRentedBicycles] = useState<BicycleRentalStats[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [recentMaintenances, setRecentMaintenances] = useState<MaintenanceLog[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load all dashboard data in parallel
      const [dashboardStats, rentedBicycles, events, maintenances] = await Promise.all([
        reportService.getDashboardStats(),
        reportService.getMostRentedBicycles(5),
        eventService.getAll(),
        maintenanceService.getAll(),
      ])

      setStats(dashboardStats)
      setMostRentedBicycles(rentedBicycles)

      // Filter upcoming events
      const upcoming = events
        .filter((event) => event.status === 'published' && new Date(event.eventDate) >= new Date())
        .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
        .slice(0, 5)
      setUpcomingEvents(upcoming)

      // Get recent maintenances
      const recent = maintenances
        .sort((a, b) => new Date(b.maintenanceDate).getTime() - new Date(a.maintenanceDate).getTime())
        .slice(0, 5)
      setRecentMaintenances(recent)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Error al cargar datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar datos</h2>
          <p className="text-gray-600 mb-6">No se pudieron cargar los datos del dashboard</p>
          <Button onClick={loadDashboardData}>Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">Vista general del sistema SENA Bikes</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Bicycles */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bicicletas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBicycles}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    {stats.availableBicycles} disponibles
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bike className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Rentals */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alquileres Activos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeRentals}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-orange-100 text-orange-800">
                    {stats.rentedBicycles} en uso
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Totales</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-purple-100 text-purple-800">Registrados</Badge>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos del Mes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatCurrency(stats.monthlyRevenue)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    Total: {formatCurrency(stats.totalRevenue)}
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Maintenance */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">En Mantenimiento</h3>
              <Wrench className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats.maintenanceBicycles}</p>
            <p className="text-sm text-gray-600 mt-2">Bicicletas en mantenimiento</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 w-full"
              onClick={() => navigate(ROUTES.ADMIN_MAINTENANCE)}
            >
              Ver mantenimientos
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Próximos Eventos</h3>
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats.upcomingEvents}</p>
            <p className="text-sm text-gray-600 mt-2">Eventos programados</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 w-full"
              onClick={() => navigate(ROUTES.ADMIN_EVENTS)}
            >
              Ver eventos
            </Button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Estado del Sistema</h3>
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Disponibilidad</span>
                <Badge className="bg-green-100 text-green-800">
                  {stats.totalBicycles > 0
                    ? Math.round((stats.availableBicycles / stats.totalBicycles) * 100)
                    : 0}
                  %
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ocupación</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {stats.totalBicycles > 0
                    ? Math.round((stats.rentedBicycles / stats.totalBicycles) * 100)
                    : 0}
                  %
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mantenimiento</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {stats.totalBicycles > 0
                    ? Math.round((stats.maintenanceBicycles / stats.totalBicycles) * 100)
                    : 0}
                  %
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Rented Bicycles */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Bicicletas Más Alquiladas</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.ADMIN_BICYCLES)}
              >
                Ver todas
              </Button>
            </div>
            {mostRentedBicycles.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No hay datos de alquileres disponibles
              </p>
            ) : (
              <div className="space-y-4">
                {mostRentedBicycles.map((bicycle, index) => (
                  <div
                    key={bicycle.bicycleId}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-sena-orange text-white rounded-full font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{bicycle.bicycleCode}</p>
                        <p className="text-sm text-gray-600">
                          {bicycle.brand} {bicycle.model || ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{bicycle.totalRentals}</p>
                      <p className="text-xs text-gray-600">alquileres</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Próximos Eventos</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.ADMIN_EVENTS)}
              >
                Ver todos
              </Button>
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No hay eventos próximos programados
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`${ROUTES.EVENTS}/${event._id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{event.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(event.eventDate)} - {event.startTime}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {event.currentParticipants}
                        {event.maxParticipants ? `/${event.maxParticipants}` : ''}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Maintenance */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Mantenimientos Recientes</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(ROUTES.ADMIN_MAINTENANCE)}
            >
              Ver todos
            </Button>
          </div>
          {recentMaintenances.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No hay mantenimientos registrados
            </p>
          ) : (
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
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Costo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentMaintenances.map((maintenance) => {
                    const bicycle = maintenance.bicycleId as any
                    return (
                      <tr key={maintenance._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-medium text-gray-900">
                            {bicycle?.code || 'N/A'}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-blue-100 text-blue-800">
                            {maintenance.maintenanceType}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-900">
                            {formatDate(maintenance.maintenanceDate)}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-900">
                            {maintenance.cost ? formatCurrency(maintenance.cost) : '-'}
                          </p>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="h-auto py-4"
          onClick={() => navigate(ROUTES.ADMIN_BICYCLES_CREATE)}
        >
          <Bike className="w-5 h-5 mr-2" />
          Nueva Bicicleta
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4"
          onClick={() => navigate(ROUTES.ADMIN_EVENTS_CREATE)}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Nuevo Evento
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4"
          onClick={() => navigate(ROUTES.ADMIN_MAINTENANCE_CREATE)}
        >
          <Wrench className="w-5 h-5 mr-2" />
          Nuevo Mantenimiento
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4"
          onClick={() => navigate(ROUTES.ADMIN_REPORTS)}
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Ver Reportes
        </Button>
      </div>
    </div>
  )
}

export default AdminDashboardPage