import { useState, useEffect } from 'react'
import { eventService } from '../api'
import type { Event } from '../types'

export const useEvents = (initialFetch = true) => {
  const [events, setEvents] = useState<Event[]>([])
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await eventService.getAll()
      setEvents(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar los eventos')
    } finally {
      setLoading(false)
    }
  }

  const fetchUpcoming = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await eventService.getUpcoming()
      setEvents(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar los eventos próximos')
    } finally {
      setLoading(false)
    }
  }

  const fetchMyEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await eventService.getMyEvents()
      setMyEvents(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar mis eventos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialFetch) {
      fetchUpcoming()
    }
  }, [initialFetch])

  return {
    events,
    myEvents,
    loading,
    error,
    fetchEvents,
    fetchUpcoming,
    fetchMyEvents,
    setEvents,
  }
}