import apiClient from './client'
import type { Rental, RentBicycleDto, ReturnBicycleDto, ApiResponse } from '../types'

export const rentalService = {
  async getAll(): Promise<Rental[]> {
    const response = await apiClient.get<ApiResponse<Rental[]>>('/rentals')
    return response.data.data || []
  },

  async getById(id: string): Promise<Rental> {
    const response = await apiClient.get<ApiResponse<Rental>>(`/rentals/${id}`)
    return response.data.data!
  },

  async getMyRentals(): Promise<Rental[]> {
    const response = await apiClient.get<ApiResponse<Rental[]>>('/rentals/my')
    return response.data.data || []
  },

  async getActiveRental(): Promise<Rental | null> {
    try {
      const response = await apiClient.get<ApiResponse<Rental>>('/rentals/my/active')
      return response.data.data || null
    } catch (error) {
      return null
    }
  },

  async rentBicycle(data: RentBicycleDto): Promise<Rental> {
    const response = await apiClient.post<ApiResponse<Rental>>('/rentals', data)
    return response.data.data!
  },

  async returnBicycle(id: string, data?: ReturnBicycleDto): Promise<Rental> {
    const response = await apiClient.put<ApiResponse<Rental>>(`/rentals/${id}/return`, data || {})
    return response.data.data!
  },

  async cancelRental(id: string): Promise<void> {
    await apiClient.delete(`/rentals/${id}`)
  },
}