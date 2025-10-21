'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, Star, Eye, Save } from 'lucide-react'
import { getColorHex } from '@/schemas'
import { formatPrice } from '@/lib/utils'

interface ProductPreviewProps {
  name: string
  description: string
  price: number
  featured: boolean
  selectedImages: File[]
  existingImages?: string[]
  removedExistingImages?: number[]
  category?: { id: number; name: string }
  stock?: number
  dynamicFields?: Array<{ field_name: string; value: string }>
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
  category,
  stock,
  dynamicFields = [],
  onSave,
  onCancel,
  isLoading = false,
  showActions = true
}: ProductPreviewProps) {
  const getColorValue = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      'Preto': '#000000',
      'Branco': '#FFFFFF',
      'Azul': '#0000FF',
      'Vermelho': '#FF0000',
      'Verde': '#00FF00',
      'Amarelo': '#FFFF00',
      'Rosa': '#FFC0CB',
      'Roxo': '#800080',
      'Cinza': '#808080',
      'Marrom': '#A52A2A'
    }
    
    return colorMap[color] || '#E5E7EB'
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
      {/* Preview do Produto - Replicando o estilo do ProductCard */}
      <Card className="p-6 bg-white border-gray-200 shadow-none">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Eye className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Preview</h3>
        </div>

        {/* Card de Preview replicando o ProductCard */}
        <Card className="group relative overflow-hidden bg-white transition-all duration-300 border-0 shadow-none">
          <CardContent className="p-0">
            {/* Container da Imagem */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt={name || 'Preview'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-sm">Sem imagem</span>
                </div>
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

              {/* Campos Dinâmicos */}
              {dynamicFields && dynamicFields.length > 0 && (
                <div className="space-y-1">
                  {dynamicFields.slice(0, 4).map((field, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">{field.field_name}:</span>
                      {field.field_name.toLowerCase() === 'cor' ? (
                        <div className="flex gap-1">
                          {field.value.split(',').slice(0, 4).map((color, colorIndex) => {
                            const trimmedColor = color.trim()
                            return (
                              <div
                                key={colorIndex}
                                className="w-3 h-3 rounded-full border border-gray-300"
                                style={{ backgroundColor: getColorValue(trimmedColor) }}
                                title={trimmedColor}
                              />
                            )
                          })}
                          {field.value.split(',').length > 4 && (
                            <span className="text-xs text-gray-400">
                              +{field.value.split(',').length - 4}
                            </span>
                          )}
                        </div>
                      ) : (
                        field.field_name.toLowerCase() === 'material' || field.field_name.toLowerCase() === 'tipo de sola' ? (
                          <div className="flex gap-1">
                            {field.value.split(',').slice(0, 2).map((item, itemIndex) => (
                              <span key={itemIndex} className="text-xs text-gray-700 font-medium">
                                {item.trim()}
                                {itemIndex < 1 && field.value.split(',').length > 1 ? ',' : ''}
                              </span>
                            ))}
                            {field.value.split(',').length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{field.value.split(',').length - 2} mais
                              </span>
                            )}
                          </div>
                        ) : field.field_name.toLowerCase() === 'gênero' ? (
                          <div className="flex gap-1">
                            {(() => {
                              const values = field.value.split(',').map(v => v.trim())
                              const hasMasculino = values.includes('Masculino')
                              const hasFeminino = values.includes('Feminino')
                              
                              if (hasMasculino && hasFeminino) {
                                return <span className="text-xs text-gray-700 font-medium">Unissex</span>
                              }
                              
                              return field.value.split(',').slice(0, 2).map((item, itemIndex) => (
                                <span key={itemIndex} className="text-xs text-gray-700 font-medium">
                                  {item.trim()}
                                  {itemIndex < 1 && field.value.split(',').length > 1 ? ',' : ''}
                                </span>
                              ))
                            })()}
                            {field.value.split(',').length > 2 && !(field.value.split(',').map(v => v.trim()).includes('Masculino') && field.value.split(',').map(v => v.trim()).includes('Feminino')) && (
                              <span className="text-xs text-gray-500">
                                +{field.value.split(',').length - 2} mais
                              </span>
                            )}
                          </div>
                        ) : field.field_name.toLowerCase() === 'numeração' ? (
                          <div className="flex gap-1">
                            {field.value.split(',').slice(0, 3).map((item, itemIndex) => (
                              <span key={itemIndex} className="text-xs text-gray-700 font-medium">
                                {item.trim()}
                                {itemIndex < 2 && field.value.split(',').length > 1 ? ',' : ''}
                              </span>
                            ))}
                            {field.value.split(',').length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{field.value.split(',').length - 3} mais
                              </span>
                            )}
                          </div>
                        ) : field.field_name.toLowerCase() === 'tamanho' ? (
                          <div className="flex gap-1">
                            {field.value.split(',').slice(0, 4).map((item, itemIndex) => (
                              <span key={itemIndex} className="text-xs text-gray-700 font-medium">
                                {item.trim()}
                                {itemIndex < 3 && field.value.split(',').length > 1 ? ',' : ''}
                              </span>
                            ))}
                            {field.value.split(',').length > 4 && (
                              <span className="text-xs text-gray-500">
                                +{field.value.split(',').length - 4} mais
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-700 font-medium">
                            {field.value}
                          </span>
                        )
                      )}
                    </div>
                  ))}
                  {dynamicFields.length > 4 && (
                    <div className="text-xs text-gray-400">
                      +{dynamicFields.length - 4} mais
                    </div>
                  )}
                </div>
              )}

            </div>
          </CardContent>
        </Card>
      </Card>

      {/* Ações Rápidas */}
      {showActions && (
        <Card className="p-6 bg-white border-gray-200">
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
