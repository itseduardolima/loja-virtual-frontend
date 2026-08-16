'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SubNavSection {
  id: string
  label: string
  count?: number | null
}

interface ProductSubNavProps {
  sections: SubNavSection[]
  storeHref: string
}

const NAV_OFFSET = 64 + 48 // header + subnav

export function ProductSubNav({ sections, storeHref }: ProductSubNavProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const spyLock = useRef(false)
  const [active, setActive] = useState(sections[0]?.id)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  // sliding underline follows the active item
  useEffect(() => {
    const index = sections.findIndex((s) => s.id === active)
    const item = itemRefs.current[index]
    const track = trackRef.current
    if (!item || !track) return
    const trackRect = track.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()
    setIndicator({ left: itemRect.left - trackRect.left + track.scrollLeft, width: itemRect.width })
  }, [active, sections])

  // scroll spy: last section whose top passed below the subnav (+ end of page)
  useEffect(() => {
    const onScroll = () => {
      if (spyLock.current) return
      const scrollEl = document.scrollingElement || document.documentElement
      const atBottom = window.innerHeight + window.scrollY >= scrollEl.scrollHeight - 4
      if (atBottom) {
        setActive(sections[sections.length - 1]?.id)
        return
      }
      let current = sections[0]?.id
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el && el.getBoundingClientRect().top <= NAV_OFFSET + 8) current = section.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [sections])

  const jump = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setActive(id)
    spyLock.current = true
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET,
      behavior: 'smooth',
    })
    setTimeout(() => {
      spyLock.current = false
    }, 750)
  }

  return (
    <div className="sticky top-16 z-40 border-b border-nxborder bg-white/95 backdrop-blur">
      <div
        ref={trackRef}
        className="relative mx-auto flex h-12 max-w-store items-center overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden md:px-10"
      >
        <div
          className="pointer-events-none absolute bottom-0 z-0 h-[2px] bg-store"
          style={{
            left: indicator.left,
            width: indicator.width,
            transition:
              'left .34s cubic-bezier(.22,1,.36,1), width .26s cubic-bezier(.22,1,.36,1)',
          }}
        />
        {sections.map((section, index) => (
          <button
            key={section.id}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            onClick={() => jump(section.id)}
            className={cn(
              'relative z-10 h-full whitespace-nowrap px-4 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] transition-colors first:pl-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-inset',
              active === section.id ? 'text-nxi1' : 'text-nxi3 hover:text-nxi2',
            )}
          >
            {section.label}
            {section.count ? <span className="ml-1 text-[9px] opacity-60">{section.count}</span> : null}
          </button>
        ))}
        <Link
          href={storeHref}
          className="ml-auto hidden items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-nxi3 no-underline transition-colors hover:text-store-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-inset sm:flex"
        >
          <ArrowLeft size={13} /> Continuar comprando
        </Link>
      </div>
    </div>
  )
}
