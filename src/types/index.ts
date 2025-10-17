// Enums
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum DocumentType {
  CC = 'CC',
  TI = 'TI',
  CE = 'CE',
}

export enum BicycleStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired',
}

export enum RentalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum MaintenanceType {
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  INSPECTION = 'inspection',
  REPAIR = 'repair',
  OTHER = 'other',
}

// Interfaces for Entities
export interface Location {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
}

export interface User {
  _id: string
  documentType: DocumentType
  documentNumber: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  phone?: string
  socioeconomicStratum?: number
  regionalId: Regional
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Regional {
  _id: string
  name: string
  code: string
  city: string
  department: string
  address?: string
  phone?: string
  location?: Location
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Bicycle {
  _id: string
  code: string
  brand: string
  model?: string
  color: string
  status: BicycleStatus
  rentalPricePerHour: number
  regionalId: Regional | string
  currentLocation?: Location
  purchaseDate?: string
  lastMaintenanceDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Rental {
  _id: string
  userId: User | string
  bicycleId: Bicycle | string
  startDate: string
  endDate?: string
  startLocation?: Location
  endLocation?: Location
  estimatedCost: number
  finalCost?: number
  discount?: number
  discountPercentage?: number
  totalCost?: number
  durationInHours?: number
  status: RentalStatus
  createdAt: string
  updatedAt: string
}

export interface Event {
  _id: string
  name: string
  description?: string
  eventType?: string
  eventDate: string
  startTime: string
  endTime?: string
  routeDescription?: string
  meetingPoint?: string
  meetingPointLocation?: Location
  maxParticipants?: number
  currentParticipants: number
  regionalId: Regional | string
  status: EventStatus
  participants: User[] | string[]
  createdBy: User | string
  createdAt: string
  updatedAt: string
}

export interface EventParticipant {
  _id: string
  eventId: Event | string
  userId: User | string
  registrationDate: string
  attended: boolean
  createdAt: string
  updatedAt: string
}

export interface MaintenanceLog {
  _id: string
  bicycleId: Bicycle | string
  maintenanceType: MaintenanceType
  description?: string
  cost?: number
  performedBy?: string
  maintenanceDate: string
  nextMaintenanceDate?: string
  createdAt: string
  updatedAt: string
}

// DTOs for API requests
export interface LoginDto {
  email: string
  password: string
}

export interface RegisterUserDto {
  documentType: DocumentType
  documentNumber: string
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  socioeconomicStratum?: number
  regionalId: string
}

export interface CreateBicycleDto {
  code: string
  brand: string
  model?: string
  color: string
  status?: BicycleStatus
  rentalPricePerHour: number | string
  regionalId: string
  currentLocation?: Location
  purchaseDate?: string
  lastMaintenanceDate?: string
}

export interface UpdateBicycleDto {
  code?: string
  brand?: string
  model?: string
  color?: string
  status?: BicycleStatus
  rentalPricePerHour?: number | string
  regionalId?: string
  currentLocation?: Location
  purchaseDate?: string
  lastMaintenanceDate?: string
}

export interface RentBicycleDto {
  bicycleId: string
  startLocation?: Location
}

export interface ReturnBicycleDto {
  endLocation?: Location
}

export interface CreateEventDto {
  name: string
  description?: string
  eventType?: string
  eventDate: string
  startTime: string
  endTime?: string
  routeDescription?: string
  meetingPoint?: string
  meetingPointLocation?: Location
  maxParticipants?: number
  regionalId: string
  status?: EventStatus
}

export interface UpdateEventDto {
  name?: string
  description?: string
  eventType?: string
  eventDate?: string
  startTime?: string
  endTime?: string
  routeDescription?: string
  meetingPoint?: string
  meetingPointLocation?: Location
  maxParticipants?: number
  regionalId?: string
  status?: EventStatus
}

export interface RegisterToEventDto {
  eventId: string
}

export interface CreateMaintenanceLogDto {
  bicycleId: string
  maintenanceType: MaintenanceType
  description?: string
  cost?: number
  performedBy?: string
  maintenanceDate?: string
  nextMaintenanceDate?: string
}

export interface UpdateMaintenanceLogDto {
  bicycleId?: string
  maintenanceType?: MaintenanceType
  description?: string
  cost?: number
  performedBy?: string
  maintenanceDate?: string
  nextMaintenanceDate?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface AuthResponse {
  success: boolean
  data: {
    user: User
    token: string
  }
  message: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Dashboard & Reports types
export interface DashboardStats {
  totalBicycles: number
  availableBicycles: number
  rentedBicycles: number
  maintenanceBicycles: number
  totalUsers: number
  activeRentals: number
  totalRevenue: number
  monthlyRevenue: number
  upcomingEvents: number
}

export interface RevenueReport {
  month: string
  year: number
  totalRevenue: number
  totalRentals: number
  averageRentalCost: number
  discountGiven: number
}

export interface BicycleRentalStats {
  bicycleId: string
  bicycleCode: string
  brand: string
  model?: string
  totalRentals: number
  totalRevenue: number
  averageDuration: number
}

export interface UserStratumReport {
  stratum: number
  userCount: number
  totalRentals: number
  totalRevenue: number
  averageDiscount: number
}