import { cn } from '@/utils/cn'
import { getInitials } from '@/utils/format'

const sizes = {
  sm: 'size-9 text-label',
  md: 'size-12 text-body',
  lg: 'size-20 text-h2',
}

interface AvatarProps {
  name: string
  size?: keyof typeof sizes
  className?: string
}

/** Initials avatar; the API does not store profile pictures. */
export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md bg-primary font-bold text-on-primary font-expanded',
        sizes[size],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  )
}
