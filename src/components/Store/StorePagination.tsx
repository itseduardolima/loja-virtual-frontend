'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { StorePaginationProps } from '@/app/loja/[slug]/produtos/types'

export function StorePagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  hasNextPage,
  hasPrevPage
}: StorePaginationProps) {
 

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
      {/* Informações */}
      <div className="text-sm text-gray-600">
        Mostrando {currentPage} de {totalPages} de {totalItems} produtos
      </div>

      {/* Controles de Paginação */}
      <div className="flex items-center gap-2">


        {/* Navegação */}
        <div className="flex items-center gap-1">
          {/* Primeira página */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={!hasPrevPage}
            className="w-8 h-8 p-0"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>

          {/* Página anterior */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="w-8 h-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Páginas */}
          {visiblePages.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-3 py-1 text-gray-500">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              )}
            </div>
          ))}

          {/* Próxima página */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="w-8 h-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Última página */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNextPage}
            className="w-8 h-8 p-0"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
