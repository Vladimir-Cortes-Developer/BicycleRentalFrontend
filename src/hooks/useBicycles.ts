import { useState, useEffect } from 'react'
import { bicycleService } from '../api'
import type { Bicycle, BicycleStatus } from '../types'

export const useBicycles = (initialFetch = true) => {
  const [bicycles, setBicycles] = useState<Bicycle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBicycles = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await bicycleService.getAll()
      setBicycles(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar las bicicletas')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailable = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await bicycleService.getAvailable()
      setBicycles(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar las bicicletas disponibles')
    } finally {
      setLoading(false)
    }
  }

  const filterByStatus = (status: BicycleStatus) => {
    return bicycles.filter((b) => b.status === status)
  }

  useEffect(() => {
    if (initialFetch) {
      fetchBicycles()
    }
  }, [initialFetch])

  return {
    bicycles,
    loading,
    error,
    fetchBicycles,
    fetchAvailable,
    filterByStatus,
    setBicycles,
  }
}