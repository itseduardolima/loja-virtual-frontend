'use client'

import { usePathname } from 'next/navigation'
import { SidebarVendedor, UserHeader } from '@/components'

export default function VendedorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="bg-gray-50 flex h-screen">
      <SidebarVendedor currentPath={pathname} />
      <div className="flex-1 lg:ml-0 flex flex-col overflow-hidden">
        <UserHeader currentPath={pathname} />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
