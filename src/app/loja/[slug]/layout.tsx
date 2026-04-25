'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function LojaLayout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams() as { slug: string }

  useEffect(() => {
    if (slug) localStorage.setItem('last-store', slug)
  }, [slug])

  return <>{children}</>
}
