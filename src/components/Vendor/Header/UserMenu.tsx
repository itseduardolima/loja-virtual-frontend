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
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-nxborder bg-nxp/10 text-[13px] font-bold text-nxp"
        >
          {initials}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-56 p-2">
        <div className="mb-1 px-2 py-2">
          <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
          <p className="mt-0.5 text-xs text-gray-500">{user?.profile}</p>
        </div>
        <div className="mb-1 h-px bg-gray-100" />
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Sair da conta
        </button>
      </PopoverContent>
    </Popover>
  )
}
