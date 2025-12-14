'use client'

import { usePathname } from 'next/navigation'
import { SidebarVendedor, UserHeader } from '@/components'

export default function VendedorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Não mostrar sidebar na página de criar loja
  const isCreateStorePage = pathname === '/vendedor/criar-loja'

  if (isCreateStorePage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <SidebarVendedor currentPath={pathname} />
      <div className="flex-1 lg:ml-0 flex flex-col overflow-hidden">
        <UserHeader currentPath={pathname} />
        <div className="flex-1 overflow-y-auto bg-[#FAFAFB] px-4 py-8">
          {children}
        </div>
      </div>
    </div>
  )
}
