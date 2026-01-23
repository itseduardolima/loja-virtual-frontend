'use client'

import { useState, useRef } from 'react'
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
    <Card className="p-8 bg-white border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gray-50 rounded-xl">
          <ImageIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Seleção de Cor */}
        {allColors.length > 0 && (
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Selecione uma cor para adicionar imagens:
            </Label>
            <div className="flex gap-3 flex-wrap">
              {allColors.map((color) => {
                const colorValue = getColorHex(color)
                const isSelected = selectedColor === color
                const hasImages = (imagesByColor[color]?.length || 0) > 0 || (existingImagesByColor[color]?.length || 0) > 0

                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    className={`relative w-12 h-12 rounded-full border-2 transition-all p-0 ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: colorValue }}
                    title={color}
                  >
                    {colorValue === '#FFFFFF' && (
                      <div className="absolute inset-0 rounded-full border border-gray-400"></div>
                    )}
                    {hasImages && (
                      <div className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
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
            
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gray-50 rounded-full">
                <ImageIcon className="h-12 w-12 text-primary" />
              </div>
              
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-900">
                  Adicionar imagens para: <span className="text-primary">{selectedColor}</span>
                </p>
                <p className="text-gray-600">
                  Arraste e solte ou clique para selecionar
                </p>
              </div>
              
              <Button
                type="button"
                className="px-6 py-3"
              >
                <Upload className="h-5 w-5 mr-2" />
                Selecionar Imagens
              </Button>
              
              <p className="text-sm text-gray-500">
                Formatos aceitos: {acceptedFormats} • Máximo {maxSize}MB por imagem
              </p>
            </div>
          </div>
        )}

        {/* Imagens por Cor - Novas */}
        {Object.keys(imagesByColor).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Novas Imagens por Cor</h3>
            {Object.entries(imagesByColor).map(([color, images]) => (
              <div key={color} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: getColorHex(color) }}
                  />
                  <span className="text-sm font-medium text-gray-700">{color}</span>
                  
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`${color} ${index + 1}`}
                        className="w-full h-52 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(color, index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
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
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Imagens Atuais por Cor</h3>
            {Object.entries(existingImagesByColor).map(([color, imageUrls]) => {
              const removedIndices = removedExistingImages[color] || []
              return (
                <div key={color} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                    <span className="text-sm font-medium text-gray-700">{color}</span>
                    
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imageUrls.map((imageUrl, index) => {
                      const isMarkedForRemoval = removedIndices.includes(index)
                      return (
                        <div key={index} className={`relative group ${isMarkedForRemoval ? 'opacity-50' : ''}`}>
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
                            alt={`${color} ${index + 1}`}
                            className={`w-full h-52 object-cover rounded-lg ${isMarkedForRemoval ? 'grayscale' : ''}`}
                          />
                          {isMarkedForRemoval && (
                            <div className="absolute inset-0 bg-red-500 bg-opacity-75 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">Removida</span>
                            </div>
                          )}
                          {onRemoveExistingImage && !isMarkedForRemoval && (
                            <button
                              type="button"
                              onClick={() => onRemoveExistingImage(color, index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
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

