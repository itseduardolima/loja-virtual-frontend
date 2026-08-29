'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ShoppingBag, Search, User, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/hooks/useCart'
import { StoreInfo } from '@/types/store'
import { useDebounce } from '@/hooks/useDebounce'
import { api } from '@/lib/api'
import { Product, ProductsResponse } from '@/types/product'
import { CustomerAccountDrawer } from './CustomerAccountDrawer'
import { CustomerProfileMenuDrawer } from './CustomerProfileMenuDrawer'
import { VendorSettingsDrawer } from './VendorSettingsDrawer'
import { AdminProfileMenuDrawer } from './AdminProfileMenuDrawer'
import { StoreSearchDropdown } from './StoreSearchDropdown'
import { SearchField, StoreIconButton } from '@/components/Store/ui'
import { PROFILE_IDS } from '@/types/auth'
import { isOwnStore } from '@/lib/storefront'
import Image from 'next/image'
import { buildImageUrl } from '@/lib/imageUtils'

function StoreLogoMark({ storeInfo }: { storeInfo: StoreInfo | null | undefined }) {
  if (storeInfo?.logo) {
    return (
      <span className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-[14px] bg-nxbg shadow-[0_8px_20px_-10px_rgba(7,8,21,0.45)]">
        <Image
          src={buildImageUrl(storeInfo.logo)}
          alt=""
          fill
          sizes="44px"
          className="object-cover"
        />
      </span>
    )
  }
  const initials = (storeInfo?.name ?? '')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[14px] bg-store font-integral text-[16px] leading-none text-white shadow-[0_8px_20px_-10px_rgba(7,8,21,0.45)]">
      {initials || 'N'}
    </span>
  )
}

