export const controlStyles =
  'w-full rounded-md border bg-surface-1 px-3.5 text-body text-text placeholder:text-subtle transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-60 aria-[invalid=true]:border-danger'

export function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}
