'use client'

import { X, User, Package, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

interface CustomerProfileMenuDrawerProps {
  isOpen: boolean
  onClose: () => void
  onUpdateProfile: () => void
  onViewOrders: () => void
}

export function CustomerProfileMenuDrawer({
  isOpen,
  onClose,
  onUpdateProfile,
  onViewOrders
}: CustomerProfileMenuDrawerProps) {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Options */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12 text-left"
                onClick={() => {
                  onUpdateProfile()
                  onClose()
                }}
              >
                <Settings className="w-5 h-5" />
                <span>Atualizar Cadastro</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12 text-left"
                onClick={() => {
                  onViewOrders()
                  onClose()
                }}
              >
                <Package className="w-5 h-5" />
                <span>Meus Pedidos</span>
              </Button>

              <div className="border-t border-gray-200 my-2" />

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12 text-left text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

