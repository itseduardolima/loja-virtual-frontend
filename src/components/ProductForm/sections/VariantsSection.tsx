'use client'

// Seção "Variantes e estoque" — espelha VariantsSection de
// /tmp/nexo-design/nexo-criar-produto/project/sections.jsx.
// O estado real é o array `variantStocks: { color, size, stock }[]` (não o map
// do protótipo). Convenção de dimensão ausente (replicada de
// src/app/vendedor/produtos/criar/page.tsx):
//   - só cores  → { color, size: '', stock }
//   - só tamanhos → { color: '', size, stock }
//   - cores × tamanhos → { color, size, stock }
import * as React from 'react'
import { useMemo, useState, useEffect, useRef } from 'react'
import { Boxes, Layers, Package, Wand2 } from 'lucide-react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import type { CreateProductFormData } from '@/schemas'
import { cn } from '@/lib/utils'
import { getColorHex } from '../data'
import {
  SectionCard,
  SectionHeader,
  FieldLabel,
  NxButton,
  NxBadge,
  Stepper,
  Swatch,
} from '../primitives'

type VariantStock = { color: string; size: string; stock: number }

interface VariantsSectionProps {
  colors: string[]
  sizes: string[]
  variantStocks: VariantStock[]
  setVariantStocks: (v: VariantStock[]) => void
  form: UseFormReturn<CreateProductFormData>
}

