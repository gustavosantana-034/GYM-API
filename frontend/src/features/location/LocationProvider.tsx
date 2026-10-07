import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Coordinates } from '@/types/geo'
import { LocationContext, type LocationState, type LocationStatus } from './location-context'

const isSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator

const statusByErrorCode: Record<number, LocationStatus> = {
  1: 'denied', // PERMISSION_DENIED
  2: 'unavailable', // POSITION_UNAVAILABLE
  3: 'timeout', // TIMEOUT
}

/**
 * Shares the user's position across the app. It never prompts on its own:
 * screens explain why they need the location and call requestLocation().
 * If permission was already granted in a previous visit, it locates silently.
 */
export function LocationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LocationState>({
    status: isSupported ? 'idle' : 'unavailable',
    position: null,
    accuracy: null,
  })

  const requestLocation = useCallback(({ fresh = false } = {}) => {
    if (!isSupported) return Promise.resolve(null)

    setState((current) => ({ ...current, status: 'locating' }))

    return new Promise<Coordinates | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const position = { latitude: coords.latitude, longitude: coords.longitude }
          setState({ status: 'granted', position, accuracy: coords.accuracy })
          resolve(position)
        },
        (error) => {
          setState((current) => ({
            ...current,
            status: statusByErrorCode[error.code] ?? 'unavailable',
          }))
          resolve(null)
        },
        { enableHighAccuracy: true, timeout: 15_000, maximumAge: fresh ? 0 : 60_000 },
      )
    })
  }, [])

  useEffect(() => {
    if (!isSupported || !navigator.permissions) return

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((permission) => {
        if (permission.state === 'granted') requestLocation()
        if (permission.state === 'denied') {
          setState((current) => ({ ...current, status: 'denied' }))
        }
      })
      .catch(() => undefined)
  }, [requestLocation])

  const value = useMemo(() => ({ ...state, requestLocation }), [state, requestLocation])

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}
