import L from 'leaflet'

/**
 * Markers are plain HTML (divIcon) styled by the design tokens, so they follow
 * the theme and need no image assets.
 */
export function createGymIcon({ active }: { active: boolean }) {
  return L.divIcon({
    className: 'gym-marker',
    html: `<span class="gym-pin${active ? ' gym-pin--active' : ''}"><span></span></span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -14],
  })
}

export const userIcon = L.divIcon({
  className: 'gym-marker',
  html: '<span class="user-pin" aria-hidden="true"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})
