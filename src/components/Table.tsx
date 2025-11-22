'use client'

import { ReactNode } from 'react'
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Package, Eye } from 'lucide-react'
import { TablePagination } from './TablePagination'
import { Meta } from '@/types/api'

export type CellType = 'text' | 'badge' | 'button' | 'price' | 'date' | 'phone' | 'actions'

export interface Column<T = any> {
  key: string
  header: string
  accessor: string | ((row: T) => any)
  type?: CellType
  options?: {
    // Badge options
    badgeColors?: Record<string, { bg: string; text: string; border: string }>
    // Button options
    buttonIcon?: React.ComponentType<{ className?: string }>
    buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    buttonOnClick?: (row: T) => void
    // Text options
    className?: string
    align?: 'left' | 'center' | 'right'
    // Actions options
    actions?: Array<{
      type: 'switch' | 'button'
      icon?: React.ComponentType<{ className?: string }>
      variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
      onClick?: (row: T) => void
      getChecked?: (row: T) => boolean
      getDisabled?: (row: T) => boolean
      className?: string
    }>
  }
}

export interface EmptyStateConfig {
  icon?: React.ComponentType<{ className?: string }>
  title?: string
  description?: string | ((hasFilters: boolean) => string)
  action?: {
    label: string
    icon?: React.ComponentType<{ className?: string }>
    onClick: () => void
    show?: boolean | ((hasFilters: boolean) => boolean)
  }
}

export interface TableProps<T = any> {
  columns: Column<T>[]
  data: T[]
  hasFilters?: boolean
  meta?: Meta | null
  onPageChange?: (page: number) => void
  emptyState?: EmptyStateConfig
}

export function Table<T = any>({
  columns,
  data,
  hasFilters = false,
  meta,
  onPageChange,
  emptyState,
}: TableProps<T>) {
  const getCellValue = (column: Column<T>, row: T) => {
    const value = typeof column.accessor === 'function' 
      ? column.accessor(row) 
      : (row as any)[column.accessor]
    
    return value ?? null
  }

  const renderCell = (column: Column<T>, value: any, row: T): ReactNode => {
    const type = column.type || 'text'
    const options = column.options || {}
    const align = options.align || 'left'

    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>
    }

    switch (type) {
      case 'badge': {
        const badgeColors = options.badgeColors || {}
        const colorKey = typeof value === 'object' && value?.color ? value.color : 'default'
        const colors = badgeColors[colorKey] || { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' }
        const label = typeof value === 'object' && value?.label ? value.label : value
        
        return (
          <Badge
            variant="outline"
            className={`py-1 px-3 text-xs ${colors.bg} ${colors.text} ${colors.border}`}
          >
            {label}
          </Badge>
        )
      }

      case 'button': {
        const Icon = options.buttonIcon || Eye
        const variant = options.buttonVariant || 'ghost'
        const onClick = options.buttonOnClick

        return (
          <div className={align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : ''}>
            <Button
              variant={variant}
              onClick={() => onClick?.(row)}
            >
              <Icon className="h-5 w-5" />
            </Button>
          </div>
        )
      }

      case 'price': {
        return (
          <span className={`text-sm text-gray-900 ${align === 'right' ? 'text-right block' : ''} ${options.className || ''}`}>
            {value}
          </span>
        )
      }

      case 'date': {
        return (
          <span className={`text-sm text-gray-900 ${options.className || ''}`}>
            {value}
          </span>
        )
      }

      case 'phone': {
        return (
          <span className={`text-sm text-gray-900 ${options.className || ''}`}>
            {value || '-'}
          </span>
        )
      }

      case 'actions': {
        const actions = options.actions || []
        return (
          <div className="flex items-center justify-end gap-3">
            {actions.map((action, index) => {
              if (action.type === 'switch') {
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Switch
                      checked={action.getChecked ? action.getChecked(row) : false}
                      onCheckedChange={() => action.onClick?.(row)}
                      disabled={action.getDisabled ? action.getDisabled(row) : false}
                      className={action.className || 'data-[state=checked]:bg-green-500'}
                    />
                  </div>
                )
              }
              if (action.type === 'button') {
                const Icon = action.icon
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Button
                      variant={action.variant || 'ghost'}
                      size="sm"
                      onClick={() => action.onClick?.(row)}
                      disabled={action.getDisabled ? action.getDisabled(row) : false}
                      className={action.className || 'h-8 w-8 p-0'}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                    </Button>
                  </div>
                )
              }
              return null
            })}
          </div>
        )
      }

      case 'text':
      default: {
        if (value === null || value === undefined || value === '') {
          return <span className="text-gray-400 italic">Sem descrição</span>
        }
        return (
          <span className={`text-sm text-gray-900 ${options.className || ''}`}>
            {value}
          </span>
        )
      }
    }
  }

  const renderEmptyState = () => {
    if (emptyState) {
      const Icon = emptyState.icon || Package
      const title = emptyState.title || 'Nenhum item encontrado'
      const description = typeof emptyState.description === 'function' 
        ? emptyState.description(hasFilters)
        : emptyState.description || (hasFilters 
          ? 'Não há itens que correspondam aos filtros selecionados'
          : 'Nenhum item encontrado')
      const showAction = emptyState.action 
        ? (typeof emptyState.action.show === 'function' 
          ? emptyState.action.show(hasFilters)
          : emptyState.action.show !== false)
        : false

      return (
        <div className="text-center py-16">
          <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Icon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {description}
          </p>
          {showAction && emptyState.action && (
            <Button
              onClick={emptyState.action.onClick}
              className="px-6 py-3"
            >
              {emptyState.action.icon && (
                <emptyState.action.icon className="h-4 w-4 mr-2" />
              )}
              {emptyState.action.label}
            </Button>
          )}
        </div>
      )
    }

    // Empty state padrão
    const emptyMessage = hasFilters 
      ? 'Não há itens que correspondam aos filtros selecionados'
      : 'Nenhum item encontrado'

    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="h-16 w-16 text-gray-300 mb-4" />
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden bg-white border-gray-200 shadow-sm">
      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="p-6">
            {renderEmptyState()}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <TableComponent>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => {
                    const align = column.options?.align || 'left'
                    return (
                      <TableHead 
                        key={column.key}
                        className={align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : ''}
                      >
                        {column.header}
                      </TableHead>
                    )
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => {
                  const rowKey = (row as any)?.id ?? index
                  return (
                    <TableRow key={rowKey} className="hover:bg-gray-50">
                      {columns.map((column) => {
                        const value = getCellValue(column, row)
                        const align = column.options?.align || 'left'
                        return (
                          <TableCell 
                            key={column.key}
                            className={align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : ''}
                          >
                            {renderCell(column, value, row)}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </TableComponent>
          </div>
        )}
      </CardContent>
      {meta && onPageChange && (
        <div className="px-6 pb-6">
          <TablePagination meta={meta} onPageChange={onPageChange} />
        </div>
      )}
    </Card>
  )
}