interface StoreHeaderProps {
  storeInfo: StoreInfo | null | undefined
  slug: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearchSubmit?: (value: string) => void
  onSelectCategory?: (name: string) => void
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
  onSelectCategory,
  onCartClick,
  scrolled = true,
  categories = [],
}: StoreHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
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
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart(storeInfo?.id)
  const isVisitingVendor =
    user?.profile_id === PROFILE_IDS.Vendedor && !isOwnStore(user, storeInfo)

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
    setSearchFocused(true)
    setTimeout(() => mobileSearchInputRef.current?.focus(), 50)
  }

  const closeMobileSearch = () => {
    setMobileSearchOpen(false)
    setSearchFocused(false)
    onSearchChange?.('')
  }

  const handleLoginClick = () => {
    const qs = searchParams.toString()
    const currentUrl = pathname + (qs ? `?${qs}` : '')
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
      const target = event.target as Node
      const insideDesktop = searchContainerRef.current?.contains(target)
      const insideMobile = mobileSearchContainerRef.current?.contains(target)
      if (!insideDesktop && !insideMobile) {
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

  const handleCategorySelect = (name: string) => {
    setSearchFocused(false)
    onSearchChange?.('')
    onSelectCategory?.(name)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value)
  }

  const userButton = (
    <div className="relative flex-shrink-0">
      <StoreIconButton
        variant="ghost"
        onClick={() => {
          if (isAuthenticated && user) {
            setIsProfileMenuOpen(prev => !prev)
          } else {
            setIsUserMenuOpen(!isUserMenuOpen)
          }
        }}
        className="w-auto min-w-[44px] gap-2 px-2.5 text-nxi1"
        aria-label={isAuthenticated ? 'Menu do perfil' : 'Login'}
      >
        <User className="h-[21px] w-[21px] text-store" />
        {isAuthenticated && user && (
          <span className="hidden max-w-[100px] truncate text-[13px] font-semibold text-nxi1 sm:inline">
            {user.name}
          </span>
        )}
      </StoreIconButton>

      {isUserMenuOpen && !isAuthenticated && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-nxborder bg-white shadow-lg sm:w-48">
            <div className="p-1.5 sm:p-2">
              <Button
                variant="ghost"
                className="h-9 w-full justify-start gap-2 rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2"
                onClick={handleLoginClick}
              >
                <LogIn className="h-4 w-4" />
                Fazer Login
              </Button>
            </div>
          </div>
        </>
      )}

      {isAuthenticated && user && user.profile_id === PROFILE_IDS.Vendedor && !isVisitingVendor && (
        <VendorSettingsDrawer
          isOpen={isProfileMenuOpen}
          onClose={() => setIsProfileMenuOpen(false)}
        />
      )}

      {isAuthenticated && user && user.profile_id === PROFILE_IDS.Administrador && (
        <AdminProfileMenuDrawer
          isOpen={isProfileMenuOpen}
          onClose={() => setIsProfileMenuOpen(false)}
        />
      )}

      {isAuthenticated && user && (user.profile_id === PROFILE_IDS.Cliente || isVisitingVendor) && (
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
    <StoreIconButton
      id="cart-icon-button"
      variant="accent"
      onClick={onCartClick}
      className="relative"
      aria-label="Carrinho"
    >
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <Badge className="absolute -right-1.5 -top-1.5 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-nxsurf bg-white px-1.5 text-[11px] font-extrabold text-store-ink">
          {totalItems > 99 ? '99+' : totalItems}
        </Badge>
      )}
    </StoreIconButton>
  )

  return (
    <>
      <div className="sticky top-0 z-50 flex h-16 w-full items-center border-b border-nxborder bg-nxsurf/85 backdrop-blur-[14px] transition-[background,border-color,backdrop-filter] duration-300">
        {/* MOBILE layout */}
        <div className="flex w-full items-center gap-2 px-4 md:hidden">
          <div
            className={cn(
              'flex-shrink-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
              mobileSearchOpen ? 'max-w-0 -mr-2 opacity-0' : 'max-w-[220px] mr-0 opacity-100'
            )}
          >
            <button
              onClick={handleStoreNameClick}
              className="flex items-center gap-2.5 pr-1 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 rounded-xl"
            >
              <StoreLogoMark storeInfo={storeInfo} />
              <span className="whitespace-nowrap font-integral text-[15px] tracking-[-0.01em] text-nxi1">
                {storeInfo?.name}
              </span>
            </button>
          </div>

          <div
            ref={mobileSearchContainerRef}
            className={cn(
              'relative transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
              mobileSearchOpen ? 'flex-[1_1_0%] opacity-100' : 'flex-[0_0_0%] overflow-hidden opacity-0'
            )}
          >
            <SearchField
              ref={mobileSearchInputRef}
              placeholder="Buscar produtos..."
              value={searchValue || ''}
              onChange={handleInputChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setSearchFocused(true)}
              containerClassName="h-10 gap-2 px-3 transition-[border-color,box-shadow]"
            />

            <StoreSearchDropdown
              query={searchValue || ''}
              visible={searchFocused && mobileSearchOpen}
              suggestions={suggestions}
              loading={isLoadingSuggestions}
              categories={categories}
              onClose={() => setSearchFocused(false)}
              onSelect={handleSelectSuggestion}
              onSelectCategory={handleCategorySelect}
              onClickProduct={handleSuggestionClick}
            />
          </div>

          {!mobileSearchOpen && <div className="flex-1" />}

          {!mobileSearchOpen && (
            <StoreIconButton
              variant="ghost"
              onClick={openMobileSearch}
              aria-label="Buscar"
            >
              <Search className="h-[21px] w-[21px]" />
            </StoreIconButton>
          )}

          {mobileSearchOpen && (
            <StoreIconButton
              variant="ghost"
              onClick={closeMobileSearch}
              aria-label="Fechar busca"
              className="text-[20px] leading-none text-nxi3"
            >
              ×
            </StoreIconButton>
          )}

          <div
            className={cn(
              'flex flex-shrink-0 items-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
              mobileSearchOpen ? 'max-w-0 -ml-2 opacity-0' : 'max-w-[48px] ml-0 opacity-100'
            )}
          >
            {cartButton}
          </div>

          <div
            className={cn(
              'flex flex-shrink-0 items-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
              mobileSearchOpen
                ? 'max-w-0 -ml-2 opacity-0 pointer-events-none'
                : 'max-w-[120px] ml-0 opacity-100 pointer-events-auto'
            )}
          >
            {userButton}
          </div>
        </div>

        {/* DESKTOP layout */}
        <div className="hidden w-full items-center gap-6 px-6 md:flex lg:px-20">
          <div className="min-w-[176px] flex-shrink-0">
            <button
              onClick={handleStoreNameClick}
              className="flex items-center gap-3 rounded-xl transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2"
            >
              <StoreLogoMark storeInfo={storeInfo} />
              <span className="flex flex-col items-start leading-[1.05]">
                <span className="whitespace-nowrap font-integral text-[17px] tracking-[-0.01em] text-nxi1">
                  {storeInfo?.name}
                </span>
               
              </span>
            </button>
          </div>

          <div className="relative z-[501] flex flex-1 justify-center">
            <div className="relative w-full max-w-[440px]" ref={searchContainerRef}>
              <SearchField
                ref={searchInputRef}
                placeholder="Buscar por produtos..."
                value={searchValue || ''}
                onChange={handleInputChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setSearchFocused(true)}
                onClear={() => { onSearchChange?.(''); setSuggestions([]) }}
                kbdHint="/"
                containerClassName="transition-[border-color,box-shadow]"
              />

              <StoreSearchDropdown
                query={searchValue || ''}
                visible={searchFocused}
                suggestions={suggestions}
                loading={isLoadingSuggestions}
                categories={categories}
                onClose={() => setSearchFocused(false)}
                onSelect={handleSelectSuggestion}
                onSelectCategory={handleCategorySelect}
                onClickProduct={handleSuggestionClick}
              />
            </div>
          </div>

          <div className="flex min-w-[120px] flex-shrink-0 items-center justify-end gap-1.5">
            {userButton}
            {cartButton}
          </div>
        </div>
      </div>

      {isAuthenticated && user && (user.profile_id === PROFILE_IDS.Cliente || isVisitingVendor) && (
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
