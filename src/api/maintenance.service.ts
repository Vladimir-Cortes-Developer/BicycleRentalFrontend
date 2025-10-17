import apiClient from './client'
import type {
  MaintenanceLog,
  CreateMaintenanceLogDto,
  UpdateMaintenanceLogDto,
  ApiResponse,
} from '../types'

export const maintenanceService = {
  async getAll(): Promise<MaintenanceLog[]> {
    const response = await apiClient.get<ApiResponse<MaintenanceLog[]>>('/maintenance')
    return response.data.data || []
  },

  async getById(id: string): Promise<MaintenanceLog> {
    const response = await apiClient.get<ApiResponse<MaintenanceLog>>(`/maintenance/${id}`)
    return response.data.data!
  },

  async getByBicycle(bicycleId: string): Promise<MaintenanceLog[]> {
    const response = await apiClient.get<ApiResponse<MaintenanceLog[]>>(
      `/maintenance/bicycle/${bicycleId}`
    )
    return response.data.data || []
  },

  async getUpcoming(): Promise<MaintenanceLog[]> {
    const response = await apiClient.get<ApiResponse<MaintenanceLog[]>>('/maintenance/upcoming')
    return response.data.data || []
  },

  async getOverdue(): Promise<MaintenanceLog[]> {
    const response = await apiClient.get<ApiResponse<MaintenanceLog[]>>('/maintenance/overdue')
    return response.data.data || []
  },

  async getStats(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>('/maintenance/stats')
    return response.data.data!
  },

  async create(data: CreateMaintenanceLogDto): Promise<MaintenanceLog> {
    const response = await apiClient.post<ApiResponse<MaintenanceLog>>('/maintenance', data)
    return response.data.data!
  },

  async update(id: string, data: UpdateMaintenanceLogDto): Promise<MaintenanceLog> {
    const response = await apiClient.put<ApiResponse<MaintenanceLog>>(`/maintenance/${id}`, data)
    return response.data.data!
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/maintenance/${id}`)
  },

  async completeMaintenance(id: string): Promise<MaintenanceLog> {
    const response = await apiClient.post<ApiResponse<MaintenanceLog>>(
      `/maintenance/${id}/complete`
    )
    return response.data.data!
  },
}