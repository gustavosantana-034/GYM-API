import type { ComponentProps } from 'react'
import { cn } from '@/utils/cn'
import { Field } from './Field'
import { controlStyles, describedBy } from './field-styles'

interface TextareaProps extends ComponentProps<'textarea'> {
  id: string
  label: string
  error?: string
  hint?: string
}

export function Textarea({ id, label, error, hint, className, ...props }: TextareaProps) {
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(controlStyles, 'min-h-28 border-border py-3', className)}
        {...props}
      />
    </Field>
  )
}
