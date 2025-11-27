'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button, Badge, LoadingSpinner, ErrorState, CartSidebar } from '@/components'
import {
  ShoppingBag,
  Star,
  Package,
  Plus,
  Minus,

  Search,
  User,
  LogIn,
  UserPlus,
  Check
} from 'lucide-react'
import Image from 'next/image'

import { buildImageUrl, formatPrice } from '@/lib/utils'
import { useProductDetailPage } from './useProductDetailPage'
import { useCart } from '@/hooks/useCart'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import LoadingPage from '@/components/LoadingPage'
import { Input } from '@/components/ui/input'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const productId = params.id as string
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()

  const { storeInfo } = useStoreInfo(slug)

  const {
    product,
    isLoading,
    error,
    selectedImageIndex,
    selectedSize,
    selectedColor,
    quantity,
    colorMap,
    buildImageUrls,
    selectImage,
    previousImage,
    nextImage,
    selectSize,
    selectColor,
    increaseQuantity,
    decreaseQuantity,
    addToCart,
    isAddingToCart,
  } = useProductDetailPage(slug, productId)

  // Hook do carrinho para mostrar contador
  const { totalItems } = useCart(product?.store?.id)

  const getColorValue = (colorName: string): string => {
    return colorMap[colorName] || '#6B7280'
  }

  // Suporte a navegação por teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (product && product.images && product.images.length > 1) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          previousImage()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          nextImage()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [product, previousImage, nextImage])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingPage />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorState
          message="Erro ao carregar produto"
          onRetry={() => window.location.reload()}
          retryText="Tentar novamente"
        />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorState
          message="Produto não encontrado"
          onRetry={() => router.push(`/loja/${slug}`)}
          retryText="Voltar para a loja"
        />
      </div>
    )
  }

  const isOutOfStock = product.stock === 0
  const canAddToCart = !isOutOfStock && selectedSize && selectedColor && quantity > 0

  // Função para remover acentos
  const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  // Calcular rating (mockado por enquanto)
  const rating = 4.5
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto">
        <div className="mx-auto py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Informações da Loja */}
              <div>
                <button
                  onClick={() => router.push(`/loja/${slug}/produtos`)}
                  className="text-3xl uppercase font-integral text-primary hover:opacity-80"
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
                  className="pl-10 pr-4 py-3 bg-[#F0F0F0] rounded-full"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      router.push(`/loja/${slug}/produtos?search=${(e.target as HTMLInputElement).value}`)
                    }
                  }}
                />
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsCartOpen(true)
                }}
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
                            <p className="text-sm font-semibold text-primary/60">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2">
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 rounded"
                            onClick={() => {
                              router.push('/login')
                              setIsUserMenuOpen(false)
                            }}
                          >
                            <LogIn className="w-4 h-4" />
                            Fazer Login
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 rounded"
                            onClick={() => {
                              router.push('/register')
                              setIsUserMenuOpen(false)
                            }}
                          >
                            <UserPlus className="w-4 h-4" />
                            Criar Conta
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

      {/* Main Content */}
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="flex gap-4">
            {/* Thumbnail Images - Vertical */}
            {product.images && product.images.length > 1 && (
              <div className="flex flex-col gap-3">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all ${selectedImageIndex === index
                      ? 'border-primary'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Image
                      src={buildImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      width={100}
                      height={0}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 relative  rounded-2xl overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={buildImageUrls(product.images)[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-24 w-24 text-gray-300" />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-4xl font-bold text-primary mb-4 uppercase font-integral">
                {removeAccents(product.name)}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(fullStars)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  {hasHalfStar && (
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                  )}
                  {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gray-300" />
                  ))}
                </div>
                <span className="text-sm text-primary/60">({rating}/5)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-primary">
                {formatPrice(product.final_price?.toString() || product.price)}
              </span>
              {/* Se houver desconto, mostrar preço original riscado e badge */}
              {product.discount_price !== null && product.discount_percentage > 0 && (
                <>
                  <span className="text-2xl text-primary/30 line-through font-bold">
                    {formatPrice(product.price)}
                  </span>
                  <Badge className="bg-[#FF3333]/10 text-[#FF3333] px-2 py-1">
                    -{Math.floor(product.discount_percentage)}%
                  </Badge>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-primary font-integral">
              <span className=" font-integral tracking-wide">Estoque:</span>
              <span>
                {product.stock > 0 ? `${product.stock} unidade${product.stock > 1 ? 's' : ''}` : 'Sem estoque'}
              </span>
            </div>

            {/* Description */}
            <p className="text-primary/60 text-base leading-relaxed">
              {product.description}
            </p>

            {/* Select Colors */}
            {product.dynamic_fields?.find(f => f.field_name.toLowerCase() === 'cor') && (
              <div className="space-y-3">
                <span className="text-sm font-medium text-primary/60">Cores disponíveis:</span>
                <div className="flex gap-3">
                  {product.dynamic_fields
                    .find(f => f.field_name.toLowerCase() === 'cor')
                    ?.value.split(',')
                    .map((color, colorIndex) => {
                      const trimmedColor = color.trim()
                      const colorValue = getColorValue(trimmedColor)
                      const isSelected = selectedColor === trimmedColor

                      return (
                        <Button
                          key={colorIndex}
                          onClick={() => selectColor(trimmedColor)}
                          className={"relative w-10 h-10 rounded-full border-2 transition-all p-0"}
                          style={{ backgroundColor: colorValue }}
                          title={trimmedColor}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check
                                className={`w-5 h-5 stroke-[3] ${colorValue === '#FFFFFF' || colorValue.toLowerCase() === '#ffffff' || colorValue.toLowerCase() === 'white'
                                  ? 'text-primary'
                                  : 'text-white'
                                  }`}
                              />
                            </div>
                          )}
                          {colorValue === '#FFFFFF' && (
                            <div className="absolute inset-0 rounded-full border border-gray-400"></div>
                          )}
                        </Button>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Choose Size */}
            {product.dynamic_fields?.find(f => f.field_name.toLowerCase() === 'tamanho') && (
              <div className="space-y-3">
                <span className="text-sm font-medium text-primary/60">Tamanhos disponíveis:</span>
                <div className="grid grid-cols-5 gap-2">
                  {product.dynamic_fields
                    .find(f => f.field_name.toLowerCase() === 'tamanho')
                    ?.value.split(',')
                    .map((size, sizeIndex) => {
                      const trimmedSize = size.trim()
                      const isSelected = selectedSize === trimmedSize

                      return (
                        <Button
                          key={sizeIndex}
                          onClick={() => selectSize(trimmedSize)}
                          className={`px-8 ${isSelected
                            ? 'border-primary bg-primary text-white'
                            : ' bg-[#F0F0F0] text-primary/60 hover:bg-[#c7c6c6]'
                            }`}
                        >
                          {trimmedSize}
                        </Button>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center bg-gray-100 rounded-full shadow-sm">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="p-3 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-full"
                >
                  <Minus className="h-4 w-4 text-primary ml-2" />
                </button>
                <span className="px-6 py-3 font-medium min-w-[3rem] text-center text-primary">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="p-3 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-full"
                >
                  <Plus className="h-4 w-4 text-primary mr-2" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                className="flex-1 h-12 text-lg"
                onClick={() => addToCart()}
                disabled={!canAddToCart || isAddingToCart}
              >
                {isAddingToCart ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    {isOutOfStock ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
                  </>
                )}
              </Button>
            </div>

            {!canAddToCart && !isOutOfStock && (
              <p className="text-sm text-gray-500 text-center mt-2">
                {!selectedSize && !selectedColor && 'Selecione o tamanho e a cor'}
                {!selectedSize && selectedColor && 'Selecione o tamanho'}
                {selectedSize && !selectedColor && 'Selecione a cor'}
              </p>
            )}

          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        storeId={product?.store?.id}
        storeSlug={slug}
        currentPath={`/loja/${slug}/produto/${productId}`}
      />
    </div>
  )
}
