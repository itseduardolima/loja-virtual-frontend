'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarsProps {
  rating: number
  size?: number
  className?: string
}

export function Stars({ rating, size = 12, className }: StarsProps) {
  return (
    <span className={cn('flex items-center gap-[2px]', className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-nxborder text-nxborder'
          }
        />
      ))}
    </span>
  )
}
