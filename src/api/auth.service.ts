import apiClient from './client'
import type { LoginDto, RegisterUserDto, AuthResponse, ApiResponse, User } from '../types'

export const authService = {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  async register(userData: RegisterUserDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData)
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me')
    return response.data.data!
  },

  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}