import { Building2, Plus } from 'lucide-react'
import { Link } from 'react-router'
import { useState } from 'react'
import { ImportNearbyGymsButton } from '@/components/gym/ImportNearbyGymsButton'
import { ModalityList } from '@/components/gym/ModalityBadge'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SearchBar } from '@/components/ui/SearchBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGymSearch } from '@/hooks/use-gyms'

export function AdminGymsPage() {
  const [query, setQuery] = useState('')
  const gyms = useGymSearch({ query: query || undefined })
  const items = gyms.data?.pages.flat() ?? []

  return (
    <section aria-labelledby="admin-gyms-title" className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="admin-gyms-title" className="text-h2 font-bold">
          Academias
        </h2>
        <div className="flex flex-wrap gap-2">
          <ImportNearbyGymsButton />
          <ButtonLink to="/admin/gyms/new">
            <Plus aria-hidden className="size-4" />
            Nova academia
          </ButtonLink>
        </div>
      </div>

      <SearchBar placeholder="Buscar por nome ou endereço..." onSearch={setQuery} />

      {gyms.isPending ? (
        <div role="status" aria-label="Carregando academias" className="flex flex-col gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : gyms.isError ? (
        <ErrorState title="Não conseguimos carregar as academias." onRetry={() => gyms.refetch()} isRetrying={gyms.isRefetching} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Building2 className="size-6" />}
          title={query ? 'Nenhuma academia encontrada.' : 'Nenhuma academia cadastrada.'}
          description={
            query
              ? 'Tente outro nome ou endereço.'
              : 'Importe as academias reais da sua região ou cadastre uma manualmente.'
          }
          action={!query && <ImportNearbyGymsButton variant="primary" />}
        />
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface-1">
          {items.map((gym) => (
            <li key={gym.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Link to={`/gyms/${gym.id}`} className="text-body font-bold hover:underline">
                  {gym.title}
                </Link>
                {gym.address && <p className="truncate text-label text-muted">{gym.address}</p>}
                <ModalityList modalities={gym.modalities} max={4} />
              </div>
              <ButtonLink to={`/admin/gyms/${gym.id}/edit`} variant="secondary" size="sm">
                Editar
              </ButtonLink>
            </li>
          ))}
        </ul>
      )}

      {gyms.hasNextPage && (
        <Button variant="secondary" onClick={() => gyms.fetchNextPage()} isLoading={gyms.isFetchingNextPage}>
          Carregar mais
        </Button>
      )}
    </section>
  )
}
