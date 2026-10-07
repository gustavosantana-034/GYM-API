import { MapContainer, Marker, useMapEvents } from 'react-leaflet'
import type { Coordinates } from '@/types/geo'
import { createGymIcon } from './map-icons'
import { MapAutoResize } from './MapAutoResize'
import { MapTiles } from './MapTiles'

interface LocationPickerMapProps {
  value: Coordinates | null
  onChange: (position: Coordinates) => void
  fallbackCenter: Coordinates
}

function ClickHandler({ onChange }: { onChange: (position: Coordinates) => void }) {
  useMapEvents({
    click: (event) => onChange({ latitude: event.latlng.lat, longitude: event.latlng.lng }),
  })

  return null
}

/** Admin helper: click on the map (or drag the pin) to set a gym's position. */
export function LocationPickerMap({ value, onChange, fallbackCenter }: LocationPickerMapProps) {
  const center = value ?? fallbackCenter

  return (
    <MapContainer center={[center.latitude, center.longitude]} zoom={15} className="size-full">
      <MapTiles />
      <MapAutoResize />
      <ClickHandler onChange={onChange} />
      {value && (
        <Marker
          position={[value.latitude, value.longitude]}
          icon={createGymIcon({ active: true })}
          draggable
          eventHandlers={{
            dragend: (event) => {
              const { lat, lng } = event.target.getLatLng()
              onChange({ latitude: lat, longitude: lng })
            },
          }}
        />
      )}
    </MapContainer>
  )
}
