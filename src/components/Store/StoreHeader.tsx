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

  const handleLogoutClick = () => {
    logout()
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

          <div className="flex items-center gap-5">
            {/* Campo de Busca */}
            <div className="relative w-[577px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar produtos..."
                value={searchValue || ''}
                onChange={handleInputChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={handleInputFocus}
                className="pl-10 pr-4 py-3 bg-muted rounded-full"
              />
              
              {/* Dropdown de Sugestões */}
              {showSuggestions && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
                >
                  {isLoadingSuggestions ? (
                    <div className="p-4 text-center text-gray-500">
                      Buscando...
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="py-2">
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSuggestionClick(product)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          {product.images && product.images.length > 0 ? (
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <Image
                                src={buildImageUrl(product.images[0])}
                                alt={product.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                              <Search className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            {product.category && (
                              <p className="text-xs text-gray-500 truncate">
                                {product.category.name}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-primary">
                              {formatPrice(product.final_price || product.price)}
                            </p>
                            {product.discount_price && (
                              <p className="text-xs text-gray-400 line-through">
                                {formatPrice(product.price)}
                              </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Nenhum produto encontrado
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              onClick={onCartClick}
              className="relative p-0 hover:bg-transparent"
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
                className="flex items-center gap-2 p-0 hover:bg-transparent"
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

