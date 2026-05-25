import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import s from '../landing.module.css'
import { EASE } from './motion'

export const bentoCardVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export interface BentoCardProps {
  span?: number
  bg?: string
  fg?: string
  tag: string
  title: string
  desc: string
  accent: ReactNode
  children?: ReactNode
}

export const BentoCard = ({
  span = 2,
  bg = '#EEF2FF',
  fg = '#4F46E5',
  tag,
  title,
  desc,
  accent,
  children,
}: BentoCardProps) => (
  <motion.div
    className={s.bentoCard}
    variants={bentoCardVariant}
    whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
    style={{ gridColumn: `span ${span}` }}
  >
    <div className={s.bentoHead}>
      <span style={{ width: 22, height: 22, borderRadius: 6, background: bg, color: fg, display: 'grid', placeItems: 'center' }}>
        {accent}
      </span>
      <span>{tag}</span>
    </div>
    <h3>{title}</h3>
    <p>{desc}</p>
    {children && <div className={s.bentoVisual}>{children}</div>}
  </motion.div>
)
