import { createContext, useContext } from 'react'
import type { Coordinates } from '@/types/geo'

export type LocationStatus =
  | 'idle' // never asked: show an explanation before asking
  | 'locating'
  | 'granted'
  | 'denied' // the user (or browser settings) refused
  | 'unavailable' // no geolocation support or no position fix
  | 'timeout'

export interface LocationState {
  status: LocationStatus
  position: Coordinates | null
  /** Accuracy radius in meters reported by the device. */
  accuracy: number | null
}

export interface LocationContextValue extends LocationState {
  /** Asks the browser for the position. `fresh` skips cached positions. */
  requestLocation: (options?: { fresh?: boolean }) => Promise<Coordinates | null>
}

export const LocationContext = createContext<LocationContextValue | null>(null)

export function useLocation() {
  const context = useContext(LocationContext)

  if (!context) {
    throw new Error('useLocation must be used inside <LocationProvider>')
  }

  return context
}
