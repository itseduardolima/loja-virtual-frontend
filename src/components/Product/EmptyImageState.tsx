'use client'

import { ImageOff } from 'lucide-react'

interface EmptyImageStateProps {
  className?: string
  iconSize?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16 sm:w-24 sm:h-24',
  lg: 'w-20 h-20 sm:w-24 sm:h-24'
}

export function EmptyImageState({ 
  className = '', 
  iconSize = 'md' 
}: EmptyImageStateProps) {
  return (
    <div className={`flex items-center justify-center bg-gray-100 rounded-2xl h-full ${className}`}>
      <ImageOff className={`${sizeMap[iconSize]} text-gray-400`} />
    </div>
  )
}

