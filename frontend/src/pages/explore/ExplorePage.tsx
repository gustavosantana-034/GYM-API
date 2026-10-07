import { List, Map as MapIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { LocationPrompt } from '@/components/location/LocationPrompt'
import { LazyGymMap } from '@/components/map/LazyGymMap'
import { Page } from '@/components/ui/Page'
import { SearchBar } from '@/components/ui/SearchBar'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Skeleton } from '@/components/ui/Skeleton'
import { useLocation } from '@/features/location/location-context'
import { useIsDesktop } from '@/hooks/use-media-query'
import { modalityLabel } from '@/utils/modalities'
import { pluralize } from '@/utils/format'
import { ExploreFilters } from './ExploreFilters'
import { ExploreResults } from './ExploreResults'
import { useExploreFilters } from './use-explore-filters'
import { useExploreResults } from './use-explore-results'

export function ExplorePage() {
  const filters = useExploreFilters()
  const results = useExploreResults(filters)
  const { status: locationStatus } = useLocation()
  const isDesktop = useIsDesktop()
  const [activeGymId, setActiveGymId] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  function changeView(view: typeof filters.view) {
    filters.setView(view)

    // On phones the map sits below the filters: bring it into view
    if (view === 'map') {
      requestAnimationFrame(() => mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }

  const showMap = isDesktop || filters.view === 'map'
  const showList = isDesktop || filters.view === 'list'

  const withoutLocation = !results.position && !filters.textQuery

  const summary = [
    pluralize(results.gyms.length, 'academia', 'academias'),
    results.mode === 'nearby' && `em até ${filters.radius} km de você`,
    withoutLocation && 'cadastradas (sem sua localização, sem filtro de distância)',
    filters.modality && `com ${modalityLabel(filters.modality)}`,
    filters.textQuery && `para “${filters.textQuery}”`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Page className="gap-6">
      <header className="flex flex-col gap-5">
        <h1 className="text-h1 font-extrabold font-expanded">Academias perto de você</h1>
        <SearchBar key={filters.query} defaultValue={filters.query} onSearch={filters.setQuery} />
        <ExploreFilters
          modality={filters.modality}
          onModalityChange={filters.setModality}
          radius={filters.radius}
          onRadiusChange={filters.setRadius}
          showRadius={results.mode === 'nearby'}
        />
      </header>

      {locationStatus !== 'granted' && (
        <LocationPrompt compact description="Use sua localização para ver as academias mais próximas e a distância até cada uma." />
      )}

      <div className="flex items-center justify-between gap-4">
        <p aria-live="polite" className="text-label font-medium text-muted">
          {results.isPending ? <Skeleton className="h-4 w-40" /> : summary}
        </p>
        <SegmentedControl
          label="Forma de visualização"
          className="lg:hidden"
          value={filters.view}
          onChange={changeView}
          segments={[
            { value: 'list', label: 'Lista', icon: <List aria-hidden className="size-4" /> },
            { value: 'map', label: 'Mapa', icon: <MapIcon aria-hidden className="size-4" /> },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(22rem,26rem)_minmax(0,1fr)] lg:items-start">
        {showList && (
          <ExploreResults
            results={results}
            activeGymId={activeGymId}
            onFocusGym={setActiveGymId}
            onClearFilters={filters.clearFilters}
            hasFilters={filters.hasFilters}
          />
        )}
        {showMap && (
          <div
            ref={mapRef}
            className="h-[calc(100dvh-9rem)] min-h-96 scroll-mt-20 overflow-hidden rounded-lg border border-border lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)]"
          >
            <LazyGymMap
              gyms={results.gyms}
              userPosition={results.position}
              activeGymId={activeGymId}
              onSelectGym={setActiveGymId}
            />
          </div>
        )}
      </div>
    </Page>
  )
}
