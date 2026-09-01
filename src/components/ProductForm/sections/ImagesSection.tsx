'use client'

// Seção "Imagens" — espelha ImagesSection/DropZone/ImageTile/ImageGrid de
// /tmp/nexo-design/nexo-criar-produto/project/sections.jsx, mas com upload real.
// Mecânica de object URLs (cache/cleanup), drag-reorder e buildImageUrl
// replicadas de src/components/Form/ImageUpload.tsx e ImageUploadByColor.tsx.
//
// - Modo por cor (colors.length > 0): trabalha SEMPRE via
//   orderedImagesByColor / onOrderedImagesChange (tipo OrderedImage).
// - Modo simples: selectedImages (File[]) + existingImages (urls) no modo edição.
import * as React from 'react'
import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { GripVertical, ImagePlus, Image as ImageIcon, Star, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buildImageUrl } from '@/lib/imageUtils'
import type { OrderedImage } from '../types'
import { getColorHex } from '../data'
import { SectionCard, SectionHeader, FieldHelp, NxBadge, Swatch } from '../primitives'

const MAX_PER = 5
const MIN_PER = 1

interface ImagesSectionProps {
  colors: string[]
  selectedImages: File[]
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
  onReorderImages: (files: File[]) => void
  orderedImagesByColor: Record<string, OrderedImage[]>
  onOrderedImagesChange: (color: string, order: OrderedImage[]) => void
  existingImages?: string[]
  removedExistingImages?: number[]
  onRemoveExistingImage?: (index: number) => void
  showErrors: boolean
}

// ── DropZone (visual do protótipo) ──────────────────────────────────────────
function DropZone({
  onPick,
  onFiles,
  compact,
}: {
  onPick: () => void
  onFiles: (files: File[]) => void
  compact?: boolean
}) {
  const [over, setOver] = useState(false)
  return (
    <button
      type="button"
      onClick={onPick}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes('Files')) return
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        if (!e.dataTransfer.types.includes('Files')) return
        e.preventDefault()
        setOver(false)
        onFiles(Array.from(e.dataTransfer.files))
      }}
      className={cn(
        'flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed transition-colors',
        compact ? 'h-full min-h-[120px]' : 'h-36',
        over
          ? 'border-nxp bg-nxp/[0.05]'
          : 'border-nxborder bg-nxbg/50 hover:border-nxp/50 hover:bg-nxp/[0.03]',
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
          over ? 'bg-nxp text-white' : 'bg-white text-nxp shadow-[0_1px_2px_hsl(0_0%_0%/0.06)]',
        )}
      >
        <ImagePlus size={18} />
      </span>
      <span className="text-[12.5px] font-semibold text-nxi2">
        Arraste imagens ou <span className="text-nxp">clique para enviar</span>
      </span>
      <span className="text-[11px] text-nxi3">
        PNG, JPG ou WEBP · {MIN_PER} a {MAX_PER} imagens
      </span>
    </button>
  )
}

