import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { LocationPrompt } from '@/components/location/LocationPrompt'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { useCurrentUser } from '@/features/auth/auth-context'
import { useLocation } from '@/features/location/location-context'
import { useNearbyGyms } from '@/hooks/use-gyms'
import { useGymsWithDistance } from '@/hooks/use-gyms-with-distance'
import { GymListSkeleton } from './GymCardSkeleton'
import { ImportNearbyGymsButton } from './ImportNearbyGymsButton'
import { GymList } from './GymList'

const PREVIEW_SIZE = 3

/** Home section answering "what is near me?" with the closest gyms. */
export function NearbyGymsPreview() {
  const user = useCurrentUser()
  const { status, position } = useLocation()
  const nearby = useNearbyGyms(position && { ...position, radius: 10 })
  const gyms = useGymsWithDistance(nearby.data, position)

  return (
    <section aria-labelledby="nearby-title" className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <h2 id="nearby-title" className="text-h2 font-bold">
          Academias próximas
        </h2>
        {status === 'granted' && gyms.length > 0 && (
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-label font-semibold text-primary-ink hover:underline"
          >
            Ver no mapa
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        )}
      </div>

      {status !== 'granted' ? (
        <LocationPrompt
          compact
          fallback={
            <Link to="/explore" className="inline-flex h-11 items-center px-2 text-label font-semibold text-muted hover:text-text">
              Buscar pelo nome
            </Link>
          }
        />
      ) : nearby.isPending ? (
        <GymListSkeleton count={PREVIEW_SIZE} />
      ) : nearby.isError ? (
        <ErrorState
          title="Não conseguimos carregar as academias."
          onRetry={() => nearby.refetch()}
          isRetrying={nearby.isRefetching}
        />
      ) : gyms.length === 0 ? (
        <EmptyState
          title="Nenhuma academia encontrada por perto."
          description="Não há academias num raio de 10 km. Tente buscar pelo nome ou aumentar a distância."
          action={
            user.role === 'ADMIN' ? (
              <ImportNearbyGymsButton variant="primary" />
            ) : (
              <Link to="/explore" className="text-label font-semibold text-primary-ink hover:underline">
                Explorar academias
              </Link>
            )
          }
        />
      ) : (
        <GymList gyms={gyms.slice(0, PREVIEW_SIZE)} />
      )}
    </section>
  )
}
