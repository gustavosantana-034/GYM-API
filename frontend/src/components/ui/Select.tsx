import { ChevronDown } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/utils/cn'
import { Field } from './Field'
import { controlStyles, describedBy } from './field-styles'

interface SelectProps extends ComponentProps<'select'> {
  id: string
  label: string
  options: { value: string; label: string }[]
  error?: string
  hint?: string
}

export function Select({ id, label, options, error, hint, className, ...props }: SelectProps) {
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(controlStyles, 'h-12 appearance-none border-border pr-10', className)}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
        />
      </div>
    </Field>
  )
}
