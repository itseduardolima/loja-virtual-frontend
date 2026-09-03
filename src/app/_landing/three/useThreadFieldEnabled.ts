'use client'

import { useEffect, useState } from 'react'

/** Ativa o campo de etiquetas 3D só em telas grandes e quando o usuário não pediu menos movimento. */
export function useThreadFieldEnabled() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const wideMq = window.matchMedia('(min-width: 1024px)')
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const update = () => setEnabled(wideMq.matches && !motionMq.matches)
    update()

    wideMq.addEventListener('change', update)
    motionMq.addEventListener('change', update)
    return () => {
      wideMq.removeEventListener('change', update)
      motionMq.removeEventListener('change', update)
    }
  }, [])

  return enabled
}
