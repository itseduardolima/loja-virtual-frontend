'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Star,
  ImagePlus,
  X,
  Pencil,
  Check,
  MoreHorizontal,
  PenLine,
  MessageSquarePlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useProductReviews } from '@/hooks/useProductReviews'
import { useAuth } from '@/contexts/AuthContext'
import { ProductReview } from '@/types/review'
import { buildImageUrl, cn } from '@/lib/utils'
import { Stars } from '@/components/Store/Product'

function formatReviewDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

interface ProductReviewsProps {
  slug: string
  productId: string
  productName: string
}

interface ReviewItemProps {
  review: ProductReview
  currentUserId?: number
  onEdit?: (
    reviewId: number,
    payload: { rating: number; comment: string; keep_images?: string[]; images?: File[] }
  ) => void
  isUpdating?: boolean
}

const MAX_IMAGES = 5

const SORT_OPTIONS: Array<['latest' | 'highest' | 'images', string]> = [
  ['latest', 'Recentes'],
  ['highest', 'Maior nota'],
  ['images', 'Com fotos'],
]

function ReviewItem({ review, currentUserId, onEdit, isUpdating }: ReviewItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editRating, setEditRating] = useState(review.rating)
  const [editComment, setEditComment] = useState(review.comment || '')
  const [editHoverRating, setEditHoverRating] = useState(0)
  const [editKeepImages, setEditKeepImages] = useState<string[]>(review.images || [])
  const [editNewImages, setEditNewImages] = useState<File[]>([])
  const editFileInputRef = useRef<HTMLInputElement>(null)

  const isOwner = currentUserId !== undefined && review.user.id === currentUserId
  const displayRating = editHoverRating || editRating

  const handleStartEdit = () => {
    setEditRating(review.rating)
    setEditComment(review.comment || '')
    setEditKeepImages(review.images || [])
    setEditNewImages([])
    setIsEditing(true)
    setMenuOpen(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditRating(review.rating)
    setEditComment(review.comment || '')
    setEditKeepImages(review.images || [])
    setEditNewImages([])
  }

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(
      (f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024
    )
    const totalCount = editKeepImages.length + editNewImages.length
    setEditNewImages((prev) => [...prev, ...validFiles].slice(0, MAX_IMAGES - totalCount))
    e.target.value = ''
  }

  const handleSaveEdit = () => {
    onEdit?.(review.id, {
      rating: editRating,
      comment: editComment.trim(),
      keep_images: editKeepImages,
      images: editNewImages.length > 0 ? editNewImages : undefined,
    })
    setIsEditing(false)
  }

  return (
    <div className="py-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-store/[0.08] text-[12px] font-bold text-store-ink">
            {initialsOf(review.user.name)}
          </div>
          <div>
            <span className="text-[13.5px] font-bold text-nxi1">{review.user.name}</span>
            <div className="mt-1">
              <Stars rating={review.rating} size={12} />
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-[11.5px] text-nxi3">
            {formatReviewDate(new Date(review.created_at))}
          </span>
          {isOwner && !isEditing && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded p-1 text-nxi3 hover:bg-nxbg"
                aria-label="Opções da avaliação"
              >
                <MoreHorizontal size={16} />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1 min-w-[120px] rounded-xl border border-nxborder bg-white py-1 shadow-lg">
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-[12.5px] font-medium text-nxi2 hover:bg-nxbg"
                    >
                      <Pencil size={13} />
                      Editar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="mt-4 space-y-3">
          <div>
            <label className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-nxi3">
              Sua nota
            </label>
            <div className="mt-1.5 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setEditRating(value)}
                  onMouseEnter={() => setEditHoverRating(value)}
                  onMouseLeave={() => setEditHoverRating(0)}
                  className="p-0.5"
                >
                  <Star
                    size={24}
                    className={
                      value <= displayRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-nxborder text-nxborder'
                    }
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-nxi3">
              Comentário
            </label>
            <Textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              className="mt-1.5 min-h-[80px] resize-none text-sm"
              maxLength={1000}
            />
          </div>
          <div>
            <label className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-nxi3">
              Imagens
            </label>
            <input
              ref={editFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              multiple
              onChange={handleEditImageChange}
              className="hidden"
            />
            <div className="mt-1.5 flex flex-wrap gap-2">
              {editKeepImages.map((img, idx) => (
                <div key={`keep-${idx}`} className="relative">
                  <img
                    src={buildImageUrl(img)}
                    alt={`Manter ${idx + 1}`}
                    className="h-16 w-16 rounded-lg border border-nxborder object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setEditKeepImages((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute -right-0.5 -top-0.5 rounded-full bg-nxd p-0.5 text-white"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {editNewImages.map((img, idx) => (
                <div key={`new-${idx}`} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Nova ${idx + 1}`}
                    className="h-16 w-16 rounded-lg border border-nxborder object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setEditNewImages((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute -right-0.5 -top-0.5 rounded-full bg-nxd p-0.5 text-white"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {editKeepImages.length + editNewImages.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => editFileInputRef.current?.click()}
                  className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border-2 border-dashed border-nxborder text-nxi3 hover:border-nxi3"
                >
                  <ImagePlus size={15} className="mb-0.5" />
                  <span className="text-[10px]">Adicionar</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={editRating < 1 || isUpdating}
              className="flex h-9 items-center gap-1.5 rounded-full bg-store px-4 text-[12.5px] font-semibold text-white disabled:opacity-50"
            >
              {isUpdating ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Check size={13} />
                  Salvar
                </>
              )}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isUpdating}
              className="h-9 rounded-full border border-nxborder px-4 text-[12.5px] font-semibold text-nxi2 hover:border-nxi3"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          {review.comment && (
            <p className="mt-3 max-w-[68ch] text-[13.5px] leading-relaxed text-nxi2">
              {review.comment}
            </p>
          )}
          {review.images && review.images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {review.images.map((img, idx) => (
                <a
                  key={idx}
                  href={buildImageUrl(img)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={buildImageUrl(img)}
                    alt={`Avaliação ${idx + 1}`}
                    className="h-16 w-16 rounded-lg border border-nxborder object-cover transition-opacity hover:opacity-90"
                  />
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function ProductReviews({ slug, productId }: ProductReviewsProps) {
  const { isAuthenticated, user, loginWithGoogle } = useAuth()
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<'latest' | 'highest' | 'images'>('latest')
  const [allReviews, setAllReviews] = useState<ProductReview[]>([])
  const [writeReviewOpen, setWriteReviewOpen] = useState(false)
  const [justSubmitted, setJustSubmitted] = useState(false)

  const {
    reviews,
    summary,
    meta,
    isLoading,
    createReview,
    updateReview,
    isCreating,
    isUpdating,
  } = useProductReviews(slug, productId, {
    page,
    sort,
    onCreateSuccess: () => {
      setPage(1)
      setJustSubmitted(true)
      setRating(0)
      setComment('')
      setSelectedImages([])
      setTimeout(() => {
        setWriteReviewOpen(false)
        setJustSubmitted(false)
      }, 1800)
    },
  })

  const prevProductKey = useRef(`${slug}-${productId}`)
  useEffect(() => {
    const productKey = `${slug}-${productId}`
    if (prevProductKey.current !== productKey) {
      prevProductKey.current = productKey
      setPage(1)
      setSort('latest')
      setAllReviews([])
    }
  }, [slug, productId])

  useEffect(() => {
    if (reviews.length > 0) {
      if (page === 1) {
        setAllReviews(reviews)
      } else {
        setAllReviews((prev) => {
          const ids = new Set(prev.map((r) => r.id))
          const newReviews = reviews.filter((r) => !ids.has(r.id))
          return [...prev, ...newReviews]
        })
      }
    } else if (page === 1) {
      setAllReviews([])
    }
  }, [reviews, page])

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayRating = hoverRating || rating
  const totalReviews = summary?.total_reviews ?? 0
  const averageRating = summary?.average_rating ?? 0
  const hasMore = meta && meta.currentPage < meta.lastPage

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(
      (f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024
    )
    setSelectedImages((prev) => [...prev, ...validFiles].slice(0, MAX_IMAGES))
    e.target.value = ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1 || rating > 5) return

    createReview({
      product_id: parseInt(productId),
      rating,
      comment: comment.trim() || undefined,
      images: selectedImages.length > 0 ? selectedImages : undefined,
    })
  }

  const changeSort = (value: 'latest' | 'highest' | 'images') => {
    setSort(value)
    setPage(1)
    setAllReviews([])
  }

  return (
    <div className="py-12 md:py-14">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-nxi3">
            Avaliações
          </span>
          <h2 className="mt-2 font-integral text-[20px] font-bold uppercase tracking-[-0.01em] text-nxi1 sm:text-[23px]">
            Quem comprou, aprovou
          </h2>
        </div>
        <button
          onClick={() => setWriteReviewOpen(true)}
          className="flex items-center gap-2 rounded-full border border-store px-4 py-2.5 text-[12.5px] font-semibold text-store-ink transition-colors hover:bg-store hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2"
        >
          <PenLine size={15} /> Escrever avaliação
        </button>
      </div>

      {/* dialog */}
      <Dialog
        open={writeReviewOpen}
        onOpenChange={(open) => {
          setWriteReviewOpen(open)
          if (!open) setJustSubmitted(false)
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Escrever avaliação</DialogTitle>
          </DialogHeader>
          {justSubmitted ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-nxs/10">
                <Check size={26} className="text-nxs" strokeWidth={2.6} />
              </div>
              <div className="font-integral text-[17px] font-bold uppercase tracking-[-0.01em] text-nxi1">
                Avaliação publicada
              </div>
              <p className="max-w-[320px] text-[13px] leading-relaxed text-nxi2">
                Já está visível para outros clientes na página do produto. Obrigado por avaliar!
              </p>
            </div>
          ) : isAuthenticated ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-nxi3">
                  Sua nota
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1"
                    >
                      <Star
                        size={28}
                        className={cn(
                          'transition-transform hover:scale-110',
                          value <= displayRating
                            ? 'fill-nxw text-nxw'
                            : 'fill-nxborder text-nxborder',
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-nxi3">
                  Comentário (opcional)
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Conte sua experiência com este produto..."
                  className="min-h-[100px] resize-none"
                  maxLength={1000}
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-nxi3">
                  Imagens (opcional)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-2">
                  {selectedImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${idx + 1}`}
                        className="h-20 w-20 rounded-lg border border-nxborder object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImages((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="absolute -right-1 -top-1 rounded-full bg-nxd p-1 text-white"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {selectedImages.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border-2 border-dashed border-nxborder text-nxi3 hover:border-nxi3"
                    >
                      <ImagePlus size={18} className="mb-0.5" />
                      <span className="text-xs">Adicionar</span>
                    </button>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={rating < 1 || isCreating}
                className={cn(
                  'h-11 w-full rounded-full text-[14px] font-semibold transition-colors',
                  rating >= 1 && !isCreating
                    ? 'bg-store text-white hover:brightness-[1.05]'
                    : 'cursor-not-allowed bg-nxbg text-nxi3',
                )}
              >
                {isCreating ? 'Enviando...' : 'Enviar avaliação'}
              </button>
            </form>
          ) : (
            <div className="py-8 text-center">
              <p className="mb-4 text-nxi2">Faça login para avaliar este produto</p>
              <Button onClick={loginWithGoogle} variant="outline">
                Entrar com Google
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* content */}
      {isLoading && allReviews.length === 0 ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-nxborder border-t-store" />
        </div>
      ) : allReviews.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-nxborder bg-nxbg py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-store-ink shadow-sm">
            <MessageSquarePlus size={28} />
          </div>
          <h3 className="mt-4 text-[16px] font-bold tracking-tight text-nxi1">
            Seja o primeiro a avaliar
          </h3>
          <p className="mt-1.5 max-w-[34ch] text-[13px] leading-relaxed text-nxi2">
            Já comprou este produto? Conte como foi sua experiência. Sua opinião ajuda outros
            clientes.
          </p>
          <button
            onClick={() => setWriteReviewOpen(true)}
            className="mt-5 rounded-full bg-store px-5 py-2.5 text-[12.5px] font-semibold text-white hover:brightness-[1.05]"
          >
            Escrever a primeira avaliação
          </button>
        </div>
      ) : (
        <div className="mt-7 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-12">
          {/* summary — só o que o backend traz: média e total */}
          <div className="flex flex-col items-center gap-1 sm:items-start lg:sticky lg:top-32">
            <div className="flex items-baseline gap-2">
              <span className="text-[56px] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-nxi1">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-[14px] font-semibold text-nxi3">de 5</span>
            </div>
            <div className="mt-2">
              <Stars rating={averageRating} size={15} />
            </div>
            <div className="mt-1 text-[12px] text-nxi3">
              {totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'}
            </div>
          </div>

          <div>
          {/* sort + list */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-b border-nxborder pb-3 lg:mt-0">
            <span className="text-[12.5px] font-semibold text-nxi2">
              {allReviews.length} comentário{allReviews.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-1.5 text-[12px]">
              <span className="text-nxi3">Ordenar:</span>
              {SORT_OPTIONS.map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => changeSort(value)}
                  className={cn(
                    'rounded-full px-2.5 py-1 font-semibold transition-colors',
                    sort === value ? 'bg-store text-white' : 'text-nxi2 hover:text-store-ink',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-nxborder">
            {allReviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                currentUserId={user?.id}
                onEdit={updateReview}
                isUpdating={isUpdating}
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={isLoading}
                className="w-full rounded-xl border border-dashed border-nxborder py-3 text-[12.5px] font-semibold text-nxi3 transition-colors hover:border-nxi3 hover:text-store-ink disabled:opacity-50"
              >
                {isLoading ? 'Carregando...' : 'Ver mais avaliações'}
              </button>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  )
}
