'use client'

import { sanitizeHtml } from '@/lib/sanitize'
import { cn } from '@/lib/utils'

interface ProductSpecsSectionProps {
  specifications?: string
  category?: string
  dynamicFields?: Array<{ field_name: string; value: string }>
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function ProductSpecsSection({
  specifications,
  category,
  dynamicFields,
}: ProductSpecsSectionProps) {
  const rows: Array<[string, string]> = [
    ...(category ? ([['Categoria', category]] as Array<[string, string]>) : []),
    ...(dynamicFields ?? [])
      .filter((f) => f.value && f.value.trim() !== '')
      .map((f) => [capitalize(f.field_name), f.value] as [string, string]),
  ]

  if (rows.length === 0 && !specifications) return null

  return (
    <section id="especificacoes" className="border-t border-nxborder py-12 md:py-14">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-nxi3">
        Especificações
      </span>
      <h2 className="mt-2 font-integral text-[20px] font-bold uppercase tracking-[-0.01em] text-nxi1 sm:text-[23px]">
        Ficha do produto
      </h2>
      <div
        className={cn(
          'mt-6 grid grid-cols-1 gap-x-14 gap-y-8',
          rows.length > 0 && specifications && 'md:grid-cols-2',
        )}
      >
        {rows.length > 0 && (
          <div>
            {rows.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-3 border-b border-nxborder py-3 text-[13.5px]"
              >
                <span className="font-semibold text-nxi3">{key}</span>
                <span className="text-right font-semibold text-nxi1">{value}</span>
              </div>
            ))}
          </div>
        )}
        {specifications && (
          <div
            className="prose prose-sm max-w-none break-words text-[14px] leading-relaxed text-nxi2 prose-headings:text-nxi1 prose-p:text-nxi2 prose-ul:text-nxi2 prose-ol:text-nxi2 prose-strong:text-nxi1"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(specifications) }}
          />
        )}
      </div>
    </section>
  )
}
