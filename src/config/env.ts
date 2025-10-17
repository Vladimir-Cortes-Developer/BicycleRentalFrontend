/**
 * Environment configuration
 * This file exports environment variables with proper typing and defaults
 */

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  mapApiKey: import.meta.env.VITE_MAP_API_KEY || '',
  env: import.meta.env.VITE_ENV || 'development',
  isDevelopment: import.meta.env.VITE_ENV === 'development' || import.meta.env.DEV,
  isProduction: import.meta.env.VITE_ENV === 'production' || import.meta.env.PROD,
  isStaging: import.meta.env.VITE_ENV === 'staging',
} as const

export default config