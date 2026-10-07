import { CircleCheck, Clock } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/Badge'
import type { CheckInWithGym } from '@/types/api'
import { dayjs, formatTime } from '@/utils/format'

export function CheckInItem({ checkIn }: { checkIn: CheckInWithGym }) {
  const date = dayjs(checkIn.created_at)

  return (
    <article className="flex items-center gap-4 rounded-lg border border-border bg-surface-1 p-4">
      <time
        dateTime={checkIn.created_at}
        className="flex w-12 shrink-0 flex-col items-center border-r border-border pr-4"
      >
        <span className="text-h2 leading-none font-extrabold tabular font-expanded">{date.format('DD')}</span>
        <span className="mt-1 text-caption font-semibold text-muted uppercase">{date.format('ddd')}</span>
      </time>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link to={`/gyms/${checkIn.gym.id}`} className="truncate text-body font-bold text-text hover:underline">
          {checkIn.gym.title}
        </Link>
        <p className="text-label text-muted">
          {date.format('DD/MM/YYYY')} · {formatTime(checkIn.created_at)}
        </p>
      </div>

      {checkIn.validated_at ? (
        <Badge tone="success" icon={<CircleCheck aria-hidden className="size-3.5" />}>
          Validado
        </Badge>
      ) : (
        <Badge tone="warning" icon={<Clock aria-hidden className="size-3.5" />}>
          Pendente
        </Badge>
      )}
    </article>
  )
}
