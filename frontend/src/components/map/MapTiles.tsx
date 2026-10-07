import { TileLayer } from 'react-leaflet'

/**
 * OpenStreetMap standard tiles: free, no API key (attribution required).
 * The dark theme darkens them with a CSS filter (see .map-tiles in
 * index.css) instead of depending on a paid dark basemap.
 */
export function MapTiles() {
  return (
    <TileLayer
      className="map-tiles"
      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      maxZoom={19}
    />
  )
}
