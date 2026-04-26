'use client'

import { ReactNode, useState } from 'react'
import { Lock, Sparkles } from 'lucide-react'
import { FeatureLockedModal } from './FeatureLockedModal'
import { FEATURE_METADATA } from '@/lib/planUtils'
import { cn } from '@/lib/utils'
import type { PlanFeatures } from '@/hooks/usePlanFeatures'

interface LockedFeatureOverlayProps {
  feature: keyof PlanFeatures
  locked: boolean
  children: ReactNode
  className?: string
}

export function LockedFeatureOverlay({ feature, locked, children, className }: LockedFeatureOverlayProps) {
  const [open, setOpen] = useState(false)
  const meta = FEATURE_METADATA[feature]

  if (!locked) return <>{children}</>

  return (
    <>
      <div className={cn('relative', className)}>
        {/* Conteúdo borrado e não interativo */}
        <div className="pointer-events-none select-none blur-[3px] opacity-60" aria-hidden>
          {children}
        </div>

        {/* Overlay clicável */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/40 hover:bg-white/60 backdrop-blur-[1px] rounded-2xl transition-colors group cursor-pointer"
          aria-label={`Ver detalhes de ${meta.title}`}
        >
          <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center border border-gray-200 group-hover:scale-105 transition-transform">
            <Lock className="h-5 w-5 text-gray-700" />
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-bold text-gray-900">{meta.title}</p>
            <p className="text-xs text-gray-600 mt-0.5 inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Disponível em planos superiores
            </p>
          </div>
        </button>
      </div>

      <FeatureLockedModal feature={feature} open={open} onOpenChange={setOpen} />
    </>
  )
}
