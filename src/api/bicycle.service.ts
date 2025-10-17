import apiClient from './client'
import type {
  Bicycle,
  CreateBicycleDto,
  UpdateBicycleDto,
  ApiResponse,
  BicycleStatus,
  Location,
} from '../types'

export const bicycleService = {
  async getAll(): Promise<Bicycle[]> {
    const response = await apiClient.get<ApiResponse<Bicycle[]>>('/bicycles')
    return response.data.data || []
  },

  async getById(id: string): Promise<Bicycle> {
    const response = await apiClient.get<ApiResponse<Bicycle>>(`/bicycles/${id}`)
    return response.data.data!
  },

  async getByCode(code: string): Promise<Bicycle> {
    const response = await apiClient.get<ApiResponse<Bicycle>>(`/bicycles/code/${code}`)
    return response.data.data!
  },

  async getAvailable(): Promise<Bicycle[]> {
    const response = await apiClient.get<ApiResponse<Bicycle[]>>('/bicycles/available')
    return response.data.data || []
  },

  async getNearby(lat: number, lng: number, maxDistance?: number): Promise<Bicycle[]> {
    const response = await apiClient.get<ApiResponse<Bicycle[]>>('/bicycles/nearby', {
      params: { lat, lng, maxDistance },
    })
    return response.data.data || []
  },

  async getCountByStatus(): Promise<Record<BicycleStatus, number>> {
    const response = await apiClient.get<ApiResponse<Record<BicycleStatus, number>>>(
      '/bicycles/stats/count-by-status'
    )
    return response.data.data!
  },

  async create(data: CreateBicycleDto): Promise<Bicycle> {
    const response = await apiClient.post<ApiResponse<Bicycle>>('/bicycles', data)
    return response.data.data!
  },

  async update(id: string, data: UpdateBicycleDto): Promise<Bicycle> {
    const response = await apiClient.put<ApiResponse<Bicycle>>(`/bicycles/${id}`, data)
    return response.data.data!
  },

  async updateStatus(id: string, status: BicycleStatus): Promise<Bicycle> {
    const response = await apiClient.patch<ApiResponse<Bicycle>>(`/bicycles/${id}/status`, {
      status,
    })
    return response.data.data!
  },

  async updateLocation(id: string, location: Location): Promise<Bicycle> {
    const response = await apiClient.patch<ApiResponse<Bicycle>>(`/bicycles/${id}/location`, {
      location,
    })
    return response.data.data!
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/bicycles/${id}`)
  },
}