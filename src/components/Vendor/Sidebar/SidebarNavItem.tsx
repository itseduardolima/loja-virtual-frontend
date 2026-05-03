'use client'

import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItemDef } from './types'

interface SidebarNavItemProps {
  item: NavItemDef
  active: boolean
  locked: boolean
  collapsed: boolean
  onClick: () => void
}

export function SidebarNavItem({
  item,
  active,
  locked,
  collapsed,
  onClick,
}: SidebarNavItemProps) {
  const Icon = item.icon

  return (
    <button
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        'relative mb-0.5 flex w-full items-center gap-2.5 rounded-[10px] border-none text-left transition-colors',
        collapsed ? 'justify-center py-2.5' : 'justify-start px-2.5 py-2.5',
        active
          ? 'bg-nxp/[0.09] text-nxp'
          : locked
            ? 'bg-transparent text-nxi3 hover:bg-nxi3/[0.08]'
            : 'bg-transparent text-nxi2 hover:bg-nxi3/[0.08]',
      )}
    >
      <Icon size={17} className="shrink-0" />
      {!collapsed && (
        <>
          <span
            className={cn(
              'flex-1 whitespace-nowrap text-[13.5px]',
              active ? 'font-semibold' : 'font-medium',
            )}
          >
            {item.label}
          </span>
          {locked && <Lock size={12} className="shrink-0 text-nxi3" />}
          {item.badge && !locked && (
            <span
              className={cn(
                'shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-bold text-white',
                item.badge.tone === 'danger' ? 'bg-nxd' : 'bg-nxw',
              )}
            >
              {item.badge.count > 99 ? '99+' : item.badge.count}
            </span>
          )}
        </>
      )}
      {collapsed && item.badge && !locked && (
        <span
          className={cn(
            'absolute right-1.5 top-1.5 h-2 w-2 rounded-full',
            item.badge.tone === 'danger' ? 'bg-nxd' : 'bg-nxw',
          )}
        />
      )}
    </button>
  )
}
