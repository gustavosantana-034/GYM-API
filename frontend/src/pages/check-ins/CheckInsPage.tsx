import { CalendarCheck } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCheckInHistory, useMetrics } from '@/hooks/use-check-ins'
import { formatMonthYear, pluralize } from '@/utils/format'
import { groupByMonth } from '@/utils/group-by-month'
import { CheckInItem } from './CheckInItem'

function HistorySkeleton() {
  return (
    <div role="status" aria-label="Carregando check-ins" className="flex flex-col gap-3">
      <Skeleton className="h-4 w-32" />
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  )
}

export function CheckInsPage() {
  const history = useCheckInHistory()
  const { data: metrics } = useMetrics()

  const checkIns = history.data?.pages.flat() ?? []
  const groups = groupByMonth(checkIns)

  return (
    <Page>
      <PageHeader
        title="Meus check-ins"
        description={
          metrics
            ? `${pluralize(metrics.checkInsCount, 'treino registrado', 'treinos registrados')} até agora.`
            : 'Todos os seus treinos registrados.'
        }
      />

      {history.isPending ? (
        <HistorySkeleton />
      ) : history.isError ? (
        <ErrorState
          title="Não conseguimos carregar seu histórico."
          onRetry={() => history.refetch()}
          isRetrying={history.isRefetching}
        />
      ) : checkIns.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck className="size-6" />}
          title="Você ainda não fez nenhum check-in."
          description="Encontre uma academia perto de você e registre seu primeiro treino."
          action={
            <ButtonLink to="/explore" size="sm">
              Encontrar academias
            </ButtonLink>
          }
        />
      ) : (
        <div className="flex max-w-3xl flex-col gap-8">
          {groups.map((group) => (
            <section key={group.key} aria-labelledby={`month-${group.key}`} className="flex flex-col gap-3">
              <h2
                id={`month-${group.key}`}
                className="text-caption font-bold tracking-[0.14em] text-subtle uppercase"
              >
                {formatMonthYear(group.date)}
              </h2>
              <ol className="flex flex-col gap-2">
                {group.items.map((checkIn) => (
                  <li key={checkIn.id}>
                    <CheckInItem checkIn={checkIn} />
                  </li>
                ))}
              </ol>
            </section>
          ))}

          {history.hasNextPage && (
            <Button
              variant="secondary"
              onClick={() => history.fetchNextPage()}
              isLoading={history.isFetchingNextPage}
            >
              Carregar mais
            </Button>
          )}
        </div>
      )}
    </Page>
  )
}
