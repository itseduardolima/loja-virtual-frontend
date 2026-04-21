import type { Meta, StoryObj } from '@storybook/experimental-nextjs-vite'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Heart } from 'lucide-react'

// Story manual do card de produto (sem dependências externas de rota/contexto)
const ProductCardMock = ({
  name = 'Camiseta Básica',
  price = 59.9,
  originalPrice,
  rating = 4.5,
  reviewCount = 12,
  image,
  isNew = false,
  isFavorited = false,
}: {
  name?: string
  price?: number
  originalPrice?: number
  rating?: number
  reviewCount?: number
  image?: string
  isNew?: boolean
  isFavorited?: boolean
}) => {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <Card className="w-64 overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
      <div className="relative h-56 bg-gray-100 flex items-center justify-center">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">Sem imagem</span>
        )}

        <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm">
          <Heart
            size={16}
            className={isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'}
          />
        </button>

        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0">
            -{discount}%
          </Badge>
        )}

        {isNew && (
          <Badge className="absolute bottom-2 left-2 bg-green-500 text-white border-0">Novo</Badge>
        )}
      </div>

      <CardContent className="p-3">
        <p className="text-sm font-medium text-gray-800 truncate">{name}</p>

        {rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-500">
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-gray-900">
            R$ {price.toFixed(2).replace('.', ',')}
          </span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              R$ {originalPrice.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const meta: Meta<typeof ProductCardMock> = {
  title: 'Product/ProductCard',
  component: ProductCardMock,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    price: { control: 'number' },
    originalPrice: { control: 'number' },
    rating: { control: { type: 'range', min: 0, max: 5, step: 0.5 } },
    reviewCount: { control: 'number' },
    isNew: { control: 'boolean' },
    isFavorited: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof ProductCardMock>

export const Default: Story = {
  args: {
    name: 'Camiseta Básica',
    price: 59.9,
    rating: 4.5,
    reviewCount: 12,
  },
}

export const WithDiscount: Story = {
  args: {
    name: 'Tênis Esportivo',
    price: 149.9,
    originalPrice: 249.9,
    rating: 4.8,
    reviewCount: 35,
  },
}

export const WithoutRatings: Story = {
  args: {
    name: 'Produto sem avaliações',
    price: 29.9,
    rating: 0,
    reviewCount: 0,
  },
}

export const NewProduct: Story = {
  args: {
    name: 'Produto Recém Lançado',
    price: 89.9,
    isNew: true,
    rating: 0,
  },
}

export const Favorited: Story = {
  args: {
    name: 'Produto Favorito',
    price: 79.9,
    rating: 4.2,
    reviewCount: 8,
    isFavorited: true,
  },
}

export const NoImage: Story = {
  args: {
    name: 'Produto sem imagem',
    price: 45.0,
    rating: 3.5,
    reviewCount: 4,
  },
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <ProductCardMock name="Camiseta" price={59.9} rating={4.5} reviewCount={12} />
      <ProductCardMock
        name="Tênis Esportivo"
        price={149.9}
        originalPrice={249.9}
        rating={4.8}
        reviewCount={35}
      />
      <ProductCardMock name="Produto Novo" price={89.9} isNew rating={0} reviewCount={0} />
    </div>
  ),
}
