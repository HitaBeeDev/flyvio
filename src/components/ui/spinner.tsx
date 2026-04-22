import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type SpinnerProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
} satisfies Record<NonNullable<SpinnerProps['size']>, string>

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <LoaderCircle
      aria-hidden="true"
      className={cn(
        'animate-spin text-current motion-reduce:animate-none',
        sizeClasses[size],
        className,
      )}
    />
  )
}
