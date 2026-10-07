import { SearchX } from 'lucide-react'
import { GymListSkeleton } from '@/components/gym/GymCardSkeleton'
import { GymList } from '@/components/gym/GymList'
import { ImportNearbyGymsButton } from '@/components/gym/ImportNearbyGymsButton'
import { useCurrentUser } from '@/features/auth/auth-context'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import type { useExploreResults } from './use-explore-results'

interface ExploreResultsProps {
  results: ReturnType<typeof useExploreResults>
  activeGymId: string | null
  onFocusGym: (gymId: string) => void
  onClearFilters: () => void
  hasFilters: boolean
}

export function ExploreResults({
  results,
  activeGymId,
  onFocusGym,
  onClearFilters,
  hasFilters,
}: ExploreResultsProps) {
  const user = useCurrentUser()

  if (results.isPending) return <GymListSkeleton />

  if (results.isError) {
    return (
      <ErrorState
        title="Não conseguimos carregar as academias."
        description="Verifique sua conexão e tente novamente."
        onRetry={results.refetch}
        isRetrying={results.isRefetching}
      />
    )
  }

  if (results.gyms.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="size-6" />}
        title={results.mode === 'nearby' ? 'Nenhuma academia encontrada por perto.' : 'Nenhuma academia encontrada.'}
        description={
          results.mode === 'nearby'
            ? 'Tente aumentar a distância da busca ou escolher outra modalidade.'
            : 'Confira a grafia ou busque por outro nome, bairro ou modalidade.'
        }
        action={
          hasFilters ? (
            <Button variant="secondary" size="sm" onClick={onClearFilters}>
              Limpar filtros
            </Button>
          ) : (
            user.role === 'ADMIN' && results.mode === 'nearby' && <ImportNearbyGymsButton variant="primary" />
          )
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <GymList gyms={results.gyms} activeGymId={activeGymId} onFocusGym={onFocusGym} />
      {results.hasNextPage && (
        <Button
          variant="secondary"
          fullWidth
          onClick={results.fetchNextPage}
          isLoading={results.isFetchingNextPage}
        >
          Carregar mais academias
        </Button>
      )}
    </div>
  )
}
