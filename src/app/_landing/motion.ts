import type { Variants } from 'framer-motion'

// Mesma curva/ritmo do hero — reaproveitada nas animações de scroll do resto da landing.
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
}

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

// once:true — anima só na primeira vez que entra na tela, não repete ao rolar pra cima e voltar.
export const viewportOnce = { once: true, margin: '-80px' } as const
