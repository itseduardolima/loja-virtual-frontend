'use client'

import { Tag, BadgeCheck, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { SectionCard } from './SectionCard'
import { inputCls } from './Field'
import type { CouponResult } from '../useCheckoutPage'

interface CouponSectionProps {
  couponInput: string
  setCouponInput: (v: string) => void
  couponResult: CouponResult | null
  couponError: string
  setCouponError: (v: string) => void
  isValidatingCoupon: boolean
  handleValidateCoupon: () => void
  handleRemoveCoupon: () => void
}

export function CouponSection({
  couponInput,
  setCouponInput,
  couponResult,
  couponError,
  setCouponError,
  isValidatingCoupon,
  handleValidateCoupon,
  handleRemoveCoupon,
}: CouponSectionProps) {
  function discountLabel(result: CouponResult): string {
    if (result.type === 'percent') return `${result.value}% de desconto`
    return `${formatPrice(result.value)} de desconto`
  }

  return (
    <SectionCard
      n="3"
      icon={Tag}
      title="Cupom de desconto"
      desc="Tem um código? Aplique aqui."
      done={!!couponResult}
    >
      {couponResult ? (
        <div className="flex items-center justify-between rounded-xl border border-nxs/30 bg-nxs/[0.07] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <BadgeCheck size={18} className="text-nxs" />
            <div>
              <span className="text-[13px] font-bold text-nxi1">{couponResult.coupon_code}</span>
              <span className="ml-2 text-[12px] font-semibold text-nxs">
                {discountLabel(couponResult)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveCoupon}
            className="text-nxi3 transition-colors hover:text-nxd"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value.toUpperCase())
                setCouponError('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleValidateCoupon()
                }
              }}
              placeholder="Código do cupom"
              className={`${inputCls(!!couponError)} flex-1`}
            />
            <button
              type="button"
              onClick={handleValidateCoupon}
              disabled={!couponInput.trim() || isValidatingCoupon}
              className="h-11 shrink-0 rounded-xl border border-store px-5 text-[13px] font-bold text-store-ink transition-colors hover:bg-store hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 disabled:opacity-40"
            >
              {isValidatingCoupon ? '...' : 'Aplicar'}
            </button>
          </div>
          {couponError && (
            <p className="mt-1.5 text-[11.5px] font-semibold text-nxd">{couponError}</p>
          )}
        </>
      )}
    </SectionCard>
  )
}
