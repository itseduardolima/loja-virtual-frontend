'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ACCEPTED_IMAGE_ACCEPT_ATTR, validateImageFile } from '@/lib/imageValidation'

interface FileUploadZoneProps {
  label: string
  hint: string
  preview: string | null
  onFile: (file: File) => void
  onRemove?: () => void
}

export function FileUploadZone({ label, hint, preview, onFile, onRemove }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pickFile = useCallback(
    (file: File | undefined) => {
      if (!file) return
      const validationError = validateImageFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
      setError(null)
      onFile(file)
    },
    [onFile],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDrag(false)
      pickFile(e.dataTransfer.files[0])
    },
    [pickFile],
  )

  if (preview) {
    return (
      <div
        className="relative overflow-hidden rounded-xl border border-nxborder bg-nxbg"
        style={{ height: 128 }}
      >
        <Image src={preview} alt="" fill className="object-contain p-2" />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remover ${label.toLowerCase()}`}
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-nxi2 shadow-sm transition-colors hover:bg-nxd hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors',
          drag
            ? 'border-nxp bg-nxp/[0.05]'
            : 'border-nxborder bg-nxbg hover:border-nxp hover:bg-nxp/[0.03]',
        )}
        style={{ height: 128 }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-5 w-5 text-nxi3" />
        <div className="text-center">
          <p className="text-[13px] font-semibold text-nxi2">{label}</p>
          <p className="mt-0.5 text-[11.5px] text-nxi3">{hint}</p>
        </div>
      </div>
      {error && <p className="mt-1.5 text-[11.5px] font-medium text-nxd">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_ACCEPT_ATTR}
        className="hidden"
        onChange={(e) => {
          pickFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </>
  )
}
