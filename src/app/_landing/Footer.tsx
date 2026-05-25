import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import s from '../landing.module.css'
import { EASE } from './motion'
import { NexoWordmark } from './Logo'
import { IcInsta, IcYT, IcLI } from './icons'
import {
  FOOTER_COLUMNS,
  FOOTER_TAGLINE,
  FOOTER_LEGAL,
  FOOTER_FLAG,
  type FooterColumn,
} from './data'

interface SocialEntry {
  icon: ReactNode
  label: string
  href: string
}

const SOCIAL_LINKS: SocialEntry[] = [
  { icon: <IcInsta size={16} />, label: 'Instagram', href: '#' },
  { icon: <IcYT size={16} />, label: 'YouTube', href: '#' },
  { icon: <IcLI size={16} />, label: 'LinkedIn', href: '#' },
]

const FooterBrand = () => (
  <div>
    <NexoWordmark />
    <p style={{ marginTop: 14, fontSize: 14, color: 'var(--ink-3)', maxWidth: 280, lineHeight: 1.55 }}>
      {FOOTER_TAGLINE}
    </p>
    <div className={s.social} style={{ marginTop: 18 }}>
      {SOCIAL_LINKS.map((sc) => (
        <motion.a
          key={sc.label}
          href={sc.href}
          aria-label={sc.label}
          className={s.socialLink}
          whileHover={{ y: -2, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {sc.icon}
        </motion.a>
      ))}
    </div>
  </div>
)

const FooterColumnBlock = ({ column }: { column: FooterColumn }) => (
  <div>
    <h4>{column.heading}</h4>
    <ul className={s.footerLinks}>
      {column.links.map((link) => (
        <li key={link.label}>
          <a href={link.href}>{link.label}</a>
        </li>
      ))}
    </ul>
  </div>
)

export const Footer = () => (
  <motion.footer
    className={s.footer}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7, ease: EASE }}
  >
    <div className={s.container}>
      <div className={s.footerGrid}>
        <FooterBrand />
        {FOOTER_COLUMNS.map((column) => (
          <FooterColumnBlock key={column.heading} column={column} />
        ))}
      </div>
      <div className={s.footerBottom}>
        <span>{FOOTER_LEGAL}</span>
        <span style={{ fontFamily: 'monospace' }}>{FOOTER_FLAG}</span>
      </div>
    </div>
  </motion.footer>
)
