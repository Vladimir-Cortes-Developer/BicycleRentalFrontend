export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // User routes
  BICYCLES: '/bicycles',
  BICYCLE_DETAIL: '/bicycles/:id',
  MY_RENTAL: '/my-rental',
  RENTAL_HISTORY: '/rental-history',
  EVENTS: '/events',
  EVENT_DETAIL: '/events/:id',
  MY_EVENTS: '/my-events',
  PROFILE: '/profile',

  // Admin routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_BICYCLES: '/admin/bicycles',
  ADMIN_BICYCLES_CREATE: '/admin/bicycles/create',
  ADMIN_BICYCLES_EDIT: '/admin/bicycles/:id/edit',
  ADMIN_RENTALS: '/admin/rentals',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_EVENTS_CREATE: '/admin/events/create',
  ADMIN_EVENTS_EDIT: '/admin/events/:id/edit',
  ADMIN_MAINTENANCE: '/admin/maintenance',
  ADMIN_MAINTENANCE_CREATE: '/admin/maintenance/create',
  ADMIN_MAINTENANCE_EDIT: '/admin/maintenance/:id/edit',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_USERS: '/admin/users',
  ADMIN_MAP: '/admin/map',
} as const

export const DOCUMENT_TYPES = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CE', label: 'Cédula de Extranjería' },
] as const

export const SOCIOECONOMIC_STRATA = [
  { value: 1, label: 'Estrato 1', discount: 10 },
  { value: 2, label: 'Estrato 2', discount: 10 },
  { value: 3, label: 'Estrato 3', discount: 5 },
  { value: 4, label: 'Estrato 4', discount: 5 },
  { value: 5, label: 'Estrato 5', discount: 0 },
  { value: 6, label: 'Estrato 6', discount: 0 },
] as const

export const BICYCLE_STATUS = {
  AVAILABLE: { value: 'available', label: 'Disponible', text: 'Disponible', className: 'badge-success' },
  RENTED: { value: 'rented', label: 'Alquilada', text: 'Alquilada', className: 'badge-danger' },
  MAINTENANCE: { value: 'maintenance', label: 'Mantenimiento', text: 'Mantenimiento', className: 'badge-warning' },
  RETIRED: { value: 'retired', label: 'Retirada', text: 'Retirada', className: 'badge-info' },
} as const

export const RENTAL_STATUS = {
  ACTIVE: { value: 'active', label: 'Activo', text: 'Activo', className: 'badge-success' },
  COMPLETED: { value: 'completed', label: 'Completado', text: 'Completado', className: 'badge-info' },
  CANCELLED: { value: 'cancelled', label: 'Cancelado', text: 'Cancelado', className: 'badge-danger' },
} as const

export const EVENT_STATUS = {
  DRAFT: { value: 'draft', label: 'Borrador', text: 'Borrador', className: 'badge-info' },
  PUBLISHED: { value: 'published', label: 'Publicado', text: 'Publicado', className: 'badge-success' },
  CANCELLED: { value: 'cancelled', label: 'Cancelado', text: 'Cancelado', className: 'badge-danger' },
  COMPLETED: { value: 'completed', label: 'Completado', text: 'Completado', className: 'badge-warning' },
} as const

export const MAINTENANCE_TYPES = [
  { value: 'preventive', label: 'Preventivo' },
  { value: 'corrective', label: 'Correctivo' },
  { value: 'inspection', label: 'Inspección' },
  { value: 'repair', label: 'Reparación' },
  { value: 'other', label: 'Otro' },
] as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 20, 50, 100],
} as const

export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss",
} as const

export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Inicio de sesión exitoso',
    REGISTER: 'Registro exitoso',
    LOGOUT: 'Sesión cerrada',
    BICYCLE_CREATED: 'Bicicleta creada exitosamente',
    BICYCLE_UPDATED: 'Bicicleta actualizada exitosamente',
    BICYCLE_DELETED: 'Bicicleta eliminada exitosamente',
    RENTAL_CREATED: 'Bicicleta alquilada exitosamente',
    RENTAL_RETURNED: 'Bicicleta devuelta exitosamente',
    EVENT_CREATED: 'Evento creado exitosamente',
    EVENT_UPDATED: 'Evento actualizado exitosamente',
    EVENT_DELETED: 'Evento eliminado exitosamente',
    EVENT_REGISTERED: 'Inscripción exitosa al evento',
    EVENT_CANCELLED: 'Inscripción cancelada',
    PROFILE_UPDATED: 'Perfil actualizado exitosamente',
  },
  ERROR: {
    GENERIC: 'Ocurrió un error. Intenta nuevamente.',
    NETWORK: 'Error de conexión. Verifica tu conexión a internet.',
    UNAUTHORIZED: 'No tienes autorización para realizar esta acción.',
    NOT_FOUND: 'Recurso no encontrado.',
    VALIDATION: 'Por favor verifica los datos ingresados.',
  },
} as const

export const MAP_CONFIG = {
  DEFAULT_CENTER: [4.6097, -74.0817] as [number, number], // Bogotá, Colombia
  DEFAULT_ZOOM: 13,
  MARKER_COLORS: {
    available: '#39A900',
    rented: '#FF5700',
    maintenance: '#FFB800',
    retired: '#666666',
  },
} as const