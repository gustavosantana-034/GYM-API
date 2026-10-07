import { lazy, Suspense, type ComponentProps } from 'react'
import { MapSkeleton } from './MapSkeleton'

const LocationPickerMap = lazy(() =>
  import('./LocationPickerMap').then((module) => ({ default: module.LocationPickerMap })),
)

export function LazyLocationPickerMap(props: ComponentProps<typeof LocationPickerMap>) {
  return (
    <Suspense fallback={<MapSkeleton />}>
      <LocationPickerMap {...props} />
    </Suspense>
  )
}
