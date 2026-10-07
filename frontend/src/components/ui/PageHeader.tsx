import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <p className="text-caption font-semibold tracking-[0.12em] text-primary-ink uppercase">{eyebrow}</p>
        )}
        <h1 className="text-h1 font-extrabold font-expanded">{title}</h1>
        {description && <p className="max-w-xl text-body text-muted">{description}</p>}
      </div>
      {actions}
    </header>
  )
}
