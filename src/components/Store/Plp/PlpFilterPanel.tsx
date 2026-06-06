'use client'

import { cn } from '@/lib/utils'
import { getColorHex } from '@/schemas'
import { colorLuma } from '@/components/ProductForm'
import { formatBRL } from '@/lib/storefront'
import { Stars } from '../Product'
import { FilterGroup } from './FilterGroup'
import { CheckRow } from './CheckRow'
import type { PlpFilterPanelProps } from './types'

/** Corpo completo dos filtros — compartilhado entre rail (desktop) e drawer (mobile) */
export function PlpFilterPanel({
  filters,
  categories,
  colorFacet,
  sizeFacet,
  dynFacets,
  priceMax,
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

  return (
    <div>
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
            className="w-full accent-nxp"
          />
          <div className="mt-1.5 flex items-center justify-between text-[12px] text-nxi2">
            <span>R$ 0</span>
            <span className="font-bold text-nxi1">até {formatBRL(priceValue)}</span>
          </div>
        </div>
      </FilterGroup>

      {/* Cor (dimensão de variante) */}
      {colorFacet.length > 0 && (
        <FilterGroup title="Cor" count={filters.colors.length}>
          <div className="grid grid-cols-2 gap-1.5">
            {colorFacet.map((c) => {
              const on = filters.colors.includes(c)
              const hex = getColorHex(c)
              const light = colorLuma(hex) > 0.82
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onToggleColor(c)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-[12px] font-medium transition-colors',
                    on
                      ? 'border-nxp bg-nxp/[0.05] text-nxp'
                      : 'border-nxborder text-nxi2 hover:border-nxi3',
                  )}
                >
                  {/* swatch dinâmico — cor e ring por luminância */}
                  <span
                    className="h-4 w-4 shrink-0 rounded-full"
                    style={{
                      background: hex,
                      boxShadow: light ? 'inset 0 0 0 1px hsl(var(--nxborder))' : 'none',
                    }}
                  />
                  <span className="truncate">{c}</span>
                </button>
              )
            })}
          </div>
        </FilterGroup>
      )}

      {/* Tamanho (dimensão de variante) */}
      {sizeFacet.length > 0 && (
        <FilterGroup title="Tamanho" count={filters.sizes.length}>
          <div className="flex flex-wrap gap-1.5">
            {sizeFacet.map((s) => {
              const on = filters.sizes.includes(s)
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onToggleSize(s)}
                  className={cn(
                    'flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg border px-2 text-[12.5px] font-bold transition-colors',
                    on
                      ? 'border-nxp bg-nxp text-white'
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
                        on
                          ? 'border-nxp bg-nxp/[0.08] text-nxp'
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
        <div className="flex flex-col gap-0.5">
          {[4, 3, 0].map((r) => {
            const active = filters.minRating === r
            return (
              <button
                key={r}
                type="button"
                onClick={() => onSetMinRating(r)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors',
                  active ? 'bg-nxp/[0.06]' : 'hover:bg-nxbg',
                )}
              >
                <span
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded-full border-2',
                    active ? 'border-nxp' : 'border-nxi3/50',
                  )}
                >
                  {active && <span className="h-2 w-2 rounded-full bg-nxp" />}
                </span>
                {r === 0 ? (
                  <span className="text-[13px] text-nxi2">Todas</span>
                ) : (
                  <span className="flex items-center gap-1 text-[12.5px] text-nxi2">
                    <Stars rating={r} size={13} /> ou mais
                  </span>
                )}
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
