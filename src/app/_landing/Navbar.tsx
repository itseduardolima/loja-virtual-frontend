import { motion } from 'framer-motion'
import s from '../landing.module.css'
import { EASE } from './motion'
import { handleAnchor } from './scroll'
import { NexoWordmark } from './Logo'
import { IcArrow } from './icons'
import { NAV_LINKS } from './data'

export const Navbar = () => (
  <motion.nav
    className={s.nav}
    initial={{ y: -64, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, ease: EASE }}
  >
    <div className={s.container}>
      <div className={s.navInner}>
        <NexoWordmark />
        <nav className={s.navLinks}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={(e) => handleAnchor(e, link.href)}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className={s.navActions}>
          <a href="/login" style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 500, padding: '0 10px' }}>
            Entrar
          </a>
          <motion.a
            href="/assinatura"
            className={`${s.btn} ${s.btnPrimary}`}
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
          >
            Começar grátis<IcArrow size={16} />
          </motion.a>
        </div>
      </div>
    </div>
  </motion.nav>
)
