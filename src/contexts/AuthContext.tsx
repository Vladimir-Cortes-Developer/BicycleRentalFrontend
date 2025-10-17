import { createContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '../api'
import type { User, LoginDto, RegisterUserDto } from '../types'
import toast from 'react-hot-toast'
import { TOAST_MESSAGES } from '../constants'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (credentials: LoginDto) => Promise<void>
  register: (userData: RegisterUserDto) => Promise<void>
  logout: () => void
  updateUser: (userData: User) => void
  isAuthenticated: boolean
  isAdmin: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))

        // Verify token and get fresh user data
        try {
          const freshUser = await authService.getProfile()
          setUser(freshUser)
          localStorage.setItem('user', JSON.stringify(freshUser))
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
          setUser(null)
        }
      }

      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginDto) => {
    try {
      const response = await authService.login(credentials)
      const { user: userData, token: authToken } = response.data

      setUser(userData)
      setToken(authToken)
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(userData))

      toast.success(TOAST_MESSAGES.SUCCESS.LOGIN)
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: RegisterUserDto) => {
    try {
      const response = await authService.register(userData)
      const { user: newUser, token: authToken } = response.data

      setUser(newUser)
      setToken(authToken)
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(newUser))

      toast.success(TOAST_MESSAGES.SUCCESS.REGISTER)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setToken(null)
    toast.success(TOAST_MESSAGES.SUCCESS.LOGOUT)
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}