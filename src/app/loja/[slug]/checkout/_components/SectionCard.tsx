'use client'

import { Check, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  n: string
  icon?: LucideIcon
  title: string
  desc?: string
  done?: boolean
  children: React.ReactNode
}

export function SectionCard({ n, icon: Icon, title, desc, done, children }: SectionCardProps) {
  return (
    <section className="relative z-[1] rounded-2xl border border-nxborder bg-nxsurf p-5 shadow-[0_1px_2px_rgba(27,32,48,0.04),0_8px_24px_-18px_rgba(27,32,48,0.12)] md:p-6">
      <div className="mb-5 flex items-start gap-3.5">
        {/* disco do stepper — ligado pela espinha desenhada na página */}
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-[14px] font-extrabold',
            done
              ? 'border-nxs bg-nxs text-white'
              : 'border-store bg-white text-store-ink',
          )}
        >
          {done ? <Check size={16} strokeWidth={3} /> : n}
        </div>
        <div className="flex-1">
          <h2 className="flex items-center gap-2 text-[15.5px] font-extrabold tracking-tight text-nxi1">
            {Icon && <Icon size={16} className="text-nxi3" />}
            {title}
          </h2>
          {desc && <p className="mt-0.5 text-[12.5px] text-nxi2">{desc}</p>}
        </div>
        {done && (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-nxs">
            <Check size={12} strokeWidth={3} />
            Completo
          </span>
        )}
      </div>
      {children}
    </section>
  )
}
