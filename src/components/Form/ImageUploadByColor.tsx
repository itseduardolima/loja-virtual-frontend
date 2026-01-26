'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react'
import { getColorHex } from '@/schemas'

interface ImageUploadByColorProps {
  imagesByColor: Record<string, File[]>
  onImagesByColorChange: (imagesByColor: Record<string, File[]>) => void
  availableColors?: string[]
  existingImagesByColor?: Record<string, string[]>
  onRemoveExistingImage?: (color: string, index: number) => void
  removedExistingImages?: Record<string, number[]>
  title?: string
  description?: string
  maxFilesPerColor?: number
  maxSize?: number
  acceptedFormats?: string
}

export function ImageUploadByColor({
  imagesByColor,
  onImagesByColorChange,
  availableColors = [],
  existingImagesByColor = {},
  onRemoveExistingImage,
  removedExistingImages = {},
  title = "Imagens do Produto por Cor",
  description = "Adicione fotos organizadas por cor",
  maxFilesPerColor = 10,
  maxSize = 5,
  acceptedFormats = "JPEG, PNG, JPG, WEBP"
}: ImageUploadByColorProps) {
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Selecionar automaticamente a primeira cor que tem imagens existentes
  useEffect(() => {
    if (!selectedColor && (Object.keys(existingImagesByColor).length > 0 || availableColors.length > 0)) {
      const allColors = Array.from(new Set([...availableColors, ...Object.keys(imagesByColor), ...Object.keys(existingImagesByColor)]))
      
      // Primeiro, tentar selecionar uma cor que tem imagens existentes
      const colorWithExistingImages = allColors.find(color => {
        const existingImages = existingImagesByColor[color] || []
        const removedIndices = removedExistingImages[color] || []
        return existingImages.length > removedIndices.length
      })
      
      if (colorWithExistingImages) {
        setSelectedColor(colorWithExistingImages)
        if (!imagesByColor[colorWithExistingImages]) {
          onImagesByColorChange({ ...imagesByColor, [colorWithExistingImages]: [] })
        }
      } else if (allColors.length > 0) {
        // Se não houver imagens existentes, selecionar a primeira cor disponível
        const firstColor = allColors[0]
        setSelectedColor(firstColor)
        if (!imagesByColor[firstColor]) {
          onImagesByColorChange({ ...imagesByColor, [firstColor]: [] })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingImagesByColor, availableColors])

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    if (!imagesByColor[color]) {
      onImagesByColorChange({ ...imagesByColor, [color]: [] })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedColor) {
      alert('Por favor, selecione uma cor primeiro')
      return
    }

    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const currentImages = imagesByColor[selectedColor] || []
    const newImages = [...currentImages, ...files].slice(0, maxFilesPerColor)
    
    onImagesByColorChange({
      ...imagesByColor,
      [selectedColor]: newImages
    })

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (!selectedColor) {
      alert('Por favor, selecione uma cor primeiro')
      return
    }

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    const currentImages = imagesByColor[selectedColor] || []
    const newImages = [...currentImages, ...files].slice(0, maxFilesPerColor)
    
    onImagesByColorChange({
      ...imagesByColor,
      [selectedColor]: newImages
    })
  }

  const handleRemoveImage = (color: string, index: number) => {
    const currentImages = imagesByColor[color] || []
    const newImages = currentImages.filter((_, i) => i !== index)
    
    if (newImages.length === 0) {
      const { [color]: removed, ...rest } = imagesByColor
      onImagesByColorChange(rest)
      if (selectedColor === color) {
        setSelectedColor('')
      }
    } else {
      onImagesByColorChange({
        ...imagesByColor,
        [color]: newImages
      })
    }
  }

  const handleClick = () => {
    if (!selectedColor) {
      alert('Por favor, selecione uma cor primeiro')
      return
    }
    fileInputRef.current?.click()
  }

  const allColors = Array.from(new Set([...availableColors, ...Object.keys(imagesByColor), ...Object.keys(existingImagesByColor)]))

  return (
    <Card className="p-4 sm:p-6 lg:p-8 bg-white border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
        <div className="p-2 sm:p-3 bg-gray-50 rounded-xl flex-shrink-0">
          <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-xs sm:text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Seleção de Cor */}
        {allColors.length > 0 && (
          <div>
            <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 block">
              Selecione uma cor para adicionar imagens:
            </Label>
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {allColors.map((color) => {
                const colorValue = getColorHex(color)
                const isSelected = selectedColor === color
                const hasImages = (imagesByColor[color]?.length || 0) > 0 || (existingImagesByColor[color]?.length || 0) > 0

                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    className={`relative rounded-full border-2 transition-all p-0 flex-shrink-0
                      w-10 h-10 sm:w-12 sm:h-12
                      ${isSelected
                        ? 'border-primary ring-2 ring-primary ring-offset-1 sm:ring-offset-2'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    style={{ backgroundColor: colorValue }}
                    title={color}
                  >
                    {colorValue === '#FFFFFF' && (
                      <div className="absolute inset-0 rounded-full border border-gray-400"></div>
                    )}
                    {hasImages && (
                      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-primary text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                        {(imagesByColor[color]?.length || 0) + (existingImagesByColor[color]?.length || 0)}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Área de Upload */}
        {selectedColor && (
          <div
            className={`border-2 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 text-center transition-colors cursor-pointer ${
              isDragOver
                ? 'border-primary bg-gray-50'
                : 'border-gray-300 hover:border-primary'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gray-50 rounded-full">
                <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  Adicionar imagens para: <span className="text-primary">{selectedColor}</span>
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  Arraste e solte ou clique para selecionar
                </p>
              </div>
              
              <Button
                type="button"
                className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
              >
                <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Selecionar Imagens
              </Button>
              
              <p className="text-xs sm:text-sm text-gray-500 px-2">
                Formatos aceitos: {acceptedFormats} • Máximo {maxSize}MB por imagem
              </p>
            </div>
          </div>
        )}

        {/* Imagens por Cor - Novas */}
        {Object.entries(imagesByColor).some(([_, images]) => images && images.length > 0) && (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-700">Novas Imagens por Cor</h3>
            {Object.entries(imagesByColor)
              .filter(([_, images]) => images && images.length > 0)
              .map(([color, images]) => (
                <div key={color} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{color}</span>
                    
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`${color} ${index + 1}`}
                          className="w-full h-32 sm:h-40 md:h-48 lg:h-52 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(color, index)}
                          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 sm:p-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Imagens Existentes por Cor */}
        {Object.keys(existingImagesByColor).length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-700">Imagens Atuais por Cor</h3>
            {Object.entries(existingImagesByColor).map(([color, imageUrls]) => {
              const removedIndices = removedExistingImages[color] || []
              return (
                <div key={color} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{color}</span>
                    
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    {imageUrls.map((imageUrl, index) => {
                      const isMarkedForRemoval = removedIndices.includes(index)
                      return (
                        <div key={index} className={`relative group ${isMarkedForRemoval ? 'opacity-50' : ''}`}>
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
                            alt={`${color} ${index + 1}`}
                            className={`w-full h-32 sm:h-40 md:h-48 lg:h-52 object-cover rounded-lg ${isMarkedForRemoval ? 'grayscale' : ''}`}
                          />
                          {isMarkedForRemoval && (
                            <div className="absolute inset-0 bg-red-500 bg-opacity-75 rounded-lg flex items-center justify-center">
                              <span className="text-white text-[10px] sm:text-xs font-semibold">Removida</span>
                            </div>
                          )}
                          {onRemoveExistingImage && !isMarkedForRemoval && (
                            <button
                              type="button"
                              onClick={() => onRemoveExistingImage(color, index)}
                              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 sm:p-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Card>
  )
}

