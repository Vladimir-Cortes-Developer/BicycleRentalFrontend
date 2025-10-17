import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bike, Calendar, Clock, MapPin, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { Spinner } from '../components/common/Spinner'
import { bicycleService, eventService, rentalService } from '../api'
import { Bicycle, Event, Rental } from '../types'
import { formatDate, formatCurrency, formatDuration } from '../utils/format'
import { getBicycleStatusBadge, getEventStatusBadge } from '../utils/helpers'
import { ROUTES } from '../constants'
import toast from 'react-hot-toast'

const HomePage = () => {
  const { user } = useAuth()
  const [bicycles, setBicycles] = useState<Bicycle[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [activeRental, setActiveRental] = useState<Rental | null>(null)
  const [loadingBicycles, setLoadingBicycles] = useState(true)
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingRental, setLoadingRental] = useState(true)

  // Load available bicycles
  useEffect(() => {
    const loadBicycles = async () => {
      try {
        setLoadingBicycles(true)
        const data = await bicycleService.getAvailable()
        // Show only first 6 bicycles on home page
        setBicycles(data.slice(0, 6))
      } catch (error) {
        console.error('Error loading bicycles:', error)
        toast.error('Error al cargar bicicletas')
      } finally {
        setLoadingBicycles(false)
      }
    }

    loadBicycles()
  }, [])

  // Load upcoming events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoadingEvents(true)
        const data = await eventService.getUpcoming()
        // Show only first 3 events on home page
        setEvents(data.slice(0, 3))
      } catch (error) {
        console.error('Error loading events:', error)
        toast.error('Error al cargar eventos')
      } finally {
        setLoadingEvents(false)
      }
    }

    loadEvents()
  }, [])

  // Load active rental
  useEffect(() => {
    const loadActiveRental = async () => {
      try {
        setLoadingRental(true)
        const data = await rentalService.getActiveRental()
        setActiveRental(data)
      } catch (error) {
        console.error('Error loading active rental:', error)
        // Don't show error for active rental - it's OK if there isn't one
      } finally {
        setLoadingRental(false)
      }
    }

    loadActiveRental()
  }, [])

  const calculateRentalDuration = (rental: Rental): string => {
    const start = new Date(rental.startDate)
    const now = new Date()
    const diffMs = now.getTime() - start.getTime()
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido, {user?.firstName}
        </h1>
        <p className="text-gray-600">
          Sistema de Alquiler de Bicicletas SENA - {typeof user?.regionalId === 'object' && user?.regionalId?.name}
        </p>
      </div>

      {/* Active Rental Alert */}
      {loadingRental ? (
        <div className="mb-8">
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Spinner size="sm" />
                <span className="text-gray-600">Verificando alquiler activo...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : activeRental ? (
        <div className="mb-8">
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-sena-orange mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Tienes un alquiler activo
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Bicicleta:{' '}
                      <span className="font-medium">
                        {typeof activeRental.bicycleId === 'object' && activeRental.bicycleId
                          ? `${activeRental.bicycleId.brand} ${activeRental.bicycleId.model}`
                          : 'N/A'}
                      </span>
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Duración: {calculateRentalDuration(activeRental)}
                      </span>
                      <span>Inicio: {formatDate(activeRental.startDate)}</span>
                    </div>
                  </div>
                </div>
                <Link to={ROUTES.MY_RENTAL}>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    Ver Detalles
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Bicycles Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bike className="w-7 h-7 text-sena-orange" />
              Bicicletas Disponibles
            </h2>
            <p className="text-gray-600 mt-1">Explora nuestro catálogo de bicicletas</p>
          </div>
          <Link to={ROUTES.BICYCLES}>
            <Button variant="outline" className="flex items-center gap-2">
              Ver Todas
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {loadingBicycles ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : bicycles.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bike className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No hay bicicletas disponibles en este momento</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bicycles.map((bicycle) => (
              <Card key={bicycle._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Bicycle Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-sena-orange to-orange-400 flex items-center justify-center rounded-t-lg">
                    <Bike className="w-20 h-20 text-white opacity-50" />
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {bicycle.brand} {bicycle.model}
                        </h3>
                        <p className="text-sm text-gray-600">Código: {bicycle.code}</p>
                      </div>
                      <Badge className={getBicycleStatusBadge(bicycle.status).className}>
                        {getBicycleStatusBadge(bicycle.status).text}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>
                          {bicycle.currentLocation?.address || 'Ubicación no disponible'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Tarifa por hora:</span>
                        <span className="text-sena-orange font-bold">
                          {formatCurrency(bicycle.rentalPricePerHour)}
                        </span>
                      </div>
                    </div>

                    <Link to={`${ROUTES.BICYCLES}/${bicycle._id}`}>
                      <Button fullWidth className="flex items-center justify-center gap-2">
                        Ver Detalles
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Events Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-7 h-7 text-sena-green" />
              Próximos Eventos
            </h2>
            <p className="text-gray-600 mt-1">Únete a nuestros ciclopaseos y eventos</p>
          </div>
          <Link to={ROUTES.EVENTS}>
            <Button variant="outline" className="flex items-center gap-2">
              Ver Todos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {loadingEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No hay eventos próximos en este momento</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    <Badge className={getEventStatusBadge(event.status).className}>
                      {getEventStatusBadge(event.status).text}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(event.eventDate)}</span>
                    </div>
                    {event.meetingPoint && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="line-clamp-1">{event.meetingPoint}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Participantes:</span>
                      <span>
                        {event.currentParticipants || 0}
                        {event.maxParticipants ? ` / ${event.maxParticipants}` : ''}
                      </span>
                    </div>
                  </div>

                  <Link to={`${ROUTES.EVENTS}/${event._id}`}>
                    <Button
                      fullWidth
                      variant="secondary"
                      className="flex items-center justify-center gap-2"
                    >
                      Ver Detalles
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to={ROUTES.MY_RENTAL}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-sena-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Mi Alquiler</h3>
                    <p className="text-sm text-gray-600">
                      {activeRental ? 'Ver alquiler activo' : 'No tienes alquiler activo'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to={ROUTES.RENTAL_HISTORY}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Bike className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Historial</h3>
                    <p className="text-sm text-gray-600">Ver alquileres anteriores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to={ROUTES.MY_EVENTS}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-sena-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Mis Eventos</h3>
                    <p className="text-sm text-gray-600">Ver eventos inscritos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage