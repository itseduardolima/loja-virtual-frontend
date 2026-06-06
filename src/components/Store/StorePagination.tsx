'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface StorePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
  hasNextPage: boolean
  hasPrevPage: boolean
}

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
    <div className="flex flex-col gap-3 sm:gap-4 py-4 sm:py-6">
      {/* Informações - Mobile */}
      <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left lg:hidden">
        Página {currentPage} de {totalPages} • {totalItems} produtos
      </div>
      
      {/* Informações - Desktop */}
      <div className="hidden lg:block text-sm text-gray-600">
        Mostrando página {currentPage} de {totalPages} de {totalItems} produtos
      </div>

      {/* Controles de Paginação */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto pb-2 sm:pb-0">
        {/* Navegação */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Primeira página - Oculto em mobile muito pequeno */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={!hasPrevPage}
            className="hidden xs:flex w-8 h-8 sm:w-9 sm:h-9 p-0 flex-shrink-0"
            aria-label="Primeira página"
          >
            <ChevronsLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>

          {/* Página anterior */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="w-9 h-9 sm:w-10 sm:h-10 p-0 flex-shrink-0"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* Páginas - Ocultar alguns em mobile */}
          <div className="hidden sm:flex items-center gap-1">
            {visiblePages.map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-2 sm:px-3 py-1 text-gray-500 text-sm">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    className="w-9 h-9 sm:w-10 sm:h-10 p-0 text-sm font-medium"
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {/* Indicador de página atual - Apenas mobile */}
          <div className="flex sm:hidden items-center gap-1 px-2">
            <span className="text-sm font-medium text-gray-900 min-w-[60px] text-center">
              {currentPage} / {totalPages}
            </span>
          </div>

          {/* Próxima página */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="w-9 h-9 sm:w-10 sm:h-10 p-0 flex-shrink-0"
            aria-label="Próxima página"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* Última página - Oculto em mobile muito pequeno */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNextPage}
            className="hidden xs:flex w-8 h-8 sm:w-9 sm:h-9 p-0 flex-shrink-0"
            aria-label="Última página"
          >
            <ChevronsRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
