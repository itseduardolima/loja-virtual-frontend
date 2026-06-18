'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getInitials } from '@/lib/vendor'

export function UserMenu() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const initials = user?.name ? getInitials(user.name) : 'U'

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label={user?.name}
          className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-[11px] border border-nxborder bg-[#DADCEC] text-[13px] font-extrabold text-nxp transition-colors hover:border-nxp hover:bg-[#EEF0FB]"
        >
          {initials}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-[220px] overflow-hidden rounded-[16px] border border-nxborder p-0 shadow-[0_24px_48px_-16px_rgba(28,30,43,.25)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2 data-[state=open]:duration-150"
      >
        <div className="bg-[#FBFBFD] px-[16px] pb-[13px] pt-[14px]">
          <p className="text-[15px] font-extrabold text-nxi1">{user?.name}</p>
          <p className="mt-[3px] text-[13px] font-semibold text-nxi3">{user?.profile}</p>
        </div>
        <div className="h-px bg-nxborder" />
        <div className="p-[6px]">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-[9px] rounded-[10px] px-[10px] py-[9px] text-[13px] font-bold text-nxd transition-colors hover:bg-[#FBE9EE]"
          >
            <LogOut size={15} />
            Sair da conta
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
