'use client'

import Image from 'next/image'
import {
  Star,
  Image as ImageIcon,
  CheckCircle2,
  FileText,
  CircleSlash,
  Pencil,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  LucideIcon,
} from 'lucide-react'
import { NxBadge, Swatch, getColorHex, formatBRL } from '@/components/ProductForm'
import { RowActionsMenu, thClass, type RowAction } from '@/components/VendorList'
import { buildImageUrl } from '@/lib/imageUtils'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

const STATUS: Record<number, { tone: 'nxs' | 'nxw' | 'nxi3'; label: string; icon: LucideIcon }> = {
  1: { tone: 'nxs', label: 'Ativo', icon: CheckCircle2 },
  2: { tone: 'nxi3', label: 'Rascunho', icon: FileText },
  0: { tone: 'nxw', label: 'Inativo', icon: CircleSlash },
}

function firstImage(product: Product): string | null {
  const imgs = product.images
  if (Array.isArray(imgs)) return imgs[0] ?? null
  if (imgs && typeof imgs === 'object') {
    const first = Object.values(imgs)[0]
    return Array.isArray(first) ? (first[0] ?? null) : null
  }
  return null
}

function productColors(product: Product): string[] {
  const field = product.dynamic_fields?.find((f) => f.field_name.toLowerCase() === 'cor')
  if (!field?.value) return []
  return String(field.value)
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
}

function Thumb({ product }: { product: Product }) {
  const img = firstImage(product)
  return (
    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-nxborder bg-nxbg">
      {img ? (
        <Image src={buildImageUrl(img)} alt={product.name} fill className="object-cover" sizes="44px" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-nxi3">
          <ImageIcon size={15} />
        </div>
      )}
      {product.featured === 1 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-nxa text-white">
          <Star size={9} />
        </span>
      )}
    </div>
  )
}

interface ProductsTableProps {
  products: Product[]
  storeSlug?: string
  onEdit: (id: number) => void
  onView: (id: number) => void
  onDuplicate: (id: number) => void
  onToggleStatus: (id: number, currentStatus: number) => void
  onDelete: (product: Product) => void
  isDuplicating?: boolean
  isUpdatingStatus?: boolean
}

export function ProductsTable({
  products,
  storeSlug,
  onEdit,
  onView,
  onDuplicate,
  onToggleStatus,
  onDelete,
  isDuplicating,
  isUpdatingStatus,
}: ProductsTableProps) {
  const rowActions = (product: Product): RowAction[] => {
    const isActive = product.status === 1
    const actions: RowAction[] = [
      { label: 'Editar', icon: Pencil, onClick: () => onEdit(product.id) },
    ]
    if (storeSlug) {
      actions.push({
        label: 'Ver na loja',
        icon: Eye,
        href: `/loja/${storeSlug}/produto/${product.id}`,
      })
    }
    actions.push(
      {
        label: 'Duplicar',
        icon: Copy,
        onClick: () => onDuplicate(product.id),
        disabled: isDuplicating,
      },
      {
        label: isActive ? 'Desativar' : 'Ativar',
        icon: isActive ? EyeOff : Eye,
        onClick: () => onToggleStatus(product.id, product.status),
        disabled: isUpdatingStatus,
      },
      {
        label: 'Excluir',
        icon: Trash2,
        onClick: () => onDelete(product),
        destructive: true,
        separatorBefore: true,
      },
    )
    return actions
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            <th className={cn(thClass, 'px-4')}>Produto</th>
            <th className={cn(thClass, 'hidden md:table-cell')}>Categoria</th>
            <th className={thClass}>Preço</th>
            <th className={thClass}>Estoque</th>
            <th className={thClass}>Status</th>
            <th className={cn(thClass, 'w-12')}></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const st = STATUS[product.status] ?? STATUS[0]
            const colors = productColors(product)
            const promoActive = product.promo_active && product.promo_price
            const low = product.stock > 0 && product.stock <= 10

            return (
              <tr
                key={product.id}
                className="border-t border-nxborder text-[13px] transition-colors hover:bg-nxbg/60"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Thumb product={product} />
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onView(product.id)}
                        className="block max-w-[260px] truncate text-left font-semibold text-nxi1 transition-colors hover:text-nxp"
                      >
                        {product.name}
                      </button>
                      <div className="mt-0.5 flex items-center gap-2 text-[11.5px] text-nxi3">
                        {product.category?.name && (
                          <span className="truncate md:hidden">{product.category.name}</span>
                        )}
                        {colors.length > 0 && (
                          <span className="flex items-center gap-0.5">
                            {colors.slice(0, 3).map((c) => (
                              <Swatch key={c} hex={getColorHex(c)} size={11} />
                            ))}
                            {colors.length > 3 && <span className="ml-0.5">+{colors.length - 3}</span>}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-2 py-3 md:table-cell">
                  <span className="text-[12.5px] font-medium text-nxi2">
                    {product.category?.name ?? '—'}
                  </span>
                </td>
                <td className="px-2 py-3">
                  {promoActive ? (
                    <div>
                      <div className="font-bold text-nxi1">{formatBRL(product.promo_price)}</div>
                      <div className="text-[11px] text-nxi3 line-through">{formatBRL(product.price)}</div>
                    </div>
                  ) : (
                    <div className="font-bold text-nxi1">{formatBRL(product.price)}</div>
                  )}
                </td>
                <td className="px-2 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full text-[12px] font-bold',
                      product.stock === 0
                        ? 'bg-nxd/[0.08] px-2 py-0.5 text-nxd'
                        : low
                          ? 'bg-nxw/[0.16] px-2 py-0.5 text-[#9a6a16]'
                          : 'text-nxi1',
                    )}
                  >
                    {product.stock === 0 ? 'Esgotado' : `${product.stock} un`}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <NxBadge tone={st.tone} icon={st.icon}>
                    {st.label}
                  </NxBadge>
                </td>
                <td className="px-2 py-3">
                  <RowActionsMenu actions={rowActions(product)} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
