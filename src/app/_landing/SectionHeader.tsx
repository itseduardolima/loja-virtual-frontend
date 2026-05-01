import { motion } from 'framer-motion'
import s from '../landing.module.css'
import { EASE, fadeUp, stagger } from './motion'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  titleHighlight?: string
  subtitle?: string
  align?: 'center' | 'left'
  maxWidth?: number
  marginBottom?: number
}

export const SectionHeader = ({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  align = 'center',
  maxWidth = 720,
  marginBottom = 56,
}: SectionHeaderProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.4 }}
    variants={stagger(0, 0.1)}
    style={{
      textAlign: align,
      maxWidth,
      margin: align === 'center' ? `0 auto ${marginBottom}px` : `0 0 ${marginBottom}px`,
    }}
  >
    <motion.span variants={fadeUp} className={s.eyebrow}>
      <span className={s.dot} />{eyebrow}
    </motion.span>
    <motion.h2 variants={fadeUp} className={s.hSection} style={{ marginTop: 18 }}>
      {title}{titleHighlight && (
        <>
          {' '}<span style={{ color: '#4F46E5' }}>{titleHighlight}</span>
        </>
      )}
    </motion.h2>
    {subtitle && (
      <motion.p
        variants={fadeUp}
        className={s.lede}
        style={{ margin: align === 'center' ? '18px auto 0' : '18px 0 0' }}
      >
        {subtitle}
      </motion.p>
    )}
  </motion.div>
)

/* Simpler header without subtitle stagger — used when only title is needed */
export const SimpleSectionHeader = ({
  eyebrow,
  title,
  titleHighlight,
  marginBottom = 56,
}: Omit<SectionHeaderProps, 'subtitle' | 'align' | 'maxWidth'>) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.6, ease: EASE }}
    style={{ maxWidth: 720, margin: `0 auto ${marginBottom}px`, textAlign: 'center' }}
  >
    <span className={s.eyebrow}><span className={s.dot} />{eyebrow}</span>
    <h2 className={s.hSection} style={{ marginTop: 18 }}>
      {title}{titleHighlight && (
        <>
          {' '}<span style={{ color: '#4F46E5' }}>{titleHighlight}</span>
        </>
      )}
    </h2>
  </motion.div>
)
