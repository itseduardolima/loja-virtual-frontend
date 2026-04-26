'use client'

import { useState, useCallback } from 'react'
import type { PlanFeatures } from './usePlanFeatures'

export function useFeatureLockedModal() {
  const [feature, setFeature] = useState<keyof PlanFeatures | null>(null)

  const showFeatureModal = useCallback((f: keyof PlanFeatures) => setFeature(f), [])
  const closeFeatureModal = useCallback(() => setFeature(null), [])

  return {
    lockedFeature: feature,
    showFeatureModal,
    closeFeatureModal,
  }
}