// ── Tile com <Image> real, badge "Principal", grip + remover, drag-reorder ──
function ImageTile({
  src,
  alt,
  index,
  draggable,
  isDragging,
  isDropTarget,
  removable,
  isNew,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  src: string
  alt: string
  index: number
  draggable?: boolean
  isDragging?: boolean
  isDropTarget?: boolean
  removable?: boolean
  isNew?: boolean
  onRemove?: () => void
  onDragStart?: (e: React.DragEvent) => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent) => void
  onDragEnd?: () => void
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={cn(
        'group relative aspect-square min-h-[120px] overflow-hidden rounded-xl border border-nxborder bg-nxbg transition-all',
        draggable && 'cursor-grab active:cursor-grabbing',
        isDragging && 'scale-95 opacity-40',
        isDropTarget && 'ring-2 ring-nxp ring-offset-1',
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="select-none object-cover"
        draggable={false}
        unoptimized
      />
      {index === 0 && (
        <span className="absolute left-1.5 top-1.5">
          <NxBadge tone="nxp" icon={Star}>
            Principal
          </NxBadge>
        </span>
      )}
      {isNew && (
        <span className="absolute bottom-1.5 left-1.5 rounded bg-nxs px-1 py-0.5 text-[10px] font-semibold text-white">
          Nova
        </span>
      )}
      <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {draggable && (
          <span className="flex h-6 w-6 cursor-grab items-center justify-center rounded-md bg-white/90 text-nxi2 shadow-sm">
            <GripVertical size={13} />
          </span>
        )}
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-nxd shadow-sm transition-colors hover:bg-nxd hover:text-white"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  )
}

export function ImagesSection({
  colors,
  selectedImages,
  onImageChange,
  onRemoveImage,
  onReorderImages,
  orderedImagesByColor,
  onOrderedImagesChange,
  existingImages = [],
  removedExistingImages = [],
  onRemoveExistingImage,
  showErrors,
}: ImagesSectionProps) {
  const byColor = colors.length > 0

  // Cache de object URLs para File novos (evita recriar e permite cleanup).
  const urlCache = useRef<Map<File, string>>(new Map())
  useEffect(() => {
    const cache = urlCache.current
    return () => {
      cache.forEach((url) => URL.revokeObjectURL(url))
      cache.clear()
    }
  }, [])
  const fileSrc = useCallback((file: File) => {
    if (!urlCache.current.has(file)) {
      urlCache.current.set(file, URL.createObjectURL(file))
    }
    return urlCache.current.get(file)!
  }, [])

  // ── Modo por cor ───────────────────────────────────────────────────────────
  if (byColor) {
    return (
      <ColorImages
        colors={colors}
        orderedImagesByColor={orderedImagesByColor}
        onOrderedImagesChange={onOrderedImagesChange}
        fileSrc={fileSrc}
        showErrors={showErrors}
      />
    )
  }

  // ── Modo simples ─────────────────────────────────────────────────────────
  return (
    <SimpleImages
      selectedImages={selectedImages}
      onImageChange={onImageChange}
      onRemoveImage={onRemoveImage}
      onReorderImages={onReorderImages}
      existingImages={existingImages}
      removedExistingImages={removedExistingImages}
      onRemoveExistingImage={onRemoveExistingImage}
      fileSrc={fileSrc}
    />
  )
}

// ── Sub-componente: imagens por cor ──────────────────────────────────────────
function ColorImages({
  colors,
  orderedImagesByColor,
  onOrderedImagesChange,
  fileSrc,
  showErrors,
}: {
  colors: string[]
  orderedImagesByColor: Record<string, OrderedImage[]>
  onOrderedImagesChange: (color: string, order: OrderedImage[]) => void
  fileSrc: (file: File) => string
  showErrors: boolean
}) {
  const [picked, setPicked] = useState<string>(colors[0] ?? '')
  const active = colors.includes(picked) ? picked : colors[0]
  const activeList = (active && orderedImagesByColor[active]) || []

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragIdx = useRef<number | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const [dropTarget, setDropTarget] = useState<number | null>(null)

  const addFiles = (files: File[]) => {
    if (!active || files.length === 0) return
    const current = orderedImagesByColor[active] || []
    const remaining = MAX_PER - current.length
    if (remaining <= 0) return
    const toAdd = files.slice(0, remaining).map((file) => ({ type: 'new' as const, file }))
    onOrderedImagesChange(active, [...current, ...toAdd])
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const remove = (idx: number) => {
    onOrderedImagesChange(
      active,
      activeList.filter((_, i) => i !== idx),
    )
  }

  const reorder = (to: number) => {
    const from = dragIdx.current
    if (from == null || from === to) return
    const next = [...activeList]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onOrderedImagesChange(active, next)
  }

  const resetDrag = () => {
    dragIdx.current = null
    setDragging(null)
    setDropTarget(null)
  }

  const srcOf = (item: OrderedImage) =>
    item.type === 'existing' ? buildImageUrl(item.url) : fileSrc(item.file)

  return (
    <SectionCard id="sec-imagens">
      <SectionHeader
        icon={ImageIcon}
        title="Imagens por cor"
        description="Cada cor tem suas próprias fotos (mín. 2). A 1ª é a capa daquela cor."
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
        onChange={handleInput}
        className="hidden"
      />

      {/* tabs por cor */}
      <div className="mb-4 flex flex-wrap gap-1.5 border-b border-nxborder pb-3">
        {colors.map((c) => {
          const count = (orderedImagesByColor[c] || []).length
          const on = active === c
          return (
            <button
              key={c}
              type="button"
              onClick={() => setPicked(c)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition-colors',
                on
                  ? 'border-nxp bg-nxp/[0.07] text-nxp'
                  : 'border-nxborder bg-white text-nxi2 hover:border-nxp/40',
              )}
            >
              <Swatch hex={getColorHex(c)} size={16} /> {c}
              <span
                className={cn(
                  'flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10.5px] font-bold',
                  count >= MIN_PER
                    ? 'bg-nxs/15 text-nxs'
                    : count > 0
                      ? 'bg-nxw/20 text-[#9a6a16]'
                      : 'bg-nxi3/15 text-nxi3',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {active && (
        <div key={active}>
          {activeList.length === 0 ? (
            <DropZone onPick={() => fileInputRef.current?.click()} onFiles={addFiles} />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {activeList.map((item, i) => (
                <ImageTile
                  key={i}
                  src={srcOf(item)}
                  alt={`${active} ${i + 1}`}
                  index={i}
                  draggable
                  isDragging={dragging === i}
                  isDropTarget={dropTarget === i && dragging !== i}
                  removable
                  isNew={item.type === 'new'}
                  onRemove={() => remove(i)}
                  onDragStart={() => {
                    dragIdx.current = i
                    setDragging(i)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    if (dropTarget !== i) setDropTarget(i)
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    reorder(i)
                    resetDrag()
                  }}
                  onDragEnd={resetDrag}
                />
              ))}
              {activeList.length < MAX_PER && (
                <div className="aspect-square min-h-[120px]">
                  <DropZone
                    onPick={() => fileInputRef.current?.click()}
                    onFiles={addFiles}
                    compact
                  />
                </div>
              )}
            </div>
          )}
          {activeList.length < MIN_PER && (
            <div className="mt-3">
              <FieldHelp variant="error">
                {active} precisa de no mínimo {MIN_PER} imagem{MIN_PER > 1 ? 's' : ''}.
              </FieldHelp>
            </div>
          )}
        </div>
      )}
      {showErrors && (
        <p className="mt-3 text-[11.5px] text-nxi3">
          Cada cor precisa de no mínimo {MIN_PER} imagem{MIN_PER > 1 ? 's' : ''} para publicar.
        </p>
      )}
    </SectionCard>
  )
}

// ── Sub-componente: imagens simples ──────────────────────────────────────────
function SimpleImages({
  selectedImages,
  onImageChange,
  onRemoveImage,
  onReorderImages,
  existingImages,
  removedExistingImages,
  onRemoveExistingImage,
  fileSrc,
}: {
  selectedImages: File[]
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
  onReorderImages: (files: File[]) => void
  existingImages: string[]
  removedExistingImages: number[]
  onRemoveExistingImage?: (index: number) => void
  fileSrc: (file: File) => string
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragIdx = useRef<number | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const [dropTarget, setDropTarget] = useState<number | null>(null)

  const activeExisting = existingImages
    .map((url, index) => ({ url, index }))
    .filter(({ index }) => !removedExistingImages.includes(index))

  const totalCount = activeExisting.length + selectedImages.length

  const pick = () => fileInputRef.current?.click()

  const dropFiles = (files: File[]) => {
    if (files.length === 0) return
    const event = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>
    onImageChange(event)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImageChange(e)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const reorder = (to: number) => {
    const from = dragIdx.current
    if (from == null || from === to) return
    const next = [...selectedImages]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onReorderImages(next)
  }

  const resetDrag = () => {
    dragIdx.current = null
    setDragging(null)
    setDropTarget(null)
  }

  // índice "global" da capa: a 1ª imagem existente remanescente, senão a 1ª nova
  const coverIsExisting = activeExisting.length > 0

  return (
    <SectionCard id="sec-imagens">
      <SectionHeader
        icon={ImageIcon}
        title="Imagens"
        description="A primeira imagem é a capa do produto. Arraste para reordenar."
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
        onChange={handleInput}
        className="hidden"
      />

      {totalCount === 0 ? (
        <DropZone onPick={pick} onFiles={dropFiles} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {/* imagens existentes (modo edição) — não reordenáveis */}
          {activeExisting.map(({ url, index }, i) => (
            <ImageTile
              key={`existing-${index}`}
              src={buildImageUrl(url)}
              alt={`Imagem ${i + 1}`}
              index={i}
              removable={!!onRemoveExistingImage}
              onRemove={() => onRemoveExistingImage?.(index)}
            />
          ))}
          {/* imagens novas — reordenáveis */}
          {selectedImages.map((file, i) => {
            const globalIndex = activeExisting.length + i
            return (
              <ImageTile
                key={`new-${i}`}
                src={fileSrc(file)}
                alt={`Nova ${i + 1}`}
                index={coverIsExisting ? globalIndex : i}
                draggable
                isDragging={dragging === i}
                isDropTarget={dropTarget === i && dragging !== i}
                removable
                isNew={activeExisting.length > 0}
                onRemove={() => onRemoveImage(i)}
                onDragStart={() => {
                  dragIdx.current = i
                  setDragging(i)
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (dropTarget !== i) setDropTarget(i)
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  reorder(i)
                  resetDrag()
                }}
                onDragEnd={resetDrag}
              />
            )
          })}
          {totalCount < MAX_PER && (
            <div className="aspect-square min-h-[120px]">
              <DropZone onPick={pick} onFiles={dropFiles} compact />
            </div>
          )}
        </div>
      )}

      <p className="mt-3 text-[11.5px] text-nxi3">
        {totalCount}/{MAX_PER} imagens · mínimo {MIN_PER} para publicar.
      </p>
    </SectionCard>
  )
}
