'use client'

import { cn } from '@/lib/utils'
import { getColorHex } from '@/schemas'
import { getNicheIcon } from '@/components/ProductForm'
import { formatBRL } from '@/lib/storefront'
import { Stars } from '../Product'
import { FilterGroup } from './FilterGroup'
import { CheckRow } from './CheckRow'
import type { PlpFilterPanelProps } from './types'

const RATING_OPTIONS = [4, 4.5]

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2'

/** Corpo completo dos filtros — compartilhado entre rail (desktop) e drawer (mobile) */
export function PlpFilterPanel({
  filters,
  niches,
  categories,
  colorFacet,
  sizeFacet,
  colorLabel,
  sizeLabel,
  dynFacets,
  priceMax,
  onToggleNiche,
  onToggleCategory,
  onToggleColor,
  onToggleSize,
  onToggleDyn,
  onSetMaxPrice,
  onSetMinRating,
  onTogglePromo,
  onToggleFeatured,
}: PlpFilterPanelProps) {
  const priceValue = Math.min(filters.maxPrice, priceMax)
  const pricePct = priceMax > 0 ? Math.round((priceValue / priceMax) * 100) : 0

  return (
    <div>
      {/* Tipo (nicho) — só com 2+ nichos; com 1, filtrar é inócuo */}
      {niches.length > 1 && (
        <FilterGroup title="Tipo" count={filters.nicheId ? 1 : 0}>
          <div className="flex flex-wrap gap-1.5">
            {niches.map((n) => {
              const on = filters.nicheId === n.id
              const Icon = getNicheIcon(n.slug)
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => onToggleNiche(n.id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition-colors',
                    focusRing,
                    on
                      ? 'border-store bg-store/[0.08] text-store-ink'
                      : 'border-nxborder text-nxi2 hover:border-nxi3',
                  )}
                >
                  <Icon size={13} />
                  {n.name}
                </button>
              )
            })}
          </div>
        </FilterGroup>
      )}

      {/* Categoria */}
      <FilterGroup title="Categoria" count={filters.categoryIds.length}>
        <div className="flex flex-col">
          {categories.map((c) => (
            <CheckRow
              key={c.id}
              label={c.name}
              checked={filters.categoryIds.includes(c.id)}
              onToggle={() => onToggleCategory(c.id)}
              right={c.count}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Preço */}
      <FilterGroup title="Preço">
        <div className="px-0.5">
          <input
            type="range"
            min={0}
            max={priceMax}
            step={10}
            value={priceValue}
            onChange={(e) => onSetMaxPrice(+e.target.value)}
            aria-label="Preço máximo"
            className={cn(
              'h-1.5 w-full cursor-pointer appearance-none rounded-full bg-nxborder accent-[hsl(var(--store-accent))]',
              focusRing,
            )}
            style={{
              background: `linear-gradient(to right, hsl(var(--store-accent)) ${pricePct}%, hsl(var(--nxborder)) ${pricePct}%)`,
            }}
          />
          <div className="mt-3 flex items-center gap-2.5">
            <div className="flex flex-1 flex-col gap-1">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-nxi3">
                Mín
              </span>
              <div className="flex h-9 items-center gap-1 rounded-[9px] border border-nxborder bg-nxbg/50 px-2.5">
                <span className="text-[12.5px] text-nxi3">R$</span>
                <span className="text-[13px] font-bold text-nxi2">0</span>
              </div>
            </div>
            <span className="mt-4 text-nxi3">—</span>
            <div className="flex flex-1 flex-col gap-1">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-nxi3">
                Máx
              </span>
              <div
                className={cn(
                  'flex h-9 items-center gap-1 rounded-[9px] border border-nxborder bg-white px-2.5 focus-within:border-store',
                )}
              >
                <span className="text-[12.5px] text-nxi3">R$</span>
                <input
                  type="number"
                  min={0}
                  max={priceMax}
                  value={Math.round(priceValue)}
                  onChange={(e) => onSetMaxPrice(Math.max(0, Math.min(priceMax, +e.target.value || 0)))}
                  aria-label="Preço máximo em reais"
                  className="w-full border-0 bg-transparent text-[13px] font-bold text-nxi1 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </FilterGroup>

      {/* Cor (dimensão de variante) */}
      {colorFacet.length > 0 && (
        <FilterGroup title={colorLabel ?? 'Cor'} count={filters.colors.length}>
          <div className="flex flex-col">
            {colorFacet.map((c) => (
              <CheckRow
                key={c}
                label={c}
                checked={filters.colors.includes(c)}
                onToggle={() => onToggleColor(c)}
                swatch={getColorHex(c)}
              />
            ))}
          </div>
        </FilterGroup>
      )}

      {/* Tamanho (dimensão de variante) */}
      {sizeFacet.length > 0 && (
        <FilterGroup title={sizeLabel ?? 'Tamanho'} count={filters.sizes.length}>
          <div className="flex flex-wrap gap-2">
            {sizeFacet.map((s) => {
              const on = filters.sizes.includes(s)
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onToggleSize(s)}
                  className={cn(
                    'flex h-9 min-w-[2.25rem] items-center justify-center rounded-full border px-3 text-[13px] font-bold transition-colors',
                    focusRing,
                    on
                      ? 'border-store bg-store/[0.08] text-store-ink'
                      : 'border-nxborder text-nxi2 hover:border-nxi3',
                  )}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </FilterGroup>
      )}

      {/* Facetas dinâmicas do nicho — radio (single) / select (multi) */}
      {dynFacets.map((facet) => {
        if (facet.options.length === 0) return null
        const selected = filters.dyn[facet.name] ?? []
        return (
          <FilterGroup key={facet.name} title={facet.name} count={selected.length}>
            {facet.type === 'radio' ? (
              <div className="flex flex-wrap gap-1.5">
                {facet.options.map((opt) => {
                  const on = selected.includes(opt)
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onToggleDyn(facet, opt)}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition-colors',
                        focusRing,
                        on
                          ? 'border-store bg-store/[0.08] text-store-ink'
                          : 'border-nxborder text-nxi2 hover:border-nxi3',
                      )}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col">
                {facet.options.map((opt) => (
                  <CheckRow
                    key={opt}
                    label={opt}
                    checked={selected.includes(opt)}
                    onToggle={() => onToggleDyn(facet, opt)}
                  />
                ))}
              </div>
            )}
          </FilterGroup>
        )
      })}

      {/* Avaliação */}
      <FilterGroup title="Avaliação">
        <div className="flex flex-col gap-1">
          {RATING_OPTIONS.map((r) => {
            const active = filters.minRating === r
            return (
              <button
                key={r}
                type="button"
                onClick={() => onSetMinRating(active ? 0 : r)}
                aria-pressed={active}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-1.5 py-2 text-left transition-colors',
                  focusRing,
                )}
              >
                <span
                  className={cn(
                    'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[5px] transition-colors',
                    active ? 'border-store bg-white' : 'border-nxborder bg-white',
                  )}
                />
                <span className="flex items-center gap-1.5 text-[14px] font-bold text-nxi1">
                  <Stars rating={r} size={14} /> {r}★ ou mais
                </span>
              </button>
            )
          })}
        </div>
      </FilterGroup>

      {/* Ofertas */}
      <FilterGroup title="Ofertas">
        <CheckRow label="Em promoção" checked={filters.promo} onToggle={onTogglePromo} />
        <CheckRow label="Em destaque" checked={filters.featured} onToggle={onToggleFeatured} />
      </FilterGroup>
    </div>
  )
}