export function VariantsSection({
  colors,
  sizes,
  variantStocks,
  setVariantStocks,
  form,
}: VariantsSectionProps) {
  const { control } = form
  const [bulk, setBulk] = useState('')

  const hasColors = colors.length > 0
  const hasSizes = sizes.length > 0
  const hasVariants = hasColors || hasSizes

  // ── Sincroniza variantStocks quando colors/sizes mudam ─────────────────────
  // Preserva valores de combinações que continuam válidas, remove órfãs e
  // adiciona novas com 0. Convenção de dimensão ausente: string vazia.
  const syncedKey = useRef('')
  useEffect(() => {
    const rows = hasColors ? colors : ['']
    const cols = hasSizes ? sizes : ['']
    // chave de identidade do conjunto de combinações desejado
    const desiredKey = rows.map((c) => `${c}`).join('|') + '::' + cols.map((s) => `${s}`).join('|')

    const existingMap = new Map(variantStocks.map((v) => [`${v.color}|||${v.size}`, v.stock]))

    if (!hasVariants) {
      // sem variantes — não mantemos linhas de estoque por variante
      if (variantStocks.length > 0) setVariantStocks([])
      syncedKey.current = desiredKey
      return
    }

    const next: VariantStock[] = []
    rows.forEach((c) => {
      cols.forEach((s) => {
        next.push({ color: c, size: s, stock: existingMap.get(`${c}|||${s}`) ?? 0 })
      })
    })

    // só atualiza se o conjunto de combinações realmente mudou (evita loop)
    if (syncedKey.current !== desiredKey || next.length !== variantStocks.length) {
      setVariantStocks(next)
      syncedKey.current = desiredKey
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors.join('|'), sizes.join('|')])

  const getStock = (color: string, size: string) =>
    variantStocks.find((v) => v.color === color && v.size === size)?.stock ?? 0

  const setStock = (color: string, size: string, stock: number) => {
    const value = Math.max(0, isNaN(stock) ? 0 : stock)
    const idx = variantStocks.findIndex((v) => v.color === color && v.size === size)
    if (idx >= 0) {
      const updated = [...variantStocks]
      updated[idx] = { color, size, stock: value }
      setVariantStocks(updated)
    } else {
      setVariantStocks([...variantStocks, { color, size, stock: value }])
    }
  }

  const fillAll = () => {
    const v = parseInt(bulk, 10)
    if (isNaN(v) || v < 0) return
    const rows = hasColors ? colors : ['']
    const cols = hasSizes ? sizes : ['']
    const next: VariantStock[] = []
    rows.forEach((c) =>
      cols.forEach((s) => next.push({ color: c, size: s, stock: Math.max(0, v) })),
    )
    setVariantStocks(next)
    setBulk('')
  }

  const totalVariantStock = useMemo(
    () => variantStocks.reduce((a, b) => a + (b.stock || 0), 0),
    [variantStocks],
  )
  const singleStock = form.watch('stock') || 0
  const total = hasVariants ? totalVariantStock : singleStock

  const headerRight = (
    <NxBadge tone={total > 0 ? 'nxs' : 'nxi3'} icon={Boxes}>
      {total} em estoque
    </NxBadge>
  )

  return (
    <SectionCard id="sec-estoque">
      <SectionHeader
        icon={Layers}
        title="Variantes e estoque"
        right={headerRight}
        description={
          hasVariants
            ? 'Gerado automaticamente a partir de cor e tamanho do nicho.'
            : 'Este produto não tem variantes — informe o estoque total.'
        }
      />

      {hasVariants && (
        <div className="mb-4 flex flex-wrap items-end gap-2 rounded-xl bg-nxbg p-3">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Preencher tudo com</FieldLabel>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={bulk}
                onChange={(e) => setBulk(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    fillAll()
                  }
                }}
                placeholder="ex.: 10"
                className="h-9 w-24 rounded-lg border border-nxborder bg-white px-3 text-[13px] font-semibold text-nxi1 focus:outline-none focus:ring-2 focus:ring-nxp/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <NxButton size="sm" icon={Wand2} onClick={fillAll}>
                Aplicar a todas
              </NxButton>
            </div>
          </div>
          <p className="ml-auto max-w-[260px] text-right text-[11.5px] leading-snug text-nxi3">
            Aplica a mesma quantidade a cada combinação. Você pode ajustar célula a célula depois.
          </p>
        </div>
      )}

      {/* matriz cor × tamanho */}
      {hasColors && hasSizes && (
        <div className="overflow-x-auto rounded-xl border border-nxborder scrollbar-thin">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-nxbg">
                <th className="sticky left-0 z-10 min-w-[140px] bg-nxbg px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-nxi3">
                  Cor \ Tamanho
                </th>
                {sizes.map((s) => (
                  <th key={s} className="px-2 py-2.5 text-center text-[12px] font-bold text-nxi1">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {colors.map((c) => (
                <tr key={c} className="border-t border-nxborder">
                  <td className="sticky left-0 z-10 bg-white px-3 py-2">
                    <span className="flex items-center gap-2 font-semibold text-nxi1">
                      <Swatch hex={getColorHex(c)} size={16} />
                      {c}
                    </span>
                  </td>
                  {sizes.map((s) => (
                    <td key={s} className="px-1.5 py-1.5 text-center">
                      <input
                        type="number"
                        min={0}
                        value={getStock(c, s)}
                        onChange={(e) => setStock(c, s, parseInt(e.target.value, 10))}
                        className="h-9 w-14 rounded-lg border border-nxborder bg-white text-center text-[13px] font-semibold text-nxi1 focus:outline-none focus:ring-2 focus:ring-nxp/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* só cores */}
      {hasColors && !hasSizes && (
        <div className="divide-y divide-nxborder rounded-xl border border-nxborder">
          {colors.map((c) => (
            <div key={c} className="flex items-center justify-between px-3 py-2.5">
              <span className="flex items-center gap-2 text-[13px] font-semibold text-nxi1">
                <Swatch hex={getColorHex(c)} size={18} />
                {c}
              </span>
              <Stepper value={getStock(c, '')} onChange={(v) => setStock(c, '', v)} />
            </div>
          ))}
        </div>
      )}

      {/* só tamanhos */}
      {!hasColors && hasSizes && (
        <div className="divide-y divide-nxborder rounded-xl border border-nxborder">
          {sizes.map((s) => (
            <div key={s} className="flex items-center justify-between px-3 py-2.5">
              <span className="flex items-center gap-2 text-[13px] font-semibold text-nxi1">
                <span className="flex h-7 min-w-[2rem] items-center justify-center rounded-md bg-nxbg px-2 text-[12px] font-bold text-nxi2">
                  {s}
                </span>
              </span>
              <Stepper value={getStock('', s)} onChange={(v) => setStock('', s, v)} />
            </div>
          ))}
        </div>
      )}

      {/* sem variantes — estoque total ligado ao campo 'stock' do form */}
      {!hasVariants && (
        <div className="flex items-center gap-3 rounded-xl border border-nxborder bg-nxbg/60 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-nxp shadow-[0_1px_2px_hsl(0_0%_0%/0.05)]">
            <Package size={20} />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-nxi1">Estoque total</div>
            <div className="text-[11.5px] text-nxi3">Quantidade disponível para venda.</div>
          </div>
          <Controller
            control={control}
            name="stock"
            render={({ field }) => (
              <Stepper
                value={typeof field.value === 'number' ? field.value : 0}
                onChange={(v) => field.onChange(v)}
              />
            )}
          />
        </div>
      )}
    </SectionCard>
  )
}
