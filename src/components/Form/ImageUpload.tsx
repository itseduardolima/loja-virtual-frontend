'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, GripVertical } from 'lucide-react'

interface ImageUploadProps {
  selectedImages: File[]
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
  onReorderImages?: (newImages: File[]) => void
  existingImages?: string[]
  onRemoveExistingImage?: (index: number) => void
  removedExistingImages?: number[]
  title?: string
  description?: string
  maxFiles?: number
  maxSize?: number // em MB
  acceptedFormats?: string
}

export function ImageUpload({
  selectedImages,
  onImageChange,
  onRemoveImage,
  onReorderImages,
  existingImages = [],
  onRemoveExistingImage,
  removedExistingImages = [],
  title = "Imagens do Produto",
  description = "Adicione fotos de alta qualidade",
  maxFiles = 10,
  maxSize = 5,
  acceptedFormats = "JPEG, PNG, JPG, WEBP"
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragItemIndex, setDragItemIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const event = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>
      onImageChange(event)
    }
  }

  // Item reorder handlers
  const handleItemDragStart = (idx: number, e: React.DragEvent) => {
    e.stopPropagation()
    setDragItemIndex(idx)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(idx))
  }

  const handleItemDragOver = (idx: number, e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverIndex !== idx) setDragOverIndex(idx)
  }

  const handleItemDrop = (targetIdx: number, e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragItemIndex === null || dragItemIndex === targetIdx || !onReorderImages) {
      setDragItemIndex(null)
      setDragOverIndex(null)
      return
    }
    const items = [...selectedImages]
    const [removed] = items.splice(dragItemIndex, 1)
    items.splice(targetIdx, 0, removed)
    onReorderImages(items)
    setDragItemIndex(null)
    setDragOverIndex(null)
  }

  const handleItemDragEnd = () => {
    setDragItemIndex(null)
    setDragOverIndex(null)
  }

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
        {/* Upload area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            isDragOver ? 'border-primary bg-gray-50' : 'border-gray-300 hover:border-primary'
          }`}
          onDragOver={handleAreaDragOver}
          onDragLeave={handleAreaDragLeave}
          onDrop={handleAreaDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-50 rounded-full">
              <ImageIcon className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-900">Arraste e solte suas imagens aqui</p>
              <p className="text-gray-600">ou clique para selecionar arquivos</p>
            </div>
            <Button type="button" className="px-6 py-3">
              <Upload className="h-5 w-5 mr-2" />
              Selecionar Imagens
            </Button>
            <p className="text-sm text-gray-500">
              Formatos aceitos: {acceptedFormats} • Máximo {maxSize}MB por imagem
            </p>
          </div>
        </div>

        {/* New images — draggable to reorder */}
        {selectedImages.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Novas Imagens</h3>
              {onReorderImages && (
                <p className="text-xs text-gray-500">Arraste para reordenar · A primeira é a principal</p>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedImages.map((image, index) => {
                const isDragging = dragItemIndex === index
                const isDropTarget = dragOverIndex === index && dragItemIndex !== index
                return (
                  <div
                    key={index}
                    draggable={!!onReorderImages}
                    onDragStart={(e) => onReorderImages && handleItemDragStart(index, e)}
                    onDragOver={(e) => onReorderImages && handleItemDragOver(index, e)}
                    onDrop={(e) => onReorderImages && handleItemDrop(index, e)}
                    onDragEnd={handleItemDragEnd}
                    className={`relative group transition-all
                      ${onReorderImages ? 'cursor-grab active:cursor-grabbing' : ''}
                      ${isDragging ? 'opacity-40 scale-95' : ''}
                      ${isDropTarget ? 'ring-2 ring-primary ring-offset-1 rounded-lg' : ''}
                    `}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg select-none"
                      draggable={false}
                    />
                    {index === 0 && (
                      <div className="absolute top-1 left-1 bg-primary text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        Principal
                      </div>
                    )}
                    {onReorderImages && (
                      <div className="absolute top-1 right-7 bg-black bg-opacity-40 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-3 w-3" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Imagens Atuais</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingImages.map((image, index) => {
                const isMarkedForRemoval = removedExistingImages.includes(index)
                return (
                  <div key={index} className={`relative group ${isMarkedForRemoval ? 'opacity-50' : ''}`}>
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                      alt={`Produto ${index + 1}`}
                      className={`w-full h-24 object-cover rounded-lg ${isMarkedForRemoval ? 'grayscale' : ''}`}
                    />
                    {isMarkedForRemoval && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-75 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">Removida</span>
                      </div>
                    )}
                    {onRemoveExistingImage && !isMarkedForRemoval && (
                      <button
                        type="button"
                        onClick={() => onRemoveExistingImage(index)}
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
        )}
      </div>
    </Card>
  )
}
