'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  selectedImages: File[]
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
  existingImages?: string[]
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
  existingImages = [],
  title = "Imagens do Produto",
  description = "Adicione fotos de alta qualidade",
  maxFiles = 10,
  maxSize = 5,
  acceptedFormats = "JPEG, PNG, JPG, WEBP"
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const event = {
        target: { files }
      } as unknown as React.ChangeEvent<HTMLInputElement>
      onImageChange(event)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="p-8 bg-white border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-50 rounded-xl">
          <ImageIcon className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Área de Upload */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400'
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
            onChange={onImageChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <ImageIcon className="h-12 w-12 text-blue-500" />
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-900">
                Arraste e solte suas imagens aqui
              </p>
              <p className="text-gray-600">
                ou clique para selecionar arquivos
              </p>
            </div>
            
            <Button
              type="button"
              className=" px-6 py-3"
            >
              <Upload className="h-5 w-5 mr-2" />
              Selecionar Imagens
            </Button>
            
            <p className="text-sm text-gray-500">
              Formatos aceitos: {acceptedFormats} • Máximo {maxSize}MB por imagem
            </p>
          </div>
        </div>

        {/* Imagens Selecionadas */}
        {selectedImages.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Novas Imagens</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Imagens Existentes */}
        {existingImages.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Imagens Atuais</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                    alt={`Produto ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs">Imagem atual</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
