'use client'

import Image from 'next/image'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { buildImageUrl, cn } from '@/lib/utils'
import { getInitials } from '@/lib/vendor'

interface SidebarStoreHeaderProps {
  storeName: string
  logo?: string | null
  collapsed: boolean
  onToggle: () => void
}

export function SidebarStoreHeader({
  storeName,
  logo,
  collapsed,
  onToggle,
}: SidebarStoreHeaderProps) {
  return (
    <div className="flex min-h-[72px] items-center gap-2.5 border-b border-nxborder px-3 pt-4 pb-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(135deg,hsl(var(--nxp))_0%,hsl(237_60%_48%)_100%)] text-sm font-bold tracking-[-0.02em] text-white">
        {logo ? (
          <Image
            src={buildImageUrl(logo)}
            alt={storeName}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        ) : (
          getInitials(storeName)
        )}
      </div>

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] font-bold text-nxi1">{storeName}</div>
        </div>
      )}

      <button
        onClick={onToggle}
        title={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        className={cn(
          'flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-nxborder bg-white text-nxi3',
          collapsed && 'ml-auto',
        )}
      >
        {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
      </button>
    </div>
  )
}
