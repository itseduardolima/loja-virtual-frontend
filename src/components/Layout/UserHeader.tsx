'use client'

import { useStore } from '@/hooks/useStore'
import type { OrderNotification } from '@/hooks/useOrderNotifications'
import {
  HeaderBreadcrumb,
  HeaderSearch,
  NotificationsPopover,
  UserMenu,
  ViewStoreLink,
} from '@/components/Vendor/Header'

interface UserHeaderProps {
  currentPath?: string
  notifications?: OrderNotification[]
  onMarkAllAsRead?: () => void
  onMarkAsRead?: (id: string) => void
  onDismiss?: (id: string) => void
  onClearAll?: () => void
}

export function UserHeader({
  currentPath = '/vendedor',
  notifications = [],
  onMarkAllAsRead,
  onMarkAsRead,
  onDismiss,
  onClearAll,
}: UserHeaderProps) {
  const { data: store } = useStore()

  return (
    <header className="flex h-[72px] shrink-0 items-center gap-3 border-b border-nxborder bg-nxsurf px-5">
      <HeaderBreadcrumb path={currentPath} />
      <HeaderSearch />

      <div className="ml-auto flex items-center gap-[10px]">
        {store?.slug && <ViewStoreLink slug={store.slug} />}
        <NotificationsPopover
          notifications={notifications}
          onMarkAllAsRead={onMarkAllAsRead}
          onMarkAsRead={onMarkAsRead}
          onDismiss={onDismiss}
          onClearAll={onClearAll}
        />
        <UserMenu />
      </div>
    </header>
  )
}
