import type { LucideIcon } from 'lucide-react'
import type { PlanFeatures } from '@/hooks/usePlanFeatures'

export interface NavItemDef {
  id: string
  label: string
  href: string
  icon: LucideIcon
  badge?: { count: number; tone: 'danger' | 'warning' }
  requiresFeature?: keyof PlanFeatures
}

export interface NavSectionDef {
  label: string
  items: NavItemDef[]
}
