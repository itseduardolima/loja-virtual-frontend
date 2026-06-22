'use client'

import { HeaderBreadcrumb, UserMenu } from '@/components/Vendor/Header'

interface UserHeaderAdminProps {
  currentPath?: string
}

export function UserHeaderAdmin({ currentPath = '/admin' }: UserHeaderAdminProps) {
  return (
    <header className="flex h-[72px] shrink-0 items-center gap-3 border-b border-nxborder bg-nxsurf px-5">
      <HeaderBreadcrumb path={currentPath} />
      <div className="ml-auto flex items-center gap-[10px]">
        <UserMenu />
      </div>
    </header>
  )
}
