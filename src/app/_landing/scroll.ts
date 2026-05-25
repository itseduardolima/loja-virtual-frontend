import { animate } from 'framer-motion'
import type { MouseEvent } from 'react'
import { EASE } from './motion'

export const NAV_OFFSET = 80

export const smoothScrollTo = (targetId: string) => {
  const el = document.querySelector(targetId)
  if (!el) return
  const targetY = el.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET
  animate(window.scrollY, Math.max(0, targetY), {
    duration: 0.9,
    ease: EASE,
    onUpdate: (value) => window.scrollTo(0, value),
  })
}

export const handleAnchor = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
  if (!href.startsWith('#')) return
  e.preventDefault()
  smoothScrollTo(href)
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', href)
  }
}
