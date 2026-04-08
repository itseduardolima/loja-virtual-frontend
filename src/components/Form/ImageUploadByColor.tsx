'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, GripVertical } from 'lucide-react'
import { getColorHex } from '@/schemas'
import { buildImageUrl } from '@/lib/utils'

export type OrderedImage =
  | { type: 'existing'; url: string }
  | { type: 'new'; file: File }

interface ImageUploadByColorProps {
  orderedImagesByColor: Record<string, OrderedImage[]>
  onOrderedImagesChange: (color: string, newOrder: OrderedImage[]) => void
  availableColors?: string[]
  title?: string
  description?: string
  maxFilesPerColor?: number
  maxSize?: number
  acceptedFormats?: string
}

export function ImageUploadByColor({
  orderedImagesByColor,
  onOrderedImagesChange,
  availableColors = [],
  title = "Imagens do Produto por Cor",
  description = "Adicione fotos organizadas por cor",
  maxSize = 5,
  acceptedFormats = "JPEG, PNG, JPG, WEBP"
}: ImageUploadByColorProps) {
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragItemIndex, setDragItemIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [dragColor, setDragColor] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const objectUrlCacheRef = useRef<Map<File, string>>(new Map())

  useEffect(() => {
    return () => {
      objectUrlCacheRef.current.forEach(url => URL.revokeObjectURL(url))
      objectUrlCacheRef.current.clear()
    }
  }, [])

  const allColors = Array.from(new Set([...availableColors, ...Object.keys(orderedImagesByColor)]))

  // Auto-select first color with images, or first available
  useEffect(() => {
    if (!selectedColor && allColors.length > 0) {
      const withImages = allColors.find(c => (orderedImagesByColor[c]?.length || 0) > 0)
      const first = withImages || allColors[0]
      setSelectedColor(first)
      if (!orderedImagesByColor[first]) {
        onOrderedImagesChange(first, [])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableColors, Object.keys(orderedImagesByColor).join(',')])

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    if (!orderedImagesByColor[color]) {
      onOrderedImagesChange(color, [])
    }
  }

  const MIN_IMAGES = 2
  const MAX_IMAGES_PER_COLOR = 5

  const currentColorCount = selectedColor ? (orderedImagesByColor[selectedColor]?.length || 0) : 0

  const addFiles = (files: File[]) => {
    if (!selectedColor || files.length === 0) return
    const current = orderedImagesByColor[selectedColor] || []
    const remaining = MAX_IMAGES_PER_COLOR - current.length
    if (remaining <= 0) return
    const toAdd = files.slice(0, remaining).map(f => ({ type: 'new' as const, file: f }))
    onOrderedImagesChange(selectedColor, [...current, ...toAdd])
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedColor) return
    addFiles(Array.from(e.target.files || []))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Upload area drag handlers (only react to file drops)
  const handleAreaDragOver = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes('Files')) return
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleAreaDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleAreaDrop = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes('Files')) return
    e.preventDefault()
    setIsDragOver(false)
    if (!selectedColor) return
    addFiles(Array.from(e.dataTransfer.files))
  }

  const handleRemoveItem = (color: string, idx: number) => {
    const current = orderedImagesByColor[color] || []
    onOrderedImagesChange(color, current.filter((_, i) => i !== idx))
  }

  // Item drag-and-drop reorder handlers
  const handleItemDragStart = (color: string, idx: number, e: React.DragEvent) => {
    e.stopPropagation()
    setDragItemIndex(idx)
    setDragColor(color)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(idx)) // required for Firefox
  }

  const handleItemDragOver = (color: string, idx: number, e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragColor !== color) return
    e.dataTransfer.dropEffect = 'move'
    if (dragOverIndex !== idx) setDragOverIndex(idx)
  }

  const handleItemDrop = (color: string, targetIdx: number, e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragColor !== color || dragItemIndex === null || dragItemIndex === targetIdx) {
      setDragItemIndex(null)
      setDragOverIndex(null)
      setDragColor(null)
      return
    }
    const items = [...(orderedImagesByColor[color] || [])]
    const [removed] = items.splice(dragItemIndex, 1)
    items.splice(targetIdx, 0, removed)
    onOrderedImagesChange(color, items)
    setDragItemIndex(null)
    setDragOverIndex(null)
    setDragColor(null)
  }

  const handleItemDragEnd = () => {
    setDragItemIndex(null)
    setDragOverIndex(null)
    setDragColor(null)
  }

  const getImageSrc = useCallback((item: OrderedImage): string => {
    if (item.type === 'existing') return buildImageUrl(item.url)
    if (!objectUrlCacheRef.current.has(item.file)) {
      objectUrlCacheRef.current.set(item.file, URL.createObjectURL(item.file))
    }
    return objectUrlCacheRef.current.get(item.file)!
  }, [])

  return (
    <Card className="p-4 sm:p-6 lg:p-8 bg-white border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
        <div className="p-2 sm:p-3 bg-gray-50 rounded-xl flex-shrink-0">
          <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-xs sm:text-sm text-gray-500">{description}</p>
        </div>
        {selectedColor && (
          <div className="flex-shrink-0 text-right">
            <span className={`text-sm font-semibold ${
              currentColorCount < MIN_IMAGES ? 'text-red-500' :
              currentColorCount >= MAX_IMAGES_PER_COLOR ? 'text-amber-500' :
              'text-green-600'
            }`}>
              {currentColorCount}/{MAX_IMAGES_PER_COLOR}
            </span>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {currentColorCount === MAX_IMAGES_PER_COLOR ? 'limite atingido' : `${MIN_IMAGES} por cor`}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Color selector */}
        {allColors.length > 0 && (
          <div>
            <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 block">
              Selecione uma cor para adicionar imagens:
            </Label>
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {allColors.map((color) => {
                const colorValue = getColorHex(color)
                const isSelected = selectedColor === color
                const count = orderedImagesByColor[color]?.length || 0

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
                      <div className="absolute inset-0 rounded-full border border-gray-400" />
                    )}
                    {count > 0 && (
                      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-primary text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                        {count}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Upload area */}
        {selectedColor && (
          <div
            className={`border-2 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 text-center transition-colors ${
              currentColorCount >= MAX_IMAGES_PER_COLOR
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                : isDragOver
                ? 'border-primary bg-gray-50 cursor-pointer'
                : 'border-gray-300 hover:border-primary cursor-pointer'
            }`}
            onDragOver={currentColorCount >= MAX_IMAGES_PER_COLOR ? undefined : handleAreaDragOver}
            onDragLeave={currentColorCount >= MAX_IMAGES_PER_COLOR ? undefined : handleAreaDragLeave}
            onDrop={currentColorCount >= MAX_IMAGES_PER_COLOR ? undefined : handleAreaDrop}
            onClick={() => {
              if (currentColorCount >= MAX_IMAGES_PER_COLOR || !selectedColor) return
              fileInputRef.current?.click()
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gray-50 rounded-full">
                <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
              </div>
              <div className="space-y-1 sm:space-y-2">
                {currentColorCount >= MAX_IMAGES_PER_COLOR ? (
                  <p className="text-base sm:text-lg font-semibold text-gray-500">
                    Limite de {MAX_IMAGES_PER_COLOR} imagens por cor atingido
                  </p>
                ) : (
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    Adicionar imagens para: <span className="text-primary">{selectedColor}</span>
                  </p>
                )}
                <p className="text-sm sm:text-base text-gray-600">
                  {currentColorCount >= MAX_IMAGES_PER_COLOR ? 'Remova imagens para adicionar novas' : 'Arraste e solte ou clique para selecionar'}
                </p>
              </div>
              <Button type="button" className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base" disabled={currentColorCount >= MAX_IMAGES_PER_COLOR}>
                <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Selecionar Imagens
              </Button>
              <p className="text-xs sm:text-sm text-gray-500 px-2">
                Formatos aceitos: {acceptedFormats} • Máximo {maxSize}MB por imagem • {MIN_IMAGES} imagens por cor
              </p>
            </div>
          </div>
        )}

        {/* Images for selected color */}
        {selectedColor && (orderedImagesByColor[selectedColor]?.length || 0) > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-gray-500">
              Arraste as imagens para reordenar. A primeira imagem é a principal.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {(orderedImagesByColor[selectedColor] || []).map((item, idx) => {
                const isDragging = dragColor === selectedColor && dragItemIndex === idx
                const isDropTarget = dragColor === selectedColor && dragOverIndex === idx && dragItemIndex !== idx
                return (
                  <div
                    key={idx}
                    draggable
                    onDragStart={(e) => handleItemDragStart(selectedColor, idx, e)}
                    onDragOver={(e) => handleItemDragOver(selectedColor, idx, e)}
                    onDrop={(e) => handleItemDrop(selectedColor, idx, e)}
                    onDragEnd={handleItemDragEnd}
                    className={`relative group cursor-grab active:cursor-grabbing transition-all
                      ${isDragging ? 'opacity-40 scale-95' : ''}
                      ${isDropTarget ? 'ring-2 ring-primary ring-offset-1 rounded-lg' : ''}
                    `}
                  >
                    <img
                      src={getImageSrc(item)}
                      alt={`${selectedColor} ${idx + 1}`}
                      className="w-full h-32 sm:h-40 md:h-48 lg:h-52 object-cover rounded-lg select-none"
                      draggable={false}
                    />
                    {/* Principal badge */}
                    {idx === 0 && (
                      <div className="absolute top-1 left-1 bg-primary text-white text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded">
                        Principal
                      </div>
                    )}
                    {/* Drag handle */}
                    <div className="absolute top-1 right-7 bg-black bg-opacity-40 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                    {/* New image badge */}
                    {item.type === 'new' && (
                      <div className="absolute bottom-1 left-1 bg-green-500 text-white text-[10px] font-semibold px-1 py-0.5 rounded">
                        Nova
                      </div>
                    )}
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(selectedColor, idx)}
                      className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 sm:p-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
