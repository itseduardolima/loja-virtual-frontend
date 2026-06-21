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
