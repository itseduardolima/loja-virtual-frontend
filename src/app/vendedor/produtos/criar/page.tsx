'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button, Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, Badge, LoadingSpinner, ErrorState } from '@/components'
import { ArrowLeft, Upload, X, Plus, Tag, Palette, Ruler, Package, Star, Camera, Image as ImageIcon, Trash2, Edit3, Save, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCreateProductPage } from './useCreateProductPage'
import { SIZE_OPTIONS, COLOR_OPTIONS, getColorHex } from '@/schemas'

export default function CreateProductPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const {
    form,
    selectedImages,
    selectedSizes,
    selectedColors,
    categories,
    isLoading,
    error,
    handleImageChange,
    removeImage,
    toggleSize,
    toggleColor,
    onSubmit
  } = useCreateProductPage(user)

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form

  if (authLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <ErrorState message="Você precisa estar logado para criar produtos" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Estilizado */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
          {/* Layout em Duas Colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Coluna Principal - Informações do Produto */}
            <div className="lg:col-span-2 space-y-6">

              {/* Informações Básicas */}
              <Card className="p-8 bg-white border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Package className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Informações Básicas</h2>
                    <p className="text-sm text-gray-500">Dados essenciais do produto</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Nome */}
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Nome do Produto *
                    </Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Ex: Camiseta Básica Feminina"
                      className={`h-12 text-lg ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Descrição */}
                  <div>
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Descrição do Produto
                    </Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Descreva as características, materiais e benefícios do produto..."
                      rows={4}
                      className={`${errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors resize-none`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Preço e Estoque */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="price" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Preço de Venda *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0.01"
                          {...register('price', { valueAsNumber: true })}
                          placeholder="0,00"
                          className={`h-12 pl-8 text-lg ${errors.price ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.price.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="stock" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Quantidade em Estoque
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        {...register('stock', { valueAsNumber: true })}
                        placeholder="0"
                        className={`h-12 text-lg ${errors.stock ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
                      />
                      {errors.stock && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.stock.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Categoria e Destaque */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="category_id" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Categoria
                      </Label>
                      <Select onValueChange={(value) => setValue('category_id', parseInt(value))}>
                        <SelectTrigger className={`h-12 ${errors.category_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(categories) && categories.map((category: any) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category_id && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.category_id.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <input
                          type="checkbox"
                          id="featured"
                          {...register('featured')}
                          className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded"
                        />
                        <Label htmlFor="featured" className="flex items-center gap-2 text-gray-800 font-medium cursor-pointer">
                          <Star className="h-5 w-5 text-yellow-500" />
                          Produto em Destaque
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Upload de Imagens */}
              <Card className="p-8 bg-white border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Camera className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Imagens do Produto</h2>
                    <p className="text-sm text-gray-500">Adicione fotos de alta qualidade</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Área de Upload */}
                  <div className="border-2 border-dashed border-pink-200 rounded-xl p-8 text-center hover:border-pink-300 transition-colors">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-pink-50 rounded-full">
                        <ImageIcon className="h-8 w-8 text-pink-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Arraste e solte suas imagens aqui
                        </h3>
                        <p className="text-gray-500 mb-4">
                          ou clique para selecionar arquivos
                        </p>
                        <Input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Label
                          htmlFor="images"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/90 text-white rounded-lg hover:bg-blue-600/90 transition-all duration-200 cursor-pointer"
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar Imagens
                        </Label>
                      </div>
                      <p className="text-xs text-gray-400">
                        Formatos aceitos: JPG, PNG, GIF • Máximo 5MB por imagem
                      </p>
                    </div>
                  </div>

                  {/* Preview das Imagens */}
                  {selectedImages.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Imagens Selecionadas ({selectedImages.length})
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.getElementById('images') as HTMLInputElement
                            if (input) input.click()
                          }}
                          className="text-gray-600 border-gray-200 hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Mais
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group-hover:border-gray-300 transition-colors">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => removeImage(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {index === 0 && (
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-pink-500 text-white text-xs">
                                  Principal
                                </Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Tamanhos e Cores */}
              <Card className="p-8 bg-white border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Ruler className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Variações do Produto</h2>
                    <p className="text-sm text-gray-500">Tamanhos e cores disponíveis</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Tamanhos */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Ruler className="h-5 w-5 text-green-600" />
                      Tamanhos Disponíveis
                    </h3>

                    <div className="grid grid-cols-4 gap-3">
                      {SIZE_OPTIONS.map((size) => (
                        <Button
                          key={size}
                          type="button"
                          variant={selectedSizes.includes(size) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleSize(size)}
                          className={`h-12 font-semibold transition-all duration-200 ${selectedSizes.includes(size)
                              ? 'bg-blue-500/90 text-white shadow-sm'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>

                    {selectedSizes.length > 0 && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-sm font-medium text-gray-800 mb-2">Tamanhos selecionados:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSizes.map((size) => (
                            <Badge key={size} className="bg-gray-100 text-gray-800 border-gray-300">
                              {size}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cores */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Palette className="h-5 w-5 text-purple-600" />
                      Cores Disponíveis
                    </h3>

                    <div className="grid grid-cols-3 gap-3">
                      {COLOR_OPTIONS.map((color) => (
                        <Button
                          key={color}
                          type="button"
                          variant={selectedColors.includes(color) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleColor(color)}
                          className={`h-12 flex items-center gap-2 transition-all duration-200 ${selectedColors.includes(color)
                              ? 'bg-blue-500/90 text-white shadow-sm'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          <div
                            className="w-4 h-4 rounded-full border-2"
                            style={{
                              backgroundColor: getColorHex(color),
                              borderColor: selectedColors.includes(color) ? '#fff' : '#d1d5db'
                            }}
                          />
                          <span className="text-xs font-medium">{color}</span>
                        </Button>
                      ))}
                    </div>

                    {selectedColors.length > 0 && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-sm font-medium text-gray-800 mb-2">Cores selecionadas:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedColors.map((color) => (
                            <Badge key={color} className="bg-gray-100 text-gray-800 border-gray-300 flex items-center gap-1">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getColorHex(color) }}
                              />
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar - Preview e Ações */}
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
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    {selectedImages.length > 0 ? (
                      <img
                        src={URL.createObjectURL(selectedImages[0])}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm">Nenhuma imagem</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Informações Preview */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 line-clamp-2">
                        {watch('name') || 'Nome do produto'}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {watch('description') || 'Descrição do produto'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        {watch('price') ? `R$ ${watch('price').toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
                      </span>
                      {watch('featured') && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Star className="h-3 w-3 mr-1" />
                          Destaque
                        </Badge>
                      )}
                    </div>

                    {/* Variações Preview */}
                    {(selectedSizes.length > 0 || selectedColors.length > 0) && (
                      <div className="space-y-2">
                        {selectedSizes.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">Tamanhos:</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedSizes.slice(0, 3).map((size) => (
                                <span key={size} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {size}
                                </span>
                              ))}
                              {selectedSizes.length > 3 && (
                                <span className="text-xs text-gray-500">+{selectedSizes.length - 3}</span>
                              )}
                            </div>
                          </div>
                        )}

                        {selectedColors.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">Cores:</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedColors.slice(0, 3).map((color) => (
                                <div key={color} className="flex items-center gap-1">
                                  <div
                                    className="w-3 h-3 rounded-full border"
                                    style={{ backgroundColor: getColorHex(color) }}
                                  />
                                  <span className="text-xs">{color}</span>
                                </div>
                              ))}
                              {selectedColors.length > 3 && (
                                <span className="text-xs text-gray-500">+{selectedColors.length - 3}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Ações Rápidas */}
              <Card className="p-6 bg-white border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Save className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Ações</h3>
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-blue-500/90 hover:bg-blue-600/90 text-white font-semibold shadow-lg transition-all duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        Criando Produto...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        Criar Produto
                      </div>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="w-full h-12 border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Cancelar
                  </Button>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      Ao criar o produto, ele será adicionado ao seu catálogo e ficará disponível para venda.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Erro ao criar produto</h3>
                  <p className="text-red-700 mt-1">{error.message}</p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

