'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingBag, Search, User, LogIn, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/hooks/useCart'
import { StoreInfo } from '@/types/store'

interface StoreHeaderProps {
  storeInfo: StoreInfo | null | undefined
  slug: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearchSubmit?: (value: string) => void
  onCartClick?: () => void
}

export function StoreHeader({
  storeInfo,
  slug,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onCartClick
}: StoreHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart(storeInfo?.id)

  const handleStoreNameClick = () => {
    router.push(`/loja/${slug}/produtos`)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value
      if (onSearchSubmit) {
        onSearchSubmit(value)
      } else {
        router.push(`/loja/${slug}/produtos?search=${value}`)
      }
    }
  }

  const handleLoginClick = () => {
    const currentUrl = pathname + (window.location.search || '')
    router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`)
    setIsUserMenuOpen(false)
  }

  const handleLogoutClick = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  return (
    <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto">
      <div className="mx-auto py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Informações da Loja */}
            <div>
              <button
                onClick={handleStoreNameClick}
                className="text-3xl uppercase font-nunito font-bold text-primary hover:opacity-80"
              >
                {storeInfo?.name}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            {/* Campo de Busca */}
            <div className="relative w-[577px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchValue || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-10 pr-4 py-3 bg-[#F0F0F0] rounded-full"
              />
            </div>
            <Button
              variant="ghost"
              onClick={onCartClick}
              className="relative"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <Badge
                  className="absolute top-1 right-1 h-5 min-w-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full border-0"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* Botão de Usuário */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2"
              >
                <User className="w-6 h-6" />
                {isAuthenticated && user && (
                  <span className="text-sm font-medium">{user.name}</span>
                )}
              </Button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    {isAuthenticated && user ? (
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={handleLogoutClick}
                        >
                          <LogOut className="w-4 h-4" />
                          Sair
                        </Button>
                      </div>
                    ) : (
                      <div className="p-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 rounded"
                          onClick={handleLoginClick}
                        >
                          <LogIn className="w-4 h-4" />
                          Fazer Login
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

