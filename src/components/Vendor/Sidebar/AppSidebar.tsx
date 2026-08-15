'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { SidebarSection } from './SidebarSection'
import { SidebarNavItem } from './SidebarNavItem'
import type { NavItemDef, NavSectionDef } from './types'

interface AppSidebarProps {
  header: (collapsed: boolean, onToggle: () => void) => ReactNode
  footer?: (collapsed: boolean) => ReactNode
  extraNavContent?: (collapsed: boolean) => ReactNode
  sections: NavSectionDef[]
  currentPath?: string
  collapsedStorageKey?: string
  isItemLocked?: (item: NavItemDef) => boolean
  onItemClick: (item: NavItemDef) => void
}

export function AppSidebar({
  header,
  footer,
  extraNavContent,
  sections,
  currentPath,
  collapsedStorageKey = 'sidebar-collapsed',
  isItemLocked,
  onItemClick,
}: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(collapsedStorageKey) === 'true'
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem(collapsedStorageKey, String(collapsed))
  }, [collapsed, collapsedStorageKey])

  function isActive(item: NavItemDef): boolean {
    if (!currentPath) return false
    const segments = item.href.split('/').filter(Boolean)
    if (segments.length === 1) return currentPath === item.href
    return currentPath.startsWith(item.href)
  }

  const handleToggle = () => setCollapsed((c) => !c)

  return (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col overflow-hidden border-r border-nxborder bg-nxsurf',
        'transition-[width,min-width] duration-200 ease-out',
        collapsed ? 'w-[72px] min-w-[72px]' : 'w-[248px] min-w-[248px]',
      )}
    >
      {header(collapsed, handleToggle)}

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2">
        {sections.map((section) => (
          <SidebarSection key={section.label} label={section.label} collapsed={collapsed}>
            {section.items.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                active={isActive(item)}
                locked={!!(isItemLocked?.(item))}
                collapsed={collapsed}
                onClick={() => onItemClick(item)}
              />
            ))}
          </SidebarSection>
        ))}

        {extraNavContent?.(collapsed)}
      </nav>

      {footer?.(collapsed)}
    </aside>
  )
}
