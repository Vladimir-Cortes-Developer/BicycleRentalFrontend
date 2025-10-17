import { useState, useEffect } from 'react'
import { rentalService } from '../api'
import type { Rental } from '../types'

export const useRental = () => {
  const [activeRental, setActiveRental] = useState<Rental | null>(null)
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchActiveRental = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await rentalService.getActiveRental()
      setActiveRental(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar el alquiler activo')
    } finally {
      setLoading(false)
    }
  }

  const fetchMyRentals = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await rentalService.getMyRentals()
      setRentals(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar el historial de alquileres')
    } finally {
      setLoading(false)
    }
  }

  const hasActiveRental = !!activeRental

  useEffect(() => {
    fetchActiveRental()
  }, [])

  return {
    activeRental,
    rentals,
    loading,
    error,
    hasActiveRental,
    fetchActiveRental,
    fetchMyRentals,
    setActiveRental,
  }
}