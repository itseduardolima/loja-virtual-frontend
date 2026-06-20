import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyImageState } from '@/components/Product/EmptyImageState'
import { formatPrice } from '@/lib/utils'
import { Star, Heart } from 'lucide-react'

/**
 * Story self-contained do card de produto.
 *
 * O componente real (`@/components/Product/ProductCard`) depende de `useWishlist`
 * (AuthContext + React Query) e de `next/image`, por isso aqui usamos um mock que
 * espelha 1:1 a marcação e os tokens do design system Nexo:
 * card transparente sem borda, imagem `aspect-[4/5]` arredondada, badge "Em destaque",
 * 5 estrelas âmbar, preço em `text-primary` e badge de desconto suave.
 */
const ProductCardMock = ({
  name = 'Camiseta Básica',
  price = 79.9,
  finalPrice,
  discountPercentage = 0,
  promoActive = false,
  featured = false,
  rating = 4.5,
  reviews = 12,
  image,
  favorited = false,
  showStatusSwitch = false,
  status = 1,
}: {
  name?: string
  price?: number
  finalPrice?: number
  discountPercentage?: number
  promoActive?: boolean
  featured?: boolean
  rating?: number
  reviews?: number
  image?: string
  favorited?: boolean
  showStatusSwitch?: boolean
  status?: number
}) => {
  const displayName = name.length > 30 ? `${name.slice(0, 30)}...` : name

  return (
    <Card className="group relative overflow-hidden shadow-none bg-transparent border-0 min-h-[320px] w-64 flex flex-col cursor-pointer transition-all duration-300 active:scale-[0.98]">
      <CardContent className="p-0 flex flex-col h-full shadow-none bg-transparent">
        {/* Imagem */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded-xl sm:rounded-2xl transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <EmptyImageState className="rounded-xl sm:rounded-2xl" iconSize="sm" />
          )}

          {/* Badge "Em destaque" — superior esquerdo */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {featured && <Badge>Em destaque</Badge>}
          </div>

          {/* Switch de status OU botão de favoritos — superior direito */}
          <div className="absolute top-2 right-2 z-10">
            {showStatusSwitch ? (
              <span
                className={`inline-flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
                  status === 1 ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
              </span>
            ) : (
              <button
                type="button"
                aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90 shadow-sm transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Heart
                  className={`h-4 w-4 transition-all duration-200 ${
                    favorited ? 'fill-red-500 text-red-500' : 'fill-transparent text-gray-400'
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Informações */}
        <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="font-bold text-sm sm:text-base text-gray-900 line-clamp-2 flex-1 leading-tight"
              title={name}
            >
              {displayName}
            </h3>
            {showStatusSwitch && (
              <span
                className={`text-[10px] sm:text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                  status === 1 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {status === 1 ? 'Disponível' : 'Esgotado'}
              </span>
            )}
          </div>

          {/* Avaliações */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                    star <= Math.round(rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {reviews > 0 ? `${rating.toFixed(1)} (${reviews})` : '(0)'}
            </span>
          </div>

          {/* Preço */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-primary">
              {formatPrice(finalPrice ?? price)}
            </span>
            {promoActive && discountPercentage > 0 && (
              <>
                <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">
                  {formatPrice(price)}
                </span>
                <Badge className="bg-[#FF3333]/10 text-[#FF3333] border-0 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium">
                  -{Math.floor(discountPercentage)}%
                </Badge>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const meta: Meta<typeof ProductCardMock> = {
  title: 'Storefront/Product Card',
  component: ProductCardMock,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    price: { control: 'number' },
    finalPrice: { control: 'number' },
    discountPercentage: { control: { type: 'range', min: 0, max: 90, step: 5 } },
    promoActive: { control: 'boolean' },
    featured: { control: 'boolean' },
    rating: { control: { type: 'range', min: 0, max: 5, step: 0.5 } },
    reviews: { control: 'number' },
    favorited: { control: 'boolean' },
    showStatusSwitch: { control: 'boolean' },
    status: { control: { type: 'inline-radio' }, options: [1, 0] },
  },
}

export default meta
type Story = StoryObj<typeof ProductCardMock>

export const Default: Story = {
  args: { name: 'Camiseta Básica', price: 79.9, rating: 4.5, reviews: 12 },
}

export const Featured: Story = {
  args: { name: 'Tênis Premium', price: 299.9, featured: true, rating: 5, reviews: 48 },
}

export const WithDiscount: Story = {
  args: {
    name: 'Tênis Esportivo',
    price: 249.9,
    finalPrice: 149.9,
    discountPercentage: 40,
    promoActive: true,
    rating: 4.8,
    reviews: 35,
  },
}

export const WithoutReviews: Story = {
  args: { name: 'Produto sem avaliações', price: 29.9, rating: 0, reviews: 0 },
}

export const Favorited: Story = {
  args: { name: 'Produto Favorito', price: 79.9, rating: 4.2, reviews: 8, favorited: true },
}

export const VendorStatusSwitch: Story = {
  name: 'Vendedor — switch de status',
  args: {
    name: 'Moletom Oversized',
    price: 159.9,
    rating: 4.6,
    reviews: 21,
    showStatusSwitch: true,
    status: 1,
  },
}

export const OutOfStock: Story = {
  args: {
    name: 'Produto Esgotado',
    price: 99.9,
    rating: 4.0,
    reviews: 5,
    showStatusSwitch: true,
    status: 0,
  },
}

export const NoImage: Story = {
  args: { name: 'Produto sem imagem', price: 45.0, rating: 3.5, reviews: 4 },
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <ProductCardMock name="Camiseta" price={79.9} rating={4.5} reviews={12} />
      <ProductCardMock name="Tênis em destaque" price={299.9} featured rating={5} reviews={48} />
      <ProductCardMock
        name="Tênis Esportivo"
        price={249.9}
        finalPrice={149.9}
        discountPercentage={40}
        promoActive
        rating={4.8}
        reviews={35}
      />
    </div>
  ),
}
