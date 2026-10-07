import { Search, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { cn } from '@/utils/cn'

interface SearchBarProps {
  defaultValue?: string
  placeholder?: string
  onSearch: (query: string) => void
  className?: string
  autoFocus?: boolean
}

export function SearchBar({
  defaultValue = '',
  placeholder = 'Buscar academia, modalidade ou endereço...',
  onSearch,
  className,
  autoFocus,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSearch(value.trim())
  }

  function handleClear() {
    setValue('')
    onSearch('')
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={cn('relative', className)}>
      <label htmlFor="search" className="sr-only">
        Buscar academias
      </label>
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
      <input
        id="search"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        enterKeyHint="search"
        className="h-13 w-full rounded-md border border-border bg-surface-1 pr-12 pl-12 text-body text-text placeholder:text-subtle transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpar busca"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-2 text-muted hover:bg-surface-2 hover:text-text"
        >
          <X aria-hidden className="size-4" />
        </button>
      )}
    </form>
  )
}
