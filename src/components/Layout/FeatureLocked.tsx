'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lock, Sparkles, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FeatureLockedModal } from './FeatureLockedModal'
import type { PlanFeatures } from '@/hooks/usePlanFeatures'

interface FeatureLockedProps {
  title: string
  description: string
  feature?: keyof PlanFeatures
}

export default function FeatureLocked({ title, description, feature }: FeatureLockedProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 sm:p-12 flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-5">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mb-6">{description}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/vendedor/plano">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Ver opções de plano
              </Button>
            </Link>
            {feature && (
              <Button size="lg" variant="outline" className="gap-2" onClick={() => setModalOpen(true)}>
                <Info className="h-4 w-4" />
                Saber mais
              </Button>
            )}
          </div>
        </div>
      </div>

      {feature && <FeatureLockedModal feature={feature} open={modalOpen} onOpenChange={setModalOpen} />}
    </>
  )
}
