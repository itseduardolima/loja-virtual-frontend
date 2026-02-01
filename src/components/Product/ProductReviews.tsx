'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Star,
  ImagePlus,
  X,
  Pencil,
  Check,
  MoreHorizontal,
  SlidersHorizontal,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProductReviews } from '@/hooks/useProductReviews'
import { useAuth } from '@/contexts/AuthContext'
import { ProductReview } from '@/types/review'
import { buildImageUrl } from '@/lib/utils'

function formatReviewDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

interface ProductReviewsProps {
  slug: string
  productId: string
  productName: string
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      {hasHalfStar && (
        <Star
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        />
      )}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-gray-300" />
      ))}
    </div>
  )
}

interface ReviewCardProps {
  review: ProductReview
  currentUserId?: number
  onEdit?: (
    reviewId: number,
    payload: { rating: number; comment: string; keep_images?: string[]; images?: File[] }
  ) => void
  isUpdating?: boolean
}

const MAX_IMAGES = 5

function ReviewCard({ review, currentUserId, onEdit, isUpdating }: ReviewCardProps) {
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
    setEditNewImages((prev) =>
      [...prev, ...validFiles].slice(0, MAX_IMAGES - totalCount)
    )
    e.target.value = ''
  }

  const removeKeepImage = (index: number) => {
    setEditKeepImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index: number) => {
    setEditNewImages((prev) => prev.filter((_, i) => i !== index))
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
    <Card className="rounded-xl border-0 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-2 mb-3">
          <StarRating rating={review.rating} />
          {isOwner && !isEditing && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded hover:bg-gray-100 text-gray-500"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 z-20 py-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[120px]">
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-gray-900">{review.user.name}</span>
        </div>

        {isEditing ? (
          <div className="space-y-3 mt-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">
                Sua nota
              </label>
              <div className="flex gap-0.5">
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
                      className={`h-6 w-6 ${
                        value <= displayRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">
                Comentário
              </label>
              <Textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="min-h-[80px] resize-none text-sm"
                maxLength={1000}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">
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
              <div className="flex flex-wrap gap-2">
                {editKeepImages.map((img, idx) => (
                  <div key={`keep-${idx}`} className="relative group">
                    <img
                      src={buildImageUrl(img)}
                      alt={`Manter ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeKeepImage(idx)}
                      className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
                {editNewImages.map((img, idx) => (
                  <div key={`new-${idx}`} className="relative group">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Nova ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
                {editKeepImages.length + editNewImages.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 text-gray-500"
                  >
                    <ImagePlus className="h-4 w-4 mb-0.5" />
                    <span className="text-xs">Adicionar</span>
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit} disabled={editRating < 1 || isUpdating}>
                {isUpdating ? (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Salvar
                  </>
                )}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit} disabled={isUpdating}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <>
            {review.comment && (
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {review.comment}
              </p>
            )}
            {review.images && review.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
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
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500">
              Publicado em {formatReviewDate(new Date(review.created_at))}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function ProductReviews({ slug, productId }: ProductReviewsProps) {
  const { isAuthenticated, user, loginWithGoogle } = useAuth()
  const [page, setPage] = useState(1)
  const [allReviews, setAllReviews] = useState<ProductReview[]>([])
  const [writeReviewOpen, setWriteReviewOpen] = useState(false)

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
    onCreateSuccess: () => setPage(1),
  })

  const prevProductKey = useRef(`${slug}-${productId}`)
  useEffect(() => {
    const productKey = `${slug}-${productId}`
    if (prevProductKey.current !== productKey) {
      prevProductKey.current = productKey
      setPage(1)
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
  const hasMore = meta && meta.currentPage < meta.lastPage

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(
      (f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024
    )
    setSelectedImages((prev) => [...prev, ...validFiles].slice(0, MAX_IMAGES))
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
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

    setRating(0)
    setComment('')
    setSelectedImages([])
    setWriteReviewOpen(false)
  }

  return (
    <div className="border-t border-gray-200 mt-8 bg-white">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Todas as Avaliações ({totalReviews})
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600"
              aria-label="Filtros"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <Select defaultValue="latest">
              <SelectTrigger className="w-[140px] h-10 bg-gray-100 border-0">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Mais recentes</SelectItem>
                <SelectItem value="helpful">Mais úteis</SelectItem>
                <SelectItem value="highest">Maior nota</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setWriteReviewOpen(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg"
            >
              Escrever avaliação
            </Button>
          </div>
        </div>

        {/* Write Review Dialog */}
        <Dialog open={writeReviewOpen} onOpenChange={setWriteReviewOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Escrever avaliação</DialogTitle>
            </DialogHeader>
            {isAuthenticated ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
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
                          className={`h-8 w-8 ${
                            value <= displayRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
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
                  <label className="text-sm font-medium text-gray-700 block mb-2">
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
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {selectedImages.length < MAX_IMAGES && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 text-gray-500"
                      >
                        <ImagePlus className="h-5 w-5 mb-0.5" />
                        <span className="text-xs">Adicionar</span>
                      </button>
                    )}
                  </div>
                </div>
                <Button type="submit" disabled={rating < 1 || isCreating} className="w-full">
                  {isCreating ? 'Enviando...' : 'Enviar avaliação'}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Faça login para avaliar este produto
                </p>
                <Button onClick={loginWithGoogle} variant="outline">
                  Entrar com Google
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Review Grid */}
        {isLoading && allReviews.length === 0 ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900" />
          </div>
        ) : allReviews.length === 0 ? (
          <p className="text-center text-gray-500 py-16">
            Nenhuma avaliação ainda. Seja o primeiro a avaliar!
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentUserId={user?.id}
                  onEdit={updateReview}
                  isUpdating={isUpdating}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  className="bg-gray-100 hover:bg-gray-200 border-0 text-gray-700 rounded-lg px-8"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Carregando...' : 'Carregar mais avaliações'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
