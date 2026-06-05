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
    <section className="rounded-2xl border border-nxborder bg-white p-5 md:p-6">
      <div className="mb-5 flex items-start gap-3.5">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[14px] font-extrabold',
            done ? 'bg-nxs/[0.12] text-nxs' : 'bg-nxp/10 text-nxp',
          )}
        >
          {done ? <Check size={17} strokeWidth={3} /> : n}
        </div>
        <div className="flex-1">
          <h2 className="flex items-center gap-2 text-[15.5px] font-extrabold tracking-tight text-nxi1">
            {Icon && <Icon size={16} className="text-nxi3" />}
            {title}
          </h2>
          {desc && <p className="mt-0.5 text-[12.5px] text-nxi2">{desc}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}
