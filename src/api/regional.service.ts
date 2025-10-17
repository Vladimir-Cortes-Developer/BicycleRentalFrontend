import apiClient from './client'
import type { Regional, ApiResponse } from '../types'

export const regionalService = {
  async getAll(): Promise<Regional[]> {
    const response = await apiClient.get<ApiResponse<Regional[]>>('/regionals')
    return response.data.data || []
  },

  async getById(id: string): Promise<Regional> {
    const response = await apiClient.get<ApiResponse<Regional>>(`/regionals/${id}`)
    return response.data.data!
  },

  async getActive(): Promise<Regional[]> {
    const response = await apiClient.get<ApiResponse<Regional[]>>('/regionals?isActive=true')
    return response.data.data || []
  },
}