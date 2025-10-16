'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, Star, Eye, Save } from 'lucide-react'
import { getColorHex } from '@/schemas'

interface ProductPreviewProps {
  name: string
  description: string
  price: number
  featured: boolean
  selectedImages: File[]
  existingImages?: string[]
  removedExistingImages?: number[]
  onSave?: () => void
  onCancel?: () => void
  isLoading?: boolean
  showActions?: boolean
}

export function ProductPreview({
  name,
  description,
  price,
  featured,
  selectedImages,
  existingImages = [],
  removedExistingImages = [],
  onSave,
  onCancel,
  isLoading = false,
  showActions = true
}: ProductPreviewProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  // Filtrar imagens existentes que não foram removidas
  const remainingExistingImages = existingImages.filter((_, index) => !removedExistingImages.includes(index))
  
  const previewImage = selectedImages.length > 0 
    ? URL.createObjectURL(selectedImages[0])
    : remainingExistingImages.length > 0 
      ? `${process.env.NEXT_PUBLIC_API_URL}${remainingExistingImages[0]}`
      : null

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Preview do Produto */}
      <Card className="p-6 bg-white border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Eye className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Preview</h3>
        </div>

        <div className="space-y-4">
          {/* Imagem Preview */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-16 w-16 text-gray-300" />
              </div>
            )}
          </div>

          {/* Informações Preview */}
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 line-clamp-2">
                {name || 'Nome do produto'}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-3">
                {description || 'Descrição do produto'}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(price)}
              </span>
              {featured && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Star className="h-3 w-3 mr-1" />
                  Destaque
                </Badge>
              )}
            </div>

          </div>
        </div>
      </Card>

      {/* Ações Rápidas */}
      {showActions && (
        <Card className="p-6 bg-white border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Save className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Ações</h3>
          </div>
          
          <div className="space-y-4">
            {onSave && (
              <Button
                type="button"
                onClick={onSave}
                className="w-full h-12"
                disabled={isLoading}
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
