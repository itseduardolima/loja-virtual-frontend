'use client'

import { useRouter } from 'next/navigation'
import { BarChart3, Users, CreditCard, Ticket, Receipt, RotateCcw, Store } from 'lucide-react'
import {
  AppSidebar,
  SidebarAdminHeader,
  type NavItemDef,
  type NavSectionDef,
} from '@/components/Vendor/Sidebar'

interface SidebarAdminProps {
  currentPath?: string
}

const ADMIN_SECTIONS: NavSectionDef[] = [
  {
    label: 'Visão geral',
    items: [{ id: 'dashboard', label: 'Dashboard', href: '/admin', icon: BarChart3 }],
  },
  {
    label: 'Gestão',
    items: [
      { id: 'usuarios', label: 'Usuários', href: '/admin/usuarios', icon: Users },
      { id: 'lojas', label: 'Lojas', href: '/admin/lojas', icon: Store },
      { id: 'assinaturas', label: 'Assinaturas', href: '/admin/assinaturas', icon: Receipt },
    ],
  },
  {
    label: 'Financeiro',
    items: [
      { id: 'estornos', label: 'Estornos', href: '/admin/estornos', icon: RotateCcw },
      { id: 'planos', label: 'Planos', href: '/admin/planos', icon: CreditCard },
      { id: 'cupons-plano', label: 'Cupons de Plano', href: '/admin/cupons-plano', icon: Ticket },
    ],
  },
]

export function SidebarAdmin({ currentPath }: SidebarAdminProps) {
  const router = useRouter()

  function handleItemClick(item: NavItemDef) {
    router.push(item.href)
  }

  return (
    <AppSidebar
      header={(collapsed, onToggle) => (
        <SidebarAdminHeader collapsed={collapsed} onToggle={onToggle} />
      )}
      sections={ADMIN_SECTIONS}
      currentPath={currentPath}
      collapsedStorageKey="admin-sidebar-collapsed"
      onItemClick={handleItemClick}
    />
  )
}
