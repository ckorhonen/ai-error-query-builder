import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  message,
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={clsx('flex flex-col items-center justify-center', className)}>
      <Loader2 className={clsx(sizeClasses[size], 'animate-spin text-primary-600')} />
      {message && (
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      )}
    </div>
  )
}
