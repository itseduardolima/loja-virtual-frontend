'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { ShoppingBag, Search, User, LogIn, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/hooks/useCart'
import { StoreInfo } from '@/types/store'
import { useDebounce } from '@/hooks/useDebounce'
import { api } from '@/lib/api'
import { Product, ProductsResponse } from '@/types/product'
import { formatPrice, buildImageUrl } from '@/lib/utils'
import { CustomerOrdersDrawer } from './CustomerOrdersDrawer'
import { CustomerProfileMenuDrawer } from './CustomerProfileMenuDrawer'
import { UpdateProfileDrawer } from './UpdateProfileDrawer'
import { VendorSettingsDrawer } from './VendorSettingsDrawer'
import { PROFILE_IDS } from '@/types/auth'

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
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isOrdersDrawerOpen, setIsOrdersDrawerOpen] = useState(false)
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart(storeInfo?.id)
  
  const debouncedSearch = useDebounce(searchValue || '', 300)

  const handleStoreNameClick = () => {
    router.push(`/loja/${slug}/produtos`)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value
      setShowSuggestions(false)
      if (onSearchSubmit) {
        onSearchSubmit(value)
      } else {
        router.push(`/loja/${slug}/produtos?search=${value}`)
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleLoginClick = () => {
    const currentUrl = pathname + (window.location.search || '')
    router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`)
    setIsUserMenuOpen(false)
  }

  // Buscar sugestões de produtos
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearch || debouncedSearch.length < 2 || !slug) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setIsLoadingSuggestions(true)
      try {
        const response = await api.get<ProductsResponse>(
          `/catalog/store/${slug}/products?search=${encodeURIComponent(debouncedSearch)}&limit=8`
        )
        setSuggestions(response.data.data)
        setShowSuggestions(response.data.data.length > 0)
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error)
        setSuggestions([])
        setShowSuggestions(false)
      } finally {
        setIsLoadingSuggestions(false)
      }
    }

    fetchSuggestions()
  }, [debouncedSearch, slug])

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSuggestionClick = (product: Product) => {
    setShowSuggestions(false)
    router.push(`/loja/${slug}/produto/${product.id}`)
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value)
    if (e.target.value.length >= 2) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 py-4 lg:py-6">
      <div className="mx-auto py-3 sm:py-4 lg:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 lg:gap-6">
          {/* Informações da Loja */}
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={handleStoreNameClick}
              className="text-xl sm:text-2xl lg:text-3xl uppercase font-nunito font-bold text-primary hover:opacity-80 transition-opacity text-left"
            >
              {storeInfo?.name}
            </button>
          </div>

          {/* Direita: Busca, Carrinho e Usuário */}
          <div className="flex items-center sm:gap-3 lg:gap-5 w-full sm:w-auto">
            {/* Campo de Busca */}
            <div className="relative flex-1 sm:flex-initial sm:w-[280px] md:w-[350px] lg:w-[400px] xl:w-[577px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 z-10" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar produtos..."
                value={searchValue || ''}
                onChange={handleInputChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={handleInputFocus}
                className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 bg-muted rounded-full text-sm sm:text-base h-9 sm:h-10 lg:h-11"
              />
              
              {/* Dropdown de Sugestões */}
              {showSuggestions && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[60vh] sm:max-h-96 overflow-y-auto"
                >
                  {isLoadingSuggestions ? (
                    <div className="p-3 sm:p-4 text-center text-gray-500 text-sm">
                      Buscando...
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="py-1 sm:py-2">
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSuggestionClick(product)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-2 sm:gap-3"
                        >
                          {(() => {
                            // Função helper para obter a primeira imagem disponível
                            const getProductImage = (images: any): string | null => {
                              // Se images é um objeto (formato novo com cores)
                              if (images && typeof images === 'object' && !Array.isArray(images)) {
                                // Pegar a primeira cor disponível
                                const firstColor = Object.keys(images)[0]
                                if (firstColor && Array.isArray(images[firstColor]) && images[firstColor].length > 0) {
                                  return images[firstColor][0]
                                }
                              }
                              
                              // Se images é um array (formato antigo)
                              if (Array.isArray(images) && images.length > 0) {
                                return images[0]
                              }
                              
                              return null
                            }
                            
                            const imageUrl = getProductImage(product.images)
                            
                            return imageUrl ? (
                              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                <Image
                                  src={buildImageUrl(imageUrl)}
                                  alt={product.name}
                                  fill
                                  className="object-cover rounded"
                                  sizes="(max-width: 640px) 40px, 48px"
                                />
                              </div>
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            </div>
                          )
                          })()}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            {product.category && (
                              <p className="text-[10px] sm:text-xs text-gray-500 truncate mt-0.5">
                                {product.category.name}
                              </p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs sm:text-sm font-semibold text-primary">
                              {formatPrice(product.final_price || product.price)}
                            </p>
                            {product.discount_price && (
                              <p className="text-[10px] sm:text-xs text-gray-400 line-through">
                                {formatPrice(product.price)}
                              </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 sm:p-4 text-center text-gray-500 text-sm">
                      Nenhum produto encontrado
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Botão do Carrinho */}
            <Button
              id="cart-icon-button"
              variant="ghost"
              onClick={onCartClick}
              className="relative p-2 sm:p-0 hover:bg-transparent h-9 w-9 sm:h-auto sm:w-auto flex-shrink-0"
              aria-label="Carrinho"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <Badge
                  className="absolute bottom-4 right-0 sm:bottom-3 sm:left-3 h-4 sm:h-5 min-w-4 sm:min-w-5 px-1 sm:px-1.5 flex items-center justify-center bg-red-500 text-white text-[10px] sm:text-xs rounded-full border-0 font-medium"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </Badge>
              )}
            </Button>

            {/* Botão de Usuário */}
            <div className="relative flex-shrink-0">
              <Button
                variant="ghost"
                onClick={() => {
                  if (isAuthenticated && user) {
                    setIsProfileMenuOpen(true)
                  } else {
                    setIsUserMenuOpen(!isUserMenuOpen)
                  }
                }}
                className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-0 hover:bg-transparent h-9 sm:h-auto"
                aria-label={isAuthenticated ? 'Menu do perfil' : 'Login'}
              >
                <User className="w-6 h-6" />
                {isAuthenticated && user && (
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline max-w-[100px] lg:max-w-none truncate">
                    {user.name}
                  </span>
                )}
              </Button>

              {/* Dropdown Menu - Apenas quando não estiver autenticado */}
              {isUserMenuOpen && !isAuthenticated && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="p-1.5 sm:p-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 rounded text-sm sm:text-base h-9 sm:h-10"
                        onClick={handleLoginClick}
                      >
                        <LogIn className="w-4 h-4" />
                        Fazer Login
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Drawer de Menu do Perfil - Cliente */}
            {isAuthenticated && user && user.profile_id === PROFILE_IDS.Cliente && (
              <>
                <CustomerProfileMenuDrawer
                  isOpen={isProfileMenuOpen}
                  onClose={() => setIsProfileMenuOpen(false)}
                  onUpdateProfile={() => setIsUpdateProfileOpen(true)}
                  onViewOrders={() => setIsOrdersDrawerOpen(true)}
                />

                {/* Drawer de Atualização de Perfil */}
                <UpdateProfileDrawer
                  isOpen={isUpdateProfileOpen}
                  onClose={() => setIsUpdateProfileOpen(false)}
                />

                {/* Drawer de Pedidos e Rastreio */}
                <CustomerOrdersDrawer
                  isOpen={isOrdersDrawerOpen}
                  onClose={() => {
                    setIsOrdersDrawerOpen(false)
                  }}
                />
              </>
            )}

            {/* Drawer de Configurações - Vendedor */}
            {isAuthenticated && user && user.profile_id === PROFILE_IDS.Vendedor && (
              <VendorSettingsDrawer
                isOpen={isProfileMenuOpen}
                onClose={() => setIsProfileMenuOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

