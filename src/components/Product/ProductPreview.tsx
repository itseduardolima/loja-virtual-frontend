'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Eye, Save } from 'lucide-react'
import { EmptyImageState } from './EmptyImageState'
import { formatPrice, buildImageUrl } from '@/lib/utils'

interface ProductPreviewProps {
  name: string
  description: string
  price: number
  featured: boolean
  selectedImages?: File[]
  imagesByColor?: Record<string, File[]>
  existingImages?: string[]
  removedExistingImages?: number[]
  category?: { id: number; name: string }
  stock?: number
  onSave?: () => void
  onCancel?: () => void
  isLoading?: boolean
  showActions?: boolean
  isDisabled?: boolean
}

export function ProductPreview({
  name,
  description,
  price,
  featured,
  selectedImages = [],
  imagesByColor = {},
  existingImages = [],
  removedExistingImages = [],
  category,
  stock,
  onSave,
  onCancel,
  isLoading = false,
  showActions = true,
  isDisabled = false
}: ProductPreviewProps) {
  // Filtrar imagens existentes que não foram removidas
  const remainingExistingImages = existingImages.filter((_, index) => !removedExistingImages.includes(index))
  
  // Obter primeira imagem disponível (prioridade: novas por cor > novas simples > existentes)
  const allNewByColor = Object.values(imagesByColor || {}).flat()
  let previewImage: string | null = null

  if (allNewByColor.length > 0) {
    previewImage = URL.createObjectURL(allNewByColor[0])
  } else if (selectedImages.length > 0) {
    previewImage = URL.createObjectURL(selectedImages[0])
  } else if (remainingExistingImages.length > 0) {
    previewImage = buildImageUrl(remainingExistingImages[0])
  }

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Preview do Produto - Replicando o estilo do ProductCard */}
      <Card className="p-6 bg-white border-0 shadow-none">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Preview</h3>
        </div>

        {/* Card de Preview replicando o ProductCard */}
        <Card className="group relative overflow-hidden bg-white transition-all duration-300 border-0 shadow-none">
          <CardContent className="p-0">
            {/* Container da Imagem */}
            <div className="relative aspect-square overflow-hidden bg-white flex items-center justify-center rounded-2xl">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt={name || 'Preview'}
                  className="object-cover w-full h-full rounded-2xl"
                />
              ) : (
                <EmptyImageState className="w-full h-full" iconSize="lg" />
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {/* Não mostrar "Esgotado" no preview de criação */}
                {featured && (
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                )}
              </div>
            </div>

            {/* Informações do Produto */}
            <div className="p-3 space-y-2">
              {/* Nome do Produto */}
              <h3 className="font-medium text-gray-900 text-sm line-clamp-2 transition-colors">
                {name || 'Nome do produto'}
              </h3>

              {/* Categoria */}
              {category && (
                <p className="text-xs text-gray-500">
                  {category.name}
                </p>
              )}

              {/* Preço */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-text-dark">
                  {formatPrice(price || 0)}
                </span>
                {stock !== undefined && stock > 0 && (
                  <span className="text-xs text-gray-500">
                    {stock} em estoque
                  </span>
                )}
              </div>

            </div>
          </CardContent>
        </Card>
      </Card>

      {/* Ações Rápidas */}
      {showActions && (
        <Card className="p-6 bg-white border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Save className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Ações</h3>
          </div>
          
          <div className="space-y-4">
            {onSave && (
              <Button
                type="button"
                onClick={onSave}
                className="w-full h-12"
                disabled={isLoading || isDisabled}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    Salvar Alterações
                  </>
                )}
              </Button>
            )}

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="w-full h-12"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            )}

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                As alterações serão salvas automaticamente
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
