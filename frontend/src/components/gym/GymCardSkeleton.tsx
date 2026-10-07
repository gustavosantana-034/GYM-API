import { Skeleton } from '@/components/ui/Skeleton'

export function GymCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-lg border border-border bg-surface-1 p-4">
      <div className="flex w-16 flex-col gap-2 border-r border-border pr-4">
        <Skeleton className="h-7 w-10" />
        <Skeleton className="h-3 w-6" />
      </div>
      <div className="flex flex-1 flex-col gap-2.5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  )
}

export function GymListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div role="status" aria-label="Carregando academias" className="flex flex-col gap-3">
      {Array.from({ length: count }, (_, index) => (
        <GymCardSkeleton key={index} />
      ))}
    </div>
  )
}
