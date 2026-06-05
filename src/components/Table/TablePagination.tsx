'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Meta } from '@/types'

export interface TablePaginationProps {
  meta: Meta | null | undefined
  onPageChange: (page: number) => void
}

export function TablePagination({ meta, onPageChange }: TablePaginationProps) {
  if (!meta || meta.lastPage <= 1) {
    return null
  }

  return (
    <div className="mt-6 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.currentPage - 1)}
          disabled={meta.currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <span className="text-sm text-gray-600 px-4">
          Página {meta.currentPage} de {meta.lastPage}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.currentPage + 1)}
          disabled={meta.currentPage === meta.lastPage}
        >
          Próxima
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

