import { ClipboardCheck } from 'lucide-react'
import { useState } from 'react'
import type { CheckInStatus } from '@/api/services/check-ins'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAdminCheckIns } from '@/hooks/use-check-ins'
import { useNow } from '@/hooks/use-now'
import { AdminCheckInItem } from './AdminCheckInItem'

type Filter = CheckInStatus | 'all'

const emptyCopy: Record<Filter, string> = {
  pending: 'Nenhum check-in aguardando validação.',
  validated: 'Nenhum check-in validado ainda.',
  all: 'Nenhum check-in registrado ainda.',
}

export function AdminCheckInsPage() {
  const [filter, setFilter] = useState<Filter>('pending')
  const now = useNow()
  const checkIns = useAdminCheckIns(filter === 'all' ? undefined : filter)
  const items = checkIns.data?.pages.flat() ?? []

  return (
    <section aria-labelledby="admin-check-ins-title" className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 id="admin-check-ins-title" className="text-h2 font-bold">
            Validação de check-ins
          </h2>
          <p className="text-label text-muted">Um check-in só pode ser validado até 20 minutos depois de criado.</p>
        </div>
        <SegmentedControl<Filter>
          label="Filtrar check-ins"
          value={filter}
          onChange={setFilter}
          segments={[
            { value: 'pending', label: 'Pendentes' },
            { value: 'validated', label: 'Validados' },
            { value: 'all', label: 'Todos' },
          ]}
        />
      </div>

      {checkIns.isPending ? (
        <div role="status" aria-label="Carregando check-ins" className="flex flex-col gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : checkIns.isError ? (
        <ErrorState
          title="Não conseguimos carregar os check-ins."
          onRetry={() => checkIns.refetch()}
          isRetrying={checkIns.isRefetching}
        />
      ) : items.length === 0 ? (
        <EmptyState icon={<ClipboardCheck className="size-6" />} title={emptyCopy[filter]} />
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((checkIn) => (
            <li key={checkIn.id}>
              <AdminCheckInItem checkIn={checkIn} now={now} />
            </li>
          ))}
        </ul>
      )}

      {checkIns.hasNextPage && (
        <Button variant="secondary" onClick={() => checkIns.fetchNextPage()} isLoading={checkIns.isFetchingNextPage}>
          Carregar mais
        </Button>
      )}
    </section>
  )
}
