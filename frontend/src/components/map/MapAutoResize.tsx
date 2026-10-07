import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

/**
 * Leaflet measures its container once. When the layout changes after mount
 * (lazy loading, view toggles, rotation) it must be told to measure again.
 */
export function MapAutoResize() {
  const map = useMap()

  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(map.getContainer())
    return () => observer.disconnect()
  }, [map])

  return null
}
