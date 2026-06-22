'use client'

import { Shield, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarAdminHeaderProps {
  collapsed: boolean
  onToggle: () => void
}

export function SidebarAdminHeader({ collapsed, onToggle }: SidebarAdminHeaderProps) {
  return (
    <div className="flex min-h-[72px] items-center gap-2.5 border-b border-nxborder px-3 pt-4 pb-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-nxp/[0.09]">
        <Shield size={18} className="text-nxp" />
      </div>

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="font-integral text-[13.5px] font-bold uppercase tracking-wide text-nxi1">
            Admin
          </div>
          <div className="text-[11px] text-nxi3">Painel de Controle</div>
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
