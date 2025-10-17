import apiClient from './client'
import type {
  Event,
  CreateEventDto,
  UpdateEventDto,
  RegisterToEventDto,
  ApiResponse,
  User,
} from '../types'

export const eventService = {
  async getAll(): Promise<Event[]> {
    const response = await apiClient.get<ApiResponse<Event[]>>('/events')
    return response.data.data || []
  },

  async getById(id: string): Promise<Event> {
    const response = await apiClient.get<ApiResponse<Event>>(`/events/${id}`)
    return response.data.data!
  },

  async getUpcoming(): Promise<Event[]> {
    const response = await apiClient.get<ApiResponse<Event[]>>('/events/upcoming')
    return response.data.data || []
  },

  async getMyEvents(): Promise<Event[]> {
    const response = await apiClient.get<ApiResponse<Event[]>>('/events/my')
    return response.data.data || []
  },

  async getParticipants(id: string): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(`/events/${id}/participants`)
    return response.data.data || []
  },

  async create(data: CreateEventDto): Promise<Event> {
    const response = await apiClient.post<ApiResponse<Event>>('/events', data)
    return response.data.data!
  },

  async update(id: string, data: UpdateEventDto): Promise<Event> {
    const response = await apiClient.put<ApiResponse<Event>>(`/events/${id}`, data)
    return response.data.data!
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/events/${id}`)
  },

  async registerToEvent(id: string, data: RegisterToEventDto): Promise<void> {
    await apiClient.post(`/events/${id}/register`, data)
  },

  async cancelRegistration(id: string): Promise<void> {
    await apiClient.delete(`/events/${id}/register`)
  },

  async markAttendance(eventId: string, userId: string): Promise<void> {
    await apiClient.post(`/events/${eventId}/attendance/${userId}`)
  },
}