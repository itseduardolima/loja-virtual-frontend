'use client'

import dynamic from 'next/dynamic'
import s from '../landing.module.css'
import { useThreadFieldEnabled } from './three/useThreadFieldEnabled'

const ThreadField = dynamic(() => import('./three/ThreadField'), { ssr: false })

/**
 * Camada de fundo com as etiquetas flutuando, atrás de toda a página (não só o hero) —
 * z-index negativo: aparece nos espaços entre seções e atrás de fundos claros/transparentes,
 * fica escondida atrás de seções com fundo sólido (como a banda do CTA final).
 */
export const PageThreadField = () => {
  const enabled = useThreadFieldEnabled()

  if (!enabled) return null

  return (
    <div className={s.pageThreadWrap}>
      <ThreadField />
    </div>
  )
}
