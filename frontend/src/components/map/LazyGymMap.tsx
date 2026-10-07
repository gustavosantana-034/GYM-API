import { lazy, Suspense, type ComponentProps } from 'react'
import { MapSkeleton } from './MapSkeleton'

// Leaflet is only downloaded when a map is actually shown
const GymMap = lazy(() => import('./GymMap').then((module) => ({ default: module.GymMap })))

export function LazyGymMap(props: ComponentProps<typeof GymMap>) {
  return (
    <Suspense fallback={<MapSkeleton />}>
      <GymMap {...props} />
    </Suspense>
  )
}
