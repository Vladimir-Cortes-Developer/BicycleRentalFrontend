import apiClient from './client'
import type {
  DashboardStats,
  RevenueReport,
  BicycleRentalStats,
  UserStratumReport,
  ApiResponse,
} from '../types'

export const reportService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/reports/dashboard')
    return response.data.data!
  },

  async getMonthlyRevenue(year: number, month: number): Promise<RevenueReport> {
    const response = await apiClient.get<ApiResponse<RevenueReport>>('/reports/revenue/monthly', {
      params: { year, month },
    })
    return response.data.data!
  },

  async getRevenueByDateRange(startDate: string, endDate: string): Promise<RevenueReport[]> {
    const response = await apiClient.get<ApiResponse<RevenueReport[]>>('/reports/revenue/range', {
      params: { startDate, endDate },
    })
    return response.data.data || []
  },

  async getRevenueByRegional(regionalId?: string): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>('/reports/revenue/regional', {
      params: { regionalId },
    })
    return response.data.data!
  },

  async getMostRentedBicycles(limit?: number): Promise<BicycleRentalStats[]> {
    const response = await apiClient.get<ApiResponse<BicycleRentalStats[]>>(
      '/reports/bicycles/most-rented',
      {
        params: { limit },
      }
    )
    return response.data.data || []
  },

  async getUsersByStratum(): Promise<UserStratumReport[]> {
    const response = await apiClient.get<ApiResponse<UserStratumReport[]>>('/reports/users/stratum')
    return response.data.data || []
  },

  async getDiscountReport(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>('/reports/discounts')
    return response.data.data!
  },
}