'use client'

// Modal full-screen de pré-visualização da vitrine (visão do cliente).
// Espelha /tmp/nexo-design/nexo-criar-produto/project/storefront.jsx.
// Overlay próprio (não Dialog shadcn): backdrop-blur, fecha com Esc/clique fora/
// botões, trava o scroll do body. As imagens da galeria são srcs prontos para
// exibir (object URLs `blob:` ou URLs absolutas do backend) — por isso usamos
// <Image unoptimized> para não passar pelo otimizador do Next.
import * as React from 'react'
import Image from 'next/image'
import {
  ChevronRight,
  Clock,
  Eye,
  Heart,
  Image as ImageIcon,
  Lock,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sanitizeHtml } from '@/lib/sanitize'
import type { StorefrontPreviewData } from './types'
import { formatBRL, getColorHex, slugify } from './data'
import { NxBadge, Swatch } from './primitives'

// placeholder hachurado quando não há imagem (espelha .img-placeholder do protótipo)
const PLACEHOLDER_BG: React.CSSProperties = {
  backgroundColor: 'hsl(var(--nxbg))',
  backgroundImage:
    'repeating-linear-gradient(45deg, hsl(var(--nxborder) / 0.7) 0, hsl(var(--nxborder) / 0.7) 1px, transparent 1px, transparent 9px)',
}

function GalleryImage({ src, big, main }: { src?: string; big?: boolean; main?: boolean }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-xl border border-nxborder">
      {src ? (
        <Image
          src={src}
          alt="Imagem do produto"
          fill
          unoptimized
          sizes={big ? '(max-width: 768px) 100vw, 480px' : '96px'}
          className="object-cover"
          draggable={false}
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-1 text-nxi3"
          style={PLACEHOLDER_BG}
        >
          <ImageIcon size={big ? 30 : 16} />
        </div>
      )}
      {big && main && (
        <span className="absolute left-2.5 top-2.5">
          <NxBadge tone="nxp" icon={Star}>
            Capa
          </NxBadge>
        </span>
      )}
    </div>
  )
}

