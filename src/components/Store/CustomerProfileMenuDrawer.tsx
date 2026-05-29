'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { IconUser, IconPackage, IconHeart, IconMapPin, IconLogout } from '@/assets/icons'

interface CustomerProfileMenuDrawerProps {
  isOpen: boolean
  onClose: () => void
  onUpdateProfile: () => void
  onViewOrders: () => void
  onViewFavorites: () => void
  onViewAddresses: () => void
}

function MenuRow({ icon, label, danger, onClick }: {
  icon: React.ReactNode
  label: string
  danger?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 text-left border-none cursor-pointer transition-colors px-[14px] py-[10px] rounded-[10px] bg-transparent font-inherit',
        danger ? 'hover:bg-nxd/[0.08]' : 'hover:bg-nxi3/[0.08]',
      )}
    >
      <span className={cn('flex items-center shrink-0', danger ? 'text-nxd' : 'text-nxi2')}>{icon}</span>
      <span className={cn('flex-1 text-[13px] font-medium text-left', danger ? 'text-nxd' : 'text-nxi1')}>{label}</span>
    </button>
  )
}

export function CustomerProfileMenuDrawer({
  isOpen,
  onClose,
  onUpdateProfile,
  onViewOrders,
  onViewFavorites,
  onViewAddresses,
}: CustomerProfileMenuDrawerProps) {
  const router = useRouter()
  const { user, logout } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'U'

  const handleLogout = () => {
    logout()
    router.push('/login')
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 z-20 overflow-hidden top-[calc(100%+8px)] w-[288px] bg-nxsurf rounded-[18px] border border-nxborder shadow-[0_12px_48px_rgba(0,0,0,.14),0_2px_8px_rgba(0,0,0,.06)]">
        <div className="px-4 pt-4 pb-3 border-b border-nxborder">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-nxp/40 to-nxp shadow-[inset_0_1px_0_rgba(255,255,255,.15)]">
              <span className="italic text-base font-semibold text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-bold text-nxi1 tracking-[-0.01em] whitespace-nowrap overflow-hidden text-ellipsis">{user?.name}</p>
              <p className="text-[11px] text-nxi3 mt-px whitespace-nowrap overflow-hidden text-ellipsis">{user?.email}</p>
            </div>
            <span className="shrink-0 text-[9px] font-extrabold tracking-[.1em] text-nxp bg-nxp/[0.08] px-[7px] py-[3px] rounded-[5px]">CLIENTE</span>
          </div>
        </div>

        <div className="p-2">
          <MenuRow
            icon={<IconUser size={16} />}
            label="Minha conta"
            onClick={() => { onUpdateProfile(); onClose() }}
          />
          <MenuRow
            icon={<IconPackage size={16} />}
            label="Meus pedidos"
            onClick={() => { onViewOrders(); onClose() }}
          />
          <MenuRow
            icon={<IconHeart size={16} />}
            label="Lista de desejos"
            onClick={() => { onViewFavorites(); onClose() }}
          />
          <MenuRow
            icon={<IconMapPin size={16} />}
            label="Endereços"
            onClick={() => { onViewAddresses(); onClose() }}
          />

          <div className="h-px bg-nxborder my-[6px] mx-[6px]" />

          <MenuRow
            icon={<IconLogout size={16} />}
            label="Sair"
            danger
            onClick={handleLogout}
          />
        </div>

        <div className="border-t border-nxborder px-4 py-[10px] flex items-center justify-center gap-[5px]">
          <span className="text-[10px] text-nxi3">Plataforma</span>
          <span className="w-[14px] h-[14px] rounded-[3px] bg-nxborder inline-flex items-center justify-center text-[8px] font-extrabold text-nxi3">N</span>
          <span className="text-[10px] font-semibold text-nxi3 tracking-[.02em]">nexo</span>
        </div>
      </div>
    </>
  )
}
