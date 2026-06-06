'use client'

import { useEffect, useRef } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthErrorBannerProps {
  title?: string
  message: string
  className?: string
}

export function AuthErrorBanner({
  title = 'Não foi possível entrar',
  message,
  className,
}: AuthErrorBannerProps) {
  const ref = useRef<HTMLDivElement>(null)

  // micro-shake sempre que a mensagem (re)aparece
  useEffect(() => {
    const node = ref.current
    if (!node) return
    node.classList.remove('lg-shake')
    void node.offsetWidth // força reflow para reiniciar a animação
    node.classList.add('lg-shake')
  }, [message])

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'flex items-start gap-2.5 rounded-xl border border-nxd/25 bg-nxd/[0.05] px-3.5 py-3',
        className,
      )}
    >
      <AlertCircle size={16} className="mt-0.5 shrink-0 text-nxd" />
      <div className="flex-1">
        <p className="text-[12.5px] font-bold text-nxd">{title}</p>
        <p className="mt-0.5 text-[12px] leading-snug text-nxi2">{message}</p>
      </div>
    </div>
  )
}
