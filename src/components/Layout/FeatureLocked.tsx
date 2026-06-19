'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'
import type { PlanFeatures } from '@/hooks/usePlanFeatures'

interface FeatureLockedProps {
  title: string
  description: string
  feature?: keyof PlanFeatures
}

export default function FeatureLocked({ title, description }: FeatureLockedProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <span className="inline-flex h-[80px] w-[80px] items-center justify-center rounded-[22px] border border-nxborder bg-white">
        <Lock className="h-[38px] w-[38px] text-nxi3" />
      </span>
      <div className="mt-[20px] text-[24px] font-extrabold tracking-[-0.02em] text-nxi1">{title}</div>
      <div
        className="mt-[8px] max-w-[380px] text-[14px] font-semibold leading-[1.55] text-nxi2"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <Link
        href="/vendedor/plano"
        className="mt-[22px] inline-flex h-[46px] items-center justify-center rounded-[12px] bg-nxp px-[22px] text-[14px] font-extrabold text-white"
      >
        Ver planos de assinatura
      </Link>
    </div>
  )
}
