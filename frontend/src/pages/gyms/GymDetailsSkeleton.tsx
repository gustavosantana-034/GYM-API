import { Skeleton } from '@/components/ui/Skeleton'

export function GymDetailsSkeleton() {
  return (
    <div role="status" aria-label="Carregando academia" className="flex flex-col gap-8">
      <Skeleton className="h-10 w-24" />
      <div className="flex flex-col gap-4 border-b border-border pb-8">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-14 w-3/4" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="mt-4 h-72 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}
