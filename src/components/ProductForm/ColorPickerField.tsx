'use client'

// Espelha ColorPickerField de /tmp/nexo-design/nexo-criar-produto/project/sections.jsx.
// Container: Popover (Radix shadcn) — o protótipo usa um popover custom anchor-based;
// aqui o PopoverTrigger envolve o botão dashed e o PopoverContent recebe o painel.
import * as React from 'react'
import { Check, Plus, Search, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { COLOR_FAMILIES, getColorHex } from './data'
import { NxButton, Swatch } from './primitives'

export function ColorPickerField({
  value = [],
  onChange,
  max = 5,
  options,
}: {
  value: string[]
  onChange: (v: string[]) => void
  max?: number
  // cores configuradas no NicheField (field.options). As que não existem em
  // COLOR_FAMILIES viram uma família "Personalizadas" — antes o DynamicFields
  // somava COLOR_OPTIONS + field.options; preservamos esse comportamento.
  options?: string[]
}) {
  const [open, setOpen] = React.useState(false)
  const [q, setQ] = React.useState('')

  const toggle = (name: string) => {
    if (value.includes(name)) onChange(value.filter((c) => c !== name))
    else if (value.length < max) onChange([...value, name])
  }

  // base = famílias canônicas + família "Personalizadas" com as cores do nicho
  // que não estão em COLOR_FAMILIES (não perdê-las, igual ao DynamicFields antigo).
  const allFamilies = React.useMemo<{ family: string; colors: [string, string][] }[]>(() => {
    const known = new Set<string>()
    COLOR_FAMILIES.forEach((f) => f.colors.forEach(([n]) => known.add(n)))
    const extras = (options || []).filter((n) => n && !known.has(n))
    if (extras.length === 0) return COLOR_FAMILIES
    const custom: [string, string][] = extras.map((n) => [n, getColorHex(n)])
    return [...COLOR_FAMILIES, { family: 'Personalizadas', colors: custom }]
  }, [options])

  const families = React.useMemo(() => {
    if (!q.trim()) return allFamilies
    const t = q.toLowerCase()
    return allFamilies
      .map((f) => ({
        ...f,
        colors: f.colors.filter(([n]) => n.toLowerCase().includes(t)),
      }))
      .filter((f) => f.colors.length)
  }, [q, allFamilies])

  return (
    <div className="flex flex-wrap items-center gap-2">
      {value.map((name) => (
        <span
          key={name}
          className="inline-flex items-center gap-1.5 rounded-full border border-nxborder bg-white py-1 pl-1.5 pr-2 text-[12px] font-semibold text-nxi1"
        >
          <Swatch hex={getColorHex(name)} size={16} />
          {name}
          <button
            type="button"
            onClick={() => toggle(name)}
            className="text-nxi3 transition-colors hover:text-nxd"
          >
            <X size={13} />
          </button>
        </span>
      ))}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-1.5 text-[12.5px] font-semibold transition-colors',
              open
                ? 'border-nxp bg-nxp/[0.04] text-nxp'
                : 'border-nxborder text-nxi2 hover:border-nxp/50 hover:text-nxp',
            )}
          >
            <Plus size={14} /> {value.length ? 'Editar cores' : 'Selecionar cores'}
          </button>
        </PopoverTrigger>

        {value.length > 0 && (
          <span className="text-[11.5px] font-medium text-nxi3">
            {value.length}/{max}
          </span>
        )}

        <PopoverContent
          align="start"
          className="w-[min(580px,calc(100vw-40px))] rounded-2xl border-nxborder p-3 shadow-[0_12px_40px_hsl(225_32%_17%/0.16)]"
        >
          <div className="mb-2 flex items-center gap-2 px-1">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-nxi3" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar cor…"
                className="h-9 w-full rounded-lg border border-nxborder bg-white pl-8 pr-3 text-[13px] text-nxi1 placeholder:text-nxi3 focus:outline-none focus:ring-2 focus:ring-nxp/30"
              />
            </div>
            <span
              className={cn(
                'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold',
                value.length >= max ? 'bg-nxw/15 text-[#9a6a16]' : 'bg-nxp/[0.08] text-nxp',
              )}
            >
              {value.length}/{max} cores
            </span>
          </div>

          <div className="max-h-[320px] overflow-y-auto px-1 pb-1 scrollbar-thin">
            {families.map((f) => (
              <div key={f.family} className="mb-3 last:mb-0">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-nxi3">
                    {f.family}
                  </span>
                  <span className="h-px flex-1 bg-nxborder" />
                </div>
                <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                  {f.colors.map(([name, hex]) => {
                    const on = value.includes(name)
                    const dis = !on && value.length >= max
                    return (
                      <button
                        key={name}
                        type="button"
                        disabled={dis}
                        onClick={() => toggle(name)}
                        className={cn(
                          'flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-[12px] font-medium transition-colors',
                          on
                            ? 'border-nxp bg-nxp/[0.06] text-nxp'
                            : dis
                              ? 'cursor-not-allowed border-transparent text-nxi3/60'
                              : 'border-transparent text-nxi2 hover:bg-nxbg',
                        )}
                      >
                        <Swatch hex={hex} size={18} selected={on} />
                        <span className="truncate">{name}</span>
                        {on && <Check size={13} className="ml-auto shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            {!families.length && (
              <div className="py-6 text-center text-[12.5px] text-nxi3">
                Nenhuma cor encontrada.
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-nxborder px-1 pt-2.5">
            <span className="text-[11.5px] text-nxi3">
              Cada cor vira uma aba de imagens e linhas de estoque.
            </span>
            <NxButton size="sm" onClick={() => setOpen(false)}>
              Concluir
            </NxButton>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
