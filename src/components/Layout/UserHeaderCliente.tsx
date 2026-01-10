'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  User,
  LogOut,
  ChevronRight,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface UserHeaderClienteProps {
  currentPath?: string
}

export function UserHeaderCliente({ currentPath }: UserHeaderClienteProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <>
      {/* Header com Avatar */}
      <div className="flex justify-end items-center px-6 py-[14px] bg-white border-b border-gray-200">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-text-gray">Cliente</p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-50"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50
        ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              onClick={() => setIsDrawerOpen(false)}
              className="p-2"
            >
              <X className="h-5 w-5 text-text-gray" />
            </Button>
          </div>

          {/* User Info */}
          <div className="pb-6 px-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-text-gray">Cliente</p>
                <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="p-6 mt-auto">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

