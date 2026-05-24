'use client'

import { sanitizeHtml } from '@/lib/sanitize'

interface ProductSpecsTabProps {
  description?: string
  specifications?: string
}

export function ProductSpecsTab({ description, specifications }: ProductSpecsTabProps) {
  if (!description && !specifications) {
    return (
      <p className="text-sm text-gray-400 py-8 text-center">
        Nenhuma especificação disponível para este produto.
      </p>
    )
  }

  return (
    <div className="py-6 sm:py-10">
      {description && (
        <div className="mb-6">
          <h2 className="text-base font-semibold text-primary mb-2">Descrição</h2>
          <p className="text-primary/60 text-sm leading-relaxed break-words">{description}</p>
        </div>
      )}
      {specifications && (
        <div>
          {description && (
            <h2 className="text-base font-semibold text-primary mb-2">Especificações</h2>
          )}
          <div
            className="text-primary/60 text-sm leading-relaxed prose prose-sm prose-headings:text-primary/80 prose-p:text-primary/60 prose-ul:text-primary/60 prose-ol:text-primary/60 prose-strong:text-primary/80 break-words max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(specifications) }}
          />
        </div>
      )}
    </div>
  )
}
