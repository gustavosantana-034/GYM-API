import { CircleCheck } from 'lucide-react'
import { Link } from 'react-router'
import { useCheckInHistory } from '@/hooks/use-check-ins'
import { dayjs } from '@/utils/format'

/** Tells whether today's workout is already registered. */
export function TodayStatus() {
  const { data } = useCheckInHistory()
  const lastCheckIn = data?.pages[0]?.[0]
  const checkedInToday = lastCheckIn && dayjs(lastCheckIn.created_at).isSame(dayjs(), 'day')

  if (checkedInToday) {
    return (
      <p className="flex items-center gap-2 text-body text-muted">
        <CircleCheck aria-hidden className="size-5 text-success" />
        Treino de hoje registrado em{' '}
        <Link to={`/gyms/${lastCheckIn.gym.id}`} className="font-semibold text-text hover:underline">
          {lastCheckIn.gym.title}
        </Link>
        .
      </p>
    )
  }

  return <p className="text-body text-muted">Pronto para o próximo treino?</p>
}
