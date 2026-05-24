'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingBag, Search, User, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/hooks/useCart'
import { StoreInfo } from '@/types/store'
import { useDebounce } from '@/hooks/useDebounce'
import { api } from '@/lib/api'
import { Product, ProductsResponse } from '@/types/product'
import { CustomerAccountDrawer } from './CustomerAccountDrawer'
import { CustomerProfileMenuDrawer } from './CustomerProfileMenuDrawer'
import { VendorSettingsDrawer } from './VendorSettingsDrawer'
import { StoreSearchDropdown } from './StoreSearchDropdown'
import { PROFILE_IDS } from '@/types/auth'

interface StoreHeaderProps {
  storeInfo: StoreInfo | null | undefined
  slug: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearchSubmit?: (value: string) => void
  onCartClick?: () => void
  scrolled?: boolean
  categories?: string[]
}

export function StoreHeader({
  storeInfo,
  slug,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onCartClick,
  scrolled = true,
  categories = [],
}: StoreHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [searchFocused, setSearchFocused] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false)
  const [accountDrawerTab, setAccountDrawerTab] = useState<'conta' | 'pedidos' | 'desejos' | 'enderecos'>('conta')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart(storeInfo?.id)

  const debouncedSearch = useDebounce(searchValue || '', 300)

  const handleStoreNameClick = () => {
    router.push(`/loja/${slug}`)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value
      setSearchFocused(false)
      if (onSearchSubmit) {
        onSearchSubmit(value)
      } else {
        router.push(`/loja/${slug}/produtos?search=${value}`)
      }
    } else if (e.key === 'Escape') {
      setSearchFocused(false)
      setMobileSearchOpen(false)
    }
  }

  const openMobileSearch = () => {
    setMobileSearchOpen(true)
    setTimeout(() => mobileSearchInputRef.current?.focus(), 50)
  }

  const closeMobileSearch = () => {
    setMobileSearchOpen(false)
    setSearchFocused(false)
    onSearchChange?.('')
  }

  const handleLoginClick = () => {
    const currentUrl = pathname + (window.location.search || '')
    router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`)
    setIsUserMenuOpen(false)
  }

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearch || debouncedSearch.length < 2 || !slug) {
        setSuggestions([])
        return
      }
      setIsLoadingSuggestions(true)
      try {
        const response = await api.get<ProductsResponse>(
          `/catalog/store/${slug}/products?search=${encodeURIComponent(debouncedSearch)}&limit=8`
        )
        setSuggestions(response.data.data)
      } catch {
        setSuggestions([])
      } finally {
        setIsLoadingSuggestions(false)
      }
    }
    fetchSuggestions()
  }, [debouncedSearch, slug])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSuggestionClick = (product: Product) => {
    setSearchFocused(false)
    router.push(`/loja/${slug}/produto/${product.id}`)
  }

  const handleSelectSuggestion = (term: string) => {
    onSearchChange?.(term)
    setSearchFocused(false)
    if (onSearchSubmit) onSearchSubmit(term)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value)
  }

  const userButton = (
    <div className="relative flex-shrink-0">
      <Button
        variant="ghost"
        onClick={() => {
          if (isAuthenticated && user) {
            setIsProfileMenuOpen(prev => !prev)
          } else {
            setIsUserMenuOpen(!isUserMenuOpen)
          }
        }}
        className="flex items-center gap-1.5 p-2 hover:bg-gray-100 h-9 rounded-full"
        aria-label={isAuthenticated ? 'Menu do perfil' : 'Login'}
      >
        <User className="w-[19px] h-[19px] text-[#111827]" />
        {isAuthenticated && user && (
          <span className="text-[13px] font-medium text-[#111827] hidden sm:inline max-w-[100px] truncate">
            {user.name}
          </span>
        )}
      </Button>

      {isUserMenuOpen && !isAuthenticated && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
          <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-1.5 sm:p-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 rounded text-sm h-9"
                onClick={handleLoginClick}
              >
                <LogIn className="w-4 h-4" />
                Fazer Login
              </Button>
            </div>
          </div>
        </>
      )}

      {isAuthenticated && user && user.profile_id === PROFILE_IDS.Vendedor && (
        <VendorSettingsDrawer
          isOpen={isProfileMenuOpen}
          onClose={() => setIsProfileMenuOpen(false)}
        />
      )}

      {isAuthenticated && user && user.profile_id === PROFILE_IDS.Cliente && (
        <CustomerProfileMenuDrawer
          isOpen={isProfileMenuOpen}
          onClose={() => setIsProfileMenuOpen(false)}
          onUpdateProfile={() => { setAccountDrawerTab('conta'); setIsAccountDrawerOpen(true); setIsProfileMenuOpen(false) }}
          onViewOrders={() => { setAccountDrawerTab('pedidos'); setIsAccountDrawerOpen(true); setIsProfileMenuOpen(false) }}
          onViewFavorites={() => { setAccountDrawerTab('desejos'); setIsAccountDrawerOpen(true); setIsProfileMenuOpen(false) }}
          onViewAddresses={() => { setAccountDrawerTab('enderecos'); setIsAccountDrawerOpen(true); setIsProfileMenuOpen(false) }}
        />
      )}
    </div>
  )

  const cartButton = (
    <Button
      id="cart-icon-button"
      variant="ghost"
      onClick={onCartClick}
      className="relative p-2 hover:bg-gray-100 h-9 w-9 rounded-full flex-shrink-0"
      aria-label="Carrinho"
    >
      <ShoppingBag className="w-[19px] h-[19px] text-[#111827]" />
      {totalItems > 0 && (
        <Badge className="absolute top-0.5 right-0.5 h-[15px] min-w-[15px] px-1 flex items-center justify-center bg-red-500 text-white text-[9.5px] rounded-full border-0 font-bold">
          {totalItems > 99 ? '99+' : totalItems}
        </Badge>
      )}
    </Button>
  )

  return (
    <>
      <div className="sticky top-0 z-50 w-full h-16 flex items-center transition-[background,border-color,backdrop-filter] duration-300 bg-[rgba(255,255,255,0.97)] border-b border-[#F3F4F6] backdrop-blur-[12px]">
        {/* MOBILE layout */}
        <div className="flex md:hidden w-full items-center px-4 gap-2">
          <div
            className={[
              'flex-shrink-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
              mobileSearchOpen ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100',
            ].join(' ')}
          >
            <button
              onClick={handleStoreNameClick}
              className="text-[15px] font-semibold text-[#111827] hover:opacity-75 transition-opacity tracking-[-0.01em] whitespace-nowrap pr-1"
            >
              {storeInfo?.name}
            </button>
          </div>

          <div
            className={[
              'relative transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
              mobileSearchOpen ? 'flex-[1_1_0%] opacity-100' : 'flex-[0_0_0%] opacity-0 overflow-hidden',
            ].join(' ')}
          >
            <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full px-3 h-9 focus-within:border-gray-400 transition-[border-color]">
              <Search className="w-[14px] h-[14px] text-gray-400 flex-shrink-0" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Buscar produtos..."
                value={searchValue || ''}
                onChange={handleInputChange}
                onKeyDown={handleSearchKeyDown}
                className="bg-transparent flex-1 border-0 outline-none text-[13px] text-[#374151] placeholder-gray-400 min-w-0"
              />
            </div>
          </div>

          {!mobileSearchOpen && <div className="flex-1" />}

          {!mobileSearchOpen && (
            <button
              onClick={openMobileSearch}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Buscar"
            >
              <Search className="w-[19px] h-[19px] text-[#111827]" />
            </button>
          )}

          {mobileSearchOpen && (
            <button
              onClick={closeMobileSearch}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0 text-gray-500 text-lg leading-none"
              aria-label="Fechar busca"
            >
              ×
            </button>
          )}

          <div
            className={[
              'flex items-center transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] overflow-hidden flex-shrink-0',
              mobileSearchOpen ? 'max-w-0 opacity-0' : 'max-w-[40px] opacity-100',
            ].join(' ')}
          >
            {cartButton}
          </div>

          <div
            className={[
              'flex-shrink-0 transition-[opacity] duration-300',
              mobileSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto',
            ].join(' ')}
          >
            {userButton}
          </div>
        </div>

        {/* DESKTOP layout */}
        <div className="hidden md:flex w-full items-center gap-4 px-6 lg:px-20">
          <div className="flex-shrink-0 min-w-[176px]">
            <button
              onClick={handleStoreNameClick}
              className="text-[15px] font-semibold text-[#111827] hover:opacity-75 transition-opacity tracking-[-0.01em] whitespace-nowrap"
            >
              {storeInfo?.name}
            </button>
          </div>

          <div className="flex-1 flex justify-center relative z-[501]">
            <div className="relative w-full max-w-[380px]" ref={searchContainerRef}>
              <div
                className={[
                  'flex items-center gap-2.5 bg-[#F9FAFB] rounded-full px-4 h-9 transition-[border-color,border-width]',
                  searchFocused
                    ? 'border-[1.5px] border-[#111]'
                    : 'border border-[#E5E7EB]',
                ].join(' ')}
              >
                <Search className="w-[15px] h-[15px] text-gray-400 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar por produtos..."
                  value={searchValue || ''}
                  onChange={handleInputChange}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => setSearchFocused(true)}
                  className="bg-transparent flex-1 border-0 outline-none text-[13px] text-[#374151] placeholder-gray-400 min-w-0"
                />
                {searchFocused && searchValue && (
                  <button
                    onClick={() => { onSearchChange?.(''); setSuggestions([]) }}
                    className="bg-transparent border-0 text-[#9CA3AF] text-[18px] cursor-pointer p-0 leading-none flex-shrink-0"
                  >
                    ×
                  </button>
                )}
              </div>

              <StoreSearchDropdown
                query={searchValue || ''}
                visible={searchFocused}
                suggestions={suggestions}
                loading={isLoadingSuggestions}
                categories={categories}
                onClose={() => setSearchFocused(false)}
                onSelect={handleSelectSuggestion}
                onClickProduct={handleSuggestionClick}
              />
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-1 min-w-[120px] justify-end">
            {cartButton}
            {userButton}
          </div>
        </div>
      </div>

      {isAuthenticated && user && user.profile_id === PROFILE_IDS.Cliente && (
        <CustomerAccountDrawer
          isOpen={isAccountDrawerOpen}
          onClose={() => setIsAccountDrawerOpen(false)}
          initialTab={accountDrawerTab}
          onOpenCart={onCartClick}
        />
      )}
    </>
  )
}