export function StorefrontPreviewModal({
  open,
  onClose,
  data,
  storeName,
  storeDomain,
}: {
  open: boolean
  onClose: () => void
  data: StorefrontPreviewData
  storeName?: string | null
  storeDomain?: string | null
}) {
  const colors = data.colors
  const sizes = data.sizes

  const [color, setColor] = React.useState<string | null>(colors[0] || null)
  const [size, setSize] = React.useState<string | null>(null)
  const [activeImg, setActiveImg] = React.useState(0)

  const activeColor = color && colors.includes(color) ? color : colors[0] || null

  // Esc para fechar + trava scroll do body enquanto aberto
  React.useEffect(() => {
    if (!open) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onEsc)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  // reinicia a thumbnail ativa ao trocar de cor
  React.useEffect(() => {
    setActiveImg(0)
  }, [activeColor])

  // lookup de estoque por combinação cor/tamanho (substitui o map '|||' do protótipo)
  const stockOf = React.useCallback(
    (c: string | null, s: string | null): number => {
      const found = data.variantStocks.find(
        (v) => (c == null || v.color === c) && (s == null || v.size === s),
      )
      return found?.stock ?? 0
    },
    [data.variantStocks],
  )

  // estoque da seleção atual (null = ainda precisa escolher tamanho)
  const variantStock = React.useMemo<number | null>(() => {
    if (!colors.length && !sizes.length) return data.singleStock ?? 0
    if (colors.length && sizes.length) return size ? stockOf(activeColor, size) : null
    if (colors.length) return stockOf(activeColor, null)
    return size ? stockOf(null, size) : null
  }, [colors.length, sizes.length, size, activeColor, data.singleStock, stockOf])

  if (!open) return null

  // galeria: imagens da cor ativa; senão lista simples
  const gallery: string[] = colors.length
    ? data.imagesByColor[activeColor || ''] || []
    : data.simpleImages || []
  const cover = gallery[activeImg]

  const price = data.price || 0
  const promo = data.promoPrice && data.promoPrice > 0 ? data.promoPrice : null
  const off = promo && price ? Math.round((1 - promo / price) * 100) : 0
  const installments = (promo || price) / 10

  const specsHtml = data.specificationsHtml || ''
  const specRows = data.dynSpecs.filter(([, v]) => v != null && String(v).trim() !== '')

  const domainBase = (storeDomain && storeDomain.trim()) || slugify(storeName) || 'minha-loja'
  const productSlug = data.slug || slugify(data.name) || 'produto'
  const brand = (storeName && storeName.trim()) || 'Minha Loja'

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-nxi1/55 backdrop-blur-sm nx-fade"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pré-visualização da vitrine"
    >
      {/* barra de chrome do browser */}
      <div
        className="mx-auto mt-3 w-full max-w-[1080px] px-3"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 rounded-t-2xl border border-b-0 border-nxborder bg-white px-3 py-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="ml-2 flex flex-1 items-center gap-2 rounded-lg bg-nxbg px-3 py-1.5 text-[12px] text-nxi3">
            <Lock size={12} className="text-nxs" />
            <span className="truncate">
              {domainBase}.nexo.com.br/{productSlug}
            </span>
            <NxBadge tone="nxa" className="ml-auto">
              Preview
            </NxBadge>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-nxi2 transition-colors hover:bg-nxbg"
            title="Fechar (Esc)"
            aria-label="Fechar pré-visualização"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* página rolável */}
      <div
        className="mx-auto w-full max-w-[1080px] flex-1 overflow-y-auto px-3 pb-6 scrollbar-thin"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-b-2xl border border-t-0 border-nxborder bg-white">
          {/* topo da vitrine */}
          <div className="flex items-center gap-3 border-b border-nxborder px-5 py-3">
            <span className="font-integral text-[16px] uppercase tracking-[0.04em] text-nxi1">
              {brand}
            </span>
            <nav className="ml-3 hidden items-center gap-4 text-[12.5px] font-semibold text-nxi2 sm:flex">
              <span>Novidades</span>
              <span>Feminino</span>
              <span>Masculino</span>
              <span>Sale</span>
            </nav>
            <div className="ml-auto flex items-center gap-3 text-nxi2">
              <Search size={17} />
              <Heart size={17} />
              <ShoppingBag size={17} />
            </div>
          </div>

          {/* breadcrumb */}
          <div className="flex items-center gap-1.5 px-5 pt-4 text-[11.5px] font-medium text-nxi3">
            <span>Início</span>
            <ChevronRight size={12} />
            {data.nicheName && (
              <>
                <span>{data.nicheName}</span>
                <ChevronRight size={12} />
              </>
            )}
            <span className="text-nxi2">{data.categoryName || 'Categoria'}</span>
          </div>

          {/* grid principal */}
          <div className="grid grid-cols-1 gap-7 px-5 pb-7 pt-4 md:grid-cols-2">
            {/* galeria */}
            <div>
              <GalleryImage src={cover} big main={activeImg === 0} />
              {gallery.length > 1 && (
                <div className="mt-2.5 grid grid-cols-5 gap-2">
                  {gallery.slice(0, 5).map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      className={cn(
                        'rounded-lg ring-2 transition-all',
                        i === activeImg ? 'ring-nxp' : 'ring-transparent hover:ring-nxborder',
                      )}
                    >
                      <GalleryImage src={src} />
                    </button>
                  ))}
                </div>
              )}
              {gallery.length === 0 && (
                <p className="mt-2 text-center text-[11.5px] text-nxi3">
                  {colors.length
                    ? `Sem imagens enviadas para "${activeColor}" ainda.`
                    : 'Sem imagens enviadas para este produto ainda.'}
                </p>
              )}
            </div>

            {/* buy box */}
            <div>
              {data.nicheName && (
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-nxp">
                  {data.nicheName}
                  {data.categoryName ? ` · ${data.categoryName}` : ''}
                </span>
              )}
              <h1 className="mt-1 text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] text-nxi1">
                {data.name || 'Nome do produto'}
              </h1>

              <div className="mt-1.5 flex items-center gap-2 text-[12.5px] text-nxi3">
                <span className="flex items-center gap-0.5 text-nxw">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={13} style={{ fill: i < 4 ? 'currentColor' : 'none' }} />
                  ))}
                </span>
                <span>4.8 · 126 avaliações</span>
              </div>

              {/* preço */}
              <div className="mt-4 rounded-2xl bg-nxbg/70 p-4">
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <span className="text-[30px] font-extrabold tracking-[-0.03em] text-nxi1">
                    {formatBRL(promo || price || 0)}
                  </span>
                  {promo && (
                    <span className="text-[15px] font-medium text-nxi3 line-through">
                      {formatBRL(price)}
                    </span>
                  )}
                  {off > 0 && <NxBadge tone="nxa">-{off}%</NxBadge>}
                </div>
                <div className="mt-1 text-[12.5px] text-nxi2">
                  ou 10x de <b>{formatBRL(installments)}</b> sem juros
                </div>
                {promo && data.promoEndsAt && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-nxa/10 px-2.5 py-1 text-[11.5px] font-bold text-nxa">
                    <Clock size={12} /> Oferta por tempo limitado
                  </div>
                )}
              </div>

              {/* seletor de cor */}
              {colors.length > 0 && (
                <div className="mt-5">
                  <div className="mb-2 text-[12.5px] font-bold text-nxi1">
                    Cor: <span className="font-semibold text-nxi2">{activeColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        title={c}
                        className={cn(
                          'flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-[12px] font-semibold transition-colors',
                          activeColor === c
                            ? 'border-nxp text-nxp'
                            : 'border-nxborder text-nxi2 hover:border-nxi3',
                        )}
                      >
                        <Swatch hex={getColorHex(c)} size={22} selected={activeColor === c} /> {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* seletor de tamanho */}
              {sizes.length > 0 && (
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[12.5px] font-bold text-nxi1">
                      Tamanho{size ? `: ${size}` : ''}
                    </span>
                    <span className="text-[11.5px] font-semibold text-nxp underline">
                      Guia de medidas
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => {
                      const st = colors.length ? stockOf(activeColor, s) : stockOf(null, s)
                      const out = st <= 0
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={out}
                          onClick={() => setSize(s)}
                          className={cn(
                            'flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg border px-3 text-[13px] font-bold transition-colors',
                            out
                              ? 'cursor-not-allowed border-nxborder bg-nxbg text-nxi3/50 line-through'
                              : size === s
                                ? 'border-nxp bg-nxp/[0.06] text-nxp'
                                : 'border-nxborder text-nxi1 hover:border-nxi3',
                          )}
                        >
                          {s}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* hint de estoque */}
              {variantStock != null && (
                <div className="mt-3 text-[12px] font-semibold">
                  {variantStock <= 0 ? (
                    <span className="text-nxd">Esgotado</span>
                  ) : variantStock <= 5 ? (
                    <span className="text-nxa">Últimas {variantStock} unidades!</span>
                  ) : (
                    <span className="text-nxs">Em estoque</span>
                  )}
                </div>
              )}

              {/* CTAs (decorativos) */}
              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  type="button"
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-nxp text-[15px] font-bold text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.3)] transition-colors hover:bg-nxp/90"
                >
                  <ShoppingBag size={18} /> Adicionar à sacola
                </button>
                <button
                  type="button"
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-nxborder text-[15px] font-bold text-nxi1 transition-colors hover:border-nxp/40 hover:text-nxp"
                >
                  Comprar agora
                </button>
              </div>

              {/* trust strip */}
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-nxborder pt-4 text-center">
                {(
                  [
                    [Truck, 'Frete grátis', 'acima de R$199'],
                    [ShieldCheck, 'Compra segura', 'dados protegidos'],
                    [RotateCcw, 'Troca fácil', 'até 30 dias'],
                  ] as const
                ).map(([Ic, t, s]) => (
                  <div key={t} className="flex flex-col items-center gap-1">
                    <Ic size={18} className="text-nxp" />
                    <span className="text-[11px] font-bold text-nxi1">{t}</span>
                    <span className="text-[10px] text-nxi3">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* descrição + specs */}
          {(data.description || specsHtml || specRows.length > 0) && (
            <div className="border-t border-nxborder px-5 py-7">
              <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-nxi1">Descrição</h2>
              {data.description && (
                <p className="mt-2 max-w-[70ch] text-[14px] leading-relaxed text-nxi2">
                  {data.description}
                </p>
              )}
              {specRows.length > 0 && (
                <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                  {specRows.map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between gap-3 border-b border-nxborder py-1.5 text-[13px]"
                    >
                      <span className="font-semibold text-nxi3">{k}</span>
                      <span className="text-right font-semibold text-nxi1">{v}</span>
                    </div>
                  ))}
                </div>
              )}
              {specsHtml && (
                <div
                  className="prose-nx mt-5 max-w-[70ch] text-[14px] leading-relaxed text-nxi2 [&_h3]:mb-1 [&_h3]:mt-3 [&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:text-nxi1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(specsHtml) }}
                />
              )}
            </div>
          )}

          {/* rodapé */}
          <div className="flex items-center justify-center gap-2 border-t border-nxborder bg-nxbg/50 px-5 py-4 text-[11.5px] text-nxi3">
            <Eye size={13} /> Esta é uma pré-visualização — nada foi publicado.{' '}
            <button type="button" onClick={onClose} className="font-semibold text-nxp underline">
              Voltar a editar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
