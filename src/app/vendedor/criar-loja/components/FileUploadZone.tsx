'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadZoneProps {
  label: string
  hint: string
  preview: string | null
  onFile: (file: File) => void
}

export function FileUploadZone({ label, hint, preview, onFile }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDrag(false)
      const file = e.dataTransfer.files[0]
      if (file?.type.startsWith('image/')) onFile(file)
    },
    [onFile],
  )

  if (preview) {
    return (
      <div className="relative rounded-xl overflow-hidden" style={{ height: 128 }}>
        <Image src={preview} alt="" fill className="object-cover" />
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-colors',
          drag
            ? 'border-[#1E3A5F] bg-blue-50/40'
            : 'border-gray-200 bg-gray-50/60 hover:border-[#1E3A5F] hover:bg-blue-50/30',
        )}
        style={{ height: 128 }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="w-5 h-5 text-gray-300" />
        <div className="text-center">
          <p className="text-[13px] font-semibold text-gray-600">{label}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
        }}
      />
    </>
  )
}
