import type { BicycleStatus, EventStatus, RentalStatus } from '../types'
import { BICYCLE_STATUS, EVENT_STATUS, RENTAL_STATUS, SOCIOECONOMIC_STRATA } from '../constants'

export const getBicycleStatusBadge = (status: BicycleStatus) => {
  return BICYCLE_STATUS[status.toUpperCase() as keyof typeof BICYCLE_STATUS] || BICYCLE_STATUS.AVAILABLE
}

export const getEventStatusBadge = (status: EventStatus) => {
  return EVENT_STATUS[status.toUpperCase() as keyof typeof EVENT_STATUS] || EVENT_STATUS.DRAFT
}

export const getRentalStatusBadge = (status: RentalStatus) => {
  return RENTAL_STATUS[status.toUpperCase() as keyof typeof RENTAL_STATUS] || RENTAL_STATUS.ACTIVE
}

export const getDiscountByStratum = (stratum: number): number => {
  const stratumData = SOCIOECONOMIC_STRATA.find((s) => s.value === stratum)
  return stratumData?.discount || 0
}

export const calculateRentalCost = (
  pricePerHour: number,
  hours: number,
  stratum?: number
): { subtotal: number; discount: number; total: number } => {
  const subtotal = pricePerHour * hours
  const discountPercentage = stratum ? getDiscountByStratum(stratum) : 0
  const discount = (subtotal * discountPercentage) / 100
  const total = subtotal - discount

  return {
    subtotal,
    discount,
    total,
  }
}

export const calculateHoursBetweenDates = (startDate: string | Date, endDate: string | Date): number => {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const diff = end - start
  return diff / (1000 * 60 * 60) // Convert milliseconds to hours
}

export const isEventUpcoming = (eventDate: string): boolean => {
  return new Date(eventDate) > new Date()
}

export const isEventPast = (eventDate: string): boolean => {
  return new Date(eventDate) < new Date()
}

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ')
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const downloadFile = (data: Blob, filename: string) => {
  const url = window.URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}