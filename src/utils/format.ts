import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    return format(new Date(date), formatStr, { locale: es })
  } catch (error) {
    return ''
  }
}

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm')
}

export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'HH:mm')
}

export const formatRelativeTime = (date: string | Date): string => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })
  } catch (error) {
    return ''
  }
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-CO').format(num)
}

export const formatDuration = (hours: number): string => {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)

  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

export const formatPercentage = (value: number): string => {
  return `${value}%`
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}