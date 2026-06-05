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
    <div className="sticky top-16 z-40 border-b border-nxborder bg-white/95 backdrop-blur">
      <div
        ref={trackRef}
        className="relative mx-auto flex h-12 max-w-[1180px] items-center overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden md:px-10"
      >
        {/* underline deslizante */}
        <div
          className="pointer-events-none absolute bottom-0 z-0 h-[2px] bg-nxp"
          style={{
            left: indicator.left,
            width: indicator.width,
            transition: 'left .34s cubic-bezier(.22,1,.36,1), width .26s cubic-bezier(.22,1,.36,1)',
          }}
        />

        {categories.map((cat, index) => (
          <button
            key={cat}
            ref={(el) => {
              pillRefs.current[index] = el
            }}
            onClick={() => onSelect(cat)}
            className={[
              'relative z-10 h-full whitespace-nowrap px-4 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] transition-colors first:pl-0',
              active === cat ? 'text-nxi1' : 'text-nxi3 hover:text-nxi2',
            ].join(' ')}
          >
            {cat}
            {counts && cat !== 'Todos' && counts[cat] != null && counts[cat]! > 0 && (
              <span className="ml-1 text-[9px] opacity-60">{counts[cat]}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
