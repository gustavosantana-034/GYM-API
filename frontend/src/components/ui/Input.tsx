import type { ComponentProps } from 'react'
import { cn } from '@/utils/cn'
import { Field } from './Field'
import { controlStyles, describedBy } from './field-styles'

interface InputProps extends ComponentProps<'input'> {
  id: string
  label: string
  error?: string
  hint?: string
}

export function Input({ id, label, error, hint, className, ...props }: InputProps) {
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(controlStyles, 'h-12 border-border', className)}
        {...props}
      />
    </Field>
  )
}
