import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  className?: string
}

export function LoadingSpinner({
  message,
  size = 'md',
  fullScreen = false,
  className,
}: LoadingSpinnerProps) {
  const spinnerSize = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-[3px]',
  }[size]

  const messageStyle = {
    sm: 'text-[11px] font-extrabold text-nxi3 mt-[14px]',
    md: 'text-[13px] font-semibold text-nxi3 mt-[12px]',
    lg: 'text-[14px] font-bold text-nxi2 mt-[14px]',
  }[size]

  return (
    <div
      className={cn(
        fullScreen
          ? 'min-h-screen bg-nxbg flex items-center justify-center'
          : 'flex flex-col items-center justify-center py-12',
        className
      )}
    >
      <span
        className={cn(
          'rounded-full animate-spin border-nxp border-t-transparent',
          spinnerSize
        )}
      />
      {message && (
        <span className={messageStyle}>{message}</span>
      )}
    </div>
  )
}
