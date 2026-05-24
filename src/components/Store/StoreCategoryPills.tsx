'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

interface StoreCategoryPillsProps {
  categories: string[]
  active: string
  onSelect: (cat: string) => void
  counts?: Record<string, number>
}

export function StoreCategoryPills({ categories, active, onSelect, counts }: StoreCategoryPillsProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const updateIndicator = useCallback(() => {
    const activeIndex = categories.indexOf(active)
    if (activeIndex === -1) return
    const pill = pillRefs.current[activeIndex]
    const track = trackRef.current
    if (!pill || !track) return
    const trackRect = track.getBoundingClientRect()
    const pillRect = pill.getBoundingClientRect()
    setIndicator({
      left: pillRect.left - trackRect.left + track.scrollLeft,
      width: pillRect.width,
    })
  }, [active, categories])

  useEffect(() => {
    updateIndicator()
  }, [updateIndicator])

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-gray-100">
      <div
        ref={trackRef}
        className="relative overflow-x-auto [&::-webkit-scrollbar]:hidden h-11 flex items-center justify-center"
      >
        {/* Sliding underline indicator */}
        <div
          className="absolute bottom-0 h-[1.5px] bg-[#111] pointer-events-none z-0"
          style={{
            left: indicator.left,
            width: indicator.width,
            transition: 'left .3s cubic-bezier(.22,1,.36,1), width .24s cubic-bezier(.22,1,.36,1)',
          }}
        />

        {categories.map((cat, index) => (
          <button
            key={cat}
            ref={(el) => { pillRefs.current[index] = el }}
            onClick={() => onSelect(cat)}
            className={[
              'px-[22px] h-full text-[10.5px] font-semibold tracking-[.12em] uppercase whitespace-nowrap',
              'bg-transparent border-none cursor-pointer relative z-10 transition-colors',
              active === cat
                ? 'text-[#111]'
                : 'text-[#AFAFAF] hover:text-gray-600',
            ].join(' ')}
          >
            {cat}
            {counts && cat !== 'Todos' && counts[cat] != null && counts[cat]! > 0 && (
              <span className="text-[9px] opacity-60 ml-[3px]">({counts[cat]})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
