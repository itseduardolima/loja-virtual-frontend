'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area, Point } from 'react-easy-crop'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { cropImageToFile } from '@/lib/cropImageUtils'

interface ImageCropDialogProps {
  open: boolean
  onClose: () => void
  imageSrc: string
  aspect: number
  cropShape?: 'rect' | 'round'
  fileName: string
  onCropDone: (croppedFile: File, previewUrl: string) => void
}

export function ImageCropDialog({
  open,
  onClose,
  imageSrc,
  aspect,
  cropShape = 'rect',
  fileName,
  onCropDone,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return
    setIsConfirming(true)
    try {
      const file = await cropImageToFile(imageSrc, croppedAreaPixels, fileName)
      const previewUrl = URL.createObjectURL(file)
      onCropDone(file, previewUrl)
    } finally {
      setIsConfirming(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4">
          <DialogTitle className="text-[15px] font-semibold text-nxi1">
            {cropShape === 'round' ? 'Ajustar logo' : 'Ajustar banner'}
          </DialogTitle>
        </DialogHeader>

        {/* Cropper area */}
        <div className="relative h-80 bg-nxi1/90">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={cropShape}
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { borderRadius: 0 },
                cropAreaStyle: {
                  border: '2px solid hsl(var(--nxp))',
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
                },
              }}
            />
          )}
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-nxborder">
          <span className="text-[11px] font-medium text-nxi3 w-5 shrink-0">1×</span>
          <Slider
            min={1}
            max={3}
            step={0.05}
            value={[zoom]}
            onValueChange={([v]) => setZoom(v)}
            className="flex-1"
          />
          <span className="text-[11px] font-medium text-nxi3 w-5 shrink-0">3×</span>
        </div>

        <DialogFooter className="px-6 pb-5 pt-0 gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isConfirming}>
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={isConfirming || !croppedAreaPixels}
            className="bg-nxp hover:bg-nxp/90 text-white"
          >
            {isConfirming ? 'Processando…' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
