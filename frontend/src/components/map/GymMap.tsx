import L from 'leaflet'
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router'
import { MapContainer, Marker, Popup, useMap } from 'react-leaflet'
import type { GymWithDistance } from '@/hooks/use-gyms-with-distance'
import type { Coordinates } from '@/types/geo'
import { cn } from '@/utils/cn'
import { formatDistance } from '@/utils/format'
import { modalityLabel } from '@/utils/modalities'
import { createGymIcon, userIcon } from './map-icons'
import { MapAutoResize } from './MapAutoResize'
import { MapTiles } from './MapTiles'

interface GymMapProps {
  gyms: GymWithDistance[]
  userPosition: Coordinates | null
  activeGymId?: string | null
  onSelectGym?: (gymId: string) => void
  className?: string
}

const DEFAULT_CENTER: Coordinates = { latitude: -23.5614, longitude: -46.6559 }

/**
 * The first view frames the user and the closest gyms only; fitting every
 * result would zoom out until the nearby pins pile on top of each other.
 */
const GYMS_IN_INITIAL_VIEW = 6

/** Frames the user and every gym whenever the result set changes. */
function FitBounds({ points }: { points: Coordinates[] }) {
  const map = useMap()
  const signature = points.map((point) => `${point.latitude},${point.longitude}`).join('|')

  useEffect(() => {
    if (points.length === 0) return

    map.invalidateSize()

    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 15)
      return
    }

    const bounds = L.latLngBounds(points.map((point) => [point.latitude, point.longitude]))
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refit only when the points change
  }, [map, signature])

  return null
}

export function GymMap({ gyms, userPosition, activeGymId, onSelectGym, className }: GymMapProps) {
  const points = useMemo(
    () => [...(userPosition ? [userPosition] : []), ...gyms.slice(0, GYMS_IN_INITIAL_VIEW)],
    [gyms, userPosition],
  )

  const center = userPosition ?? gyms[0] ?? DEFAULT_CENTER

  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={14}
      zoomSnap={0.5}
      scrollWheelZoom
      className={cn('size-full', className)}
    >
      <MapTiles />
      <MapAutoResize />
      <FitBounds points={points} />

      {userPosition && (
        <Marker
          position={[userPosition.latitude, userPosition.longitude]}
          icon={userIcon}
          title="Você está aqui"
          keyboard={false}
          zIndexOffset={-100}
        />
      )}

      {gyms.map((gym) => (
        <Marker
          key={gym.id}
          position={[gym.latitude, gym.longitude]}
          icon={createGymIcon({ active: gym.id === activeGymId })}
          title={gym.title}
          alt={gym.title}
          eventHandlers={{ click: () => onSelectGym?.(gym.id) }}
        >
          <Popup>
            <div className="flex min-w-48 flex-col gap-2">
              <strong className="text-body font-bold text-text">{gym.title}</strong>
              {gym.distanceInKm !== null && (
                <span className="text-label font-semibold text-geo">
                  {formatDistance(gym.distanceInKm)} de você
                </span>
              )}
              {gym.modalities.length > 0 && (
                <span className="text-caption text-muted">
                  {gym.modalities.slice(0, 3).map(modalityLabel).join(' · ')}
                </span>
              )}
              <Link
                to={`/gyms/${gym.id}`}
                className="mt-1 inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-label font-semibold !text-on-primary"
              >
                Ver detalhes
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
