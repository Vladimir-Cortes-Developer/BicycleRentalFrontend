import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, TOAST_MESSAGES } from '../constants'
import toast from 'react-hot-toast'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<{ message?: string; error?: string }>) => {
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.response.data?.error

      switch (status) {
        case 401:
          toast.error(TOAST_MESSAGES.ERROR.UNAUTHORIZED)
          // Clear token and redirect to login
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break
        case 403:
          toast.error('No tienes permisos para realizar esta acción')
          break
        case 404:
          toast.error(message || TOAST_MESSAGES.ERROR.NOT_FOUND)
          break
        case 422:
          toast.error(message || TOAST_MESSAGES.ERROR.VALIDATION)
          break
        case 500:
          toast.error('Error del servidor. Intenta más tarde')
          break
        default:
          toast.error(message || TOAST_MESSAGES.ERROR.GENERIC)
      }
    } else if (error.request) {
      toast.error(TOAST_MESSAGES.ERROR.NETWORK)
    } else {
      toast.error(TOAST_MESSAGES.ERROR.GENERIC)
    }

    return Promise.reject(error)
  }
)

export default apiClient