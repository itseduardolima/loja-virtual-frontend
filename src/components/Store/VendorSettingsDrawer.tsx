'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { IconBarChart, IconApps, IconInbox, IconSettings, IconLogout } from '@/assets/icons'

interface VendorSettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
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
      className="w-full flex items-center gap-3 text-left border-none cursor-pointer transition-colors px-[14px] py-[10px] rounded-[10px] bg-transparent font-inherit hover:bg-[#FEF2F2] data-[safe=true]:hover:bg-[#F7F3EF]"
      onMouseEnter={e => { e.currentTarget.style.background = danger ? '#FEF2F2' : '#F7F3EF' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >
      <span className={`flex items-center shrink-0 ${danger ? 'text-red-500' : 'text-gray-500'}`}>{icon}</span>
      <span className={`flex-1 text-[13px] font-medium text-left ${danger ? 'text-red-500' : 'text-[#111]'}`}>{label}</span>
    </button>
  )
}

export function VendorSettingsDrawer({ isOpen, onClose }: VendorSettingsDrawerProps) {
  const router = useRouter()
  const { user, logout } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'V'

  const navigate = (href: string) => {
    router.push(href)
    onClose()
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 z-20 overflow-hidden top-[calc(100%+8px)] w-[288px] bg-white rounded-[18px] border border-[#F0EBE3] shadow-[0_12px_48px_rgba(0,0,0,.14),0_2px_8px_rgba(0,0,0,.06)]">
        <div className="px-4 pt-4 pb-3 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#f5ede3] to-[#b99878] shadow-[inset_0_1px_0_rgba(255,255,255,.5)]">
              <span className="italic text-base font-semibold text-[#3a2216]">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-bold text-[#111] tracking-[-0.01em] whitespace-nowrap overflow-hidden text-ellipsis">{user?.name}</p>
              <p className="text-[11px] text-[#9CA3AF] mt-px whitespace-nowrap overflow-hidden text-ellipsis">{user?.email}</p>
            </div>
            <span className="shrink-0 text-[9px] font-extrabold tracking-[.1em] text-[#b99878] bg-[#FAF6F2] px-[7px] py-[3px] rounded-[5px]">VENDEDOR</span>
          </div>
        </div>

        <div className="p-2">
          <MenuRow
            icon={<IconBarChart size={16} />}
            label="Dashboard"
            onClick={() => navigate('/vendedor/dashboard')}
          />
          <MenuRow
            icon={<IconApps size={16} />}
            label="Meus produtos"
            onClick={() => navigate('/vendedor/produtos')}
          />
          <MenuRow
            icon={<IconInbox size={16} />}
            label="Pedidos recebidos"
            onClick={() => navigate('/vendedor/pedidos')}
          />
          <MenuRow
            icon={<IconSettings size={16} />}
            label="Configurações da loja"
            onClick={() => navigate('/vendedor/configuracoes/informacoes-basicas')}
          />

          <div className="h-px bg-[#F3F4F6] my-[6px] mx-[6px]" />

          <MenuRow
            icon={<IconLogout size={16} />}
            label="Sair"
            danger
            onClick={handleLogout}
          />
        </div>

        <div className="border-t border-[#F3F4F6] px-4 py-[10px] flex items-center justify-center gap-[5px]">
          <span className="text-[10px] text-[#C4C0BB]">Plataforma</span>
          <span className="w-[14px] h-[14px] rounded-[3px] bg-[#F0EBE4] inline-flex items-center justify-center text-[8px] font-extrabold text-[#9CA3AF]">N</span>
          <span className="text-[10px] font-semibold text-[#9CA3AF] tracking-[.02em]">nexo</span>
        </div>
      </div>
    </>
  )
}
