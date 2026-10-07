import { ArrowLeft, MapPin, Phone, SearchX } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { getErrorStatus } from '@/api/errors'
import { CheckInPanel } from '@/components/check-in/CheckInPanel'
import { DistanceTag } from '@/components/gym/DistanceTag'
import { ModalityBadge } from '@/components/gym/ModalityBadge'
import { LazyGymMap } from '@/components/map/LazyGymMap'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Page } from '@/components/ui/Page'
import { useCurrentUser } from '@/features/auth/auth-context'
import { useLocation } from '@/features/location/location-context'
import { useGym } from '@/hooks/use-gyms'
import { useGymsWithDistance } from '@/hooks/use-gyms-with-distance'
import type { Gym } from '@/types/api'
import { GymDetailsSkeleton } from './GymDetailsSkeleton'

function BackButton() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      // Go back to the list (keeping its filters) or to Explore on a direct visit
      onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/explore'))}
      className="-ml-2 inline-flex h-10 w-fit items-center gap-2 rounded-md px-2 text-label font-semibold text-muted hover:bg-surface-2 hover:text-text"
    >
      <ArrowLeft aria-hidden className="size-4" />
      Voltar
    </button>
  )
}

export function GymDetailsPage() {
  const { gymId = '' } = useParams()
  const { data: gym, isPending, isError, error, refetch, isRefetching } = useGym(gymId)

  if (isPending) return <GymDetailsSkeleton />

  if (isError) {
    const isNotFound = [400, 404].includes(getErrorStatus(error) ?? 0)

    return (
      <Page>
        <BackButton />
        {isNotFound ? (
          <EmptyState
            icon={<SearchX className="size-6" />}
            title="Academia não encontrada."
            description="Ela pode ter sido removida ou o link está incorreto."
            action={
              <ButtonLink to="/explore" variant="secondary" size="sm">
                Explorar academias
              </ButtonLink>
            }
          />
        ) : (
          <ErrorState title="Não conseguimos carregar esta academia." onRetry={() => refetch()} isRetrying={isRefetching} />
        )}
      </Page>
    )
  }

  return <GymDetails gym={gym} />
}

function GymDetails({ gym }: { gym: Gym }) {
  const user = useCurrentUser()
  const { position } = useLocation()
  const [gymWithDistance] = useGymsWithDistance([gym], position)

  return (
    <Page>
      <BackButton />

      <header className="flex flex-col gap-4 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {gymWithDistance.distanceInKm !== null && <DistanceTag distanceInKm={gymWithDistance.distanceInKm} />}
          {gym.address && (
            <span className="inline-flex items-center gap-1.5 text-label text-muted">
              <MapPin aria-hidden className="size-4" />
              {gym.address}
            </span>
          )}
        </div>
        <h1 className="text-h1 font-extrabold tracking-tight uppercase font-expanded sm:text-display">{gym.title}</h1>
        {user.role === 'ADMIN' && (
          <Link
            to={`/admin/gyms/${gym.id}/edit`}
            className="w-fit text-label font-semibold text-primary-ink hover:underline"
          >
            Editar academia
          </Link>
        )}
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="flex flex-col gap-8">
          <section aria-labelledby="about-title" className="flex flex-col gap-3">
            <h2 id="about-title" className="text-h3 font-bold">
              Sobre
            </h2>
            <p className="text-body text-muted">
              {gym.description ?? 'Esta academia ainda não adicionou uma descrição.'}
            </p>
          </section>

          {gym.modalities.length > 0 && (
            <section aria-labelledby="modalities-title" className="flex flex-col gap-3">
              <h2 id="modalities-title" className="text-h3 font-bold">
                Modalidades
              </h2>
              <ul className="flex flex-wrap gap-2">
                {gym.modalities.map((modality) => (
                  <li key={modality}>
                    <ModalityBadge modality={modality} className="px-3 py-2 text-label" />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {gym.phone && (
            <section aria-labelledby="contact-title" className="flex flex-col gap-3">
              <h2 id="contact-title" className="text-h3 font-bold">
                Contato
              </h2>
              <a
                href={`tel:${gym.phone.replace(/[^\d+]/g, '')}`}
                className="inline-flex w-fit items-center gap-2 text-body font-semibold text-text hover:text-primary-ink"
              >
                <Phone aria-hidden className="size-4" />
                {gym.phone}
              </a>
            </section>
          )}

          <section aria-label="Localização no mapa" className="h-72 overflow-hidden rounded-lg border border-border">
            <LazyGymMap gyms={[gymWithDistance]} userPosition={position} activeGymId={gym.id} />
          </section>

          {gym.source === 'osm' && gym.osm_id && (
            <p className="text-caption text-subtle">
              Dados da academia ©{' '}
              <a
                href={`https://www.openstreetmap.org/${gym.osm_id}`}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-text"
              >
                colaboradores do OpenStreetMap
              </a>{' '}
              (ODbL). Viu algo errado? Você pode corrigir lá.
            </p>
          )}
        </div>

        <aside aria-label="Check-in" className="order-first lg:sticky lg:top-10 lg:order-none">
          <CheckInPanel gym={gym} />
        </aside>
      </div>
    </Page>
  )
}
