'use client'

import { WifiOff, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  retryText?: string
  fullScreen?: boolean
  className?: string
}

export function ErrorState({
  message,
  onRetry,
  retryText = 'Tentar novamente',
  fullScreen = false,
  className,
}: ErrorStateProps) {
  const card = (
    <div className="rounded-[16px] border border-[#E3E4EC] bg-white py-[56px] px-6 text-center">
      {onRetry ? (
        <WifiOff className="h-12 w-12 text-[#E8632A] mx-auto" />
      ) : (
        <AlertCircle className="h-12 w-12 text-[#E8632A] mx-auto" />
      )}

      <div className="mt-[16px] text-[17px] font-extrabold text-[#1C1E2B]">
        {onRetry
          ? (message ?? 'Não foi possível carregar')
          : (message ?? 'Algo deu errado')}
      </div>

      {!onRetry && (
        <div className="mt-[5px] text-[13.5px] font-semibold text-[#4B4E62]">
          Tente recarregar a página ou entre em contato com o suporte.
        </div>
      )}

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-[20px] inline-flex h-[42px] items-center gap-[7px] rounded-[11px] bg-[#2A2D7C] px-5 text-[13.5px] font-extrabold text-white"
        >
          <RefreshCw className="h-[15px] w-[15px]" />
          {retryText}
        </button>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className={cn('flex min-h-screen items-center justify-center bg-[#F4F5F8] p-4', className)}>
        <div className="w-full max-w-[420px]">
          {card}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(className)}>
      {card}
    </div>
  )
}
