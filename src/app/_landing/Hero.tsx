import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'framer-motion'
import s from '../landing.module.css'
import { EASE, stagger } from './motion'
import { handleAnchor } from './scroll'
import { DashboardMockup, PhoneMockup } from './Mockups'
import { IcArrow, IcCheck, IcChart, IcPlay } from './icons'
import { HERO_BENEFITS, HERO_COPY } from './data'

interface HeroFloater {
  icon: ReactNode
  iconBg: string
  iconFg: string
  title: string
  subtitle: string
  position: CSSProperties
  delay: number
  initialY: number
}

const HERO_FLOATERS: HeroFloater[] = [
  {
    icon: <IcCheck size={14} />,
    iconBg: '#ECFDF5',
    iconFg: '#047857',
    title: 'Nova venda · R$ 189',
    subtitle: 'há 12 segundos',
    position: { top: -16, left: -20 },
    delay: 0.9,
    initialY: -10,
  },
  {
    icon: <IcChart size={14} />,
    iconBg: '#EEF2FF',
    iconFg: '#4F46E5',
    title: '+18% vs ontem',
    subtitle: 'Receita de hoje',
    position: { bottom: 30, left: -50 },
    delay: 1.15,
    initialY: 10,
  },
]

const heroChild = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export const Hero = () => (
  <section
    id="top"
    className={s.section}
    style={{ paddingTop: 80, paddingBottom: 96, overflow: 'hidden' }}
  >
    <motion.div
      className={s.bgHero}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    />
    <div className={s.container} style={{ position: 'relative' }}>
      <div
        className={s.heroGrid}
        style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }}
      >
        {/* Left — copy */}
        <motion.div initial="hidden" animate="visible" variants={stagger(0.1, 0.09)}>
          <motion.span className={s.eyebrow} variants={heroChild}>
            <span className={s.dot} />{HERO_COPY.badge}
          </motion.span>
          <motion.h1 className={s.hDisplay} variants={heroChild} style={{ marginTop: 20 }}>
            {HERO_COPY.headlineLead}{' '}
            <em
              style={{
                fontStyle: 'normal',
                background: 'linear-gradient(120deg, #4F46E5 0%, #6366F1 50%, #10B981 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {HERO_COPY.headlineHighlight}
            </em>
          </motion.h1>
          <motion.p className={s.lede} variants={heroChild} style={{ marginTop: 22 }}>
            {HERO_COPY.description}
          </motion.p>
          <motion.div variants={heroChild} style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            <motion.a
              href={HERO_COPY.primaryCta.href}
              className={`${s.btn} ${s.btnPrimary} ${s.btnLg}`}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {HERO_COPY.primaryCta.label}<IcArrow size={18} />
            </motion.a>
            <motion.a
              href={HERO_COPY.secondaryCta.href}
              className={`${s.btn} ${s.btnGhost} ${s.btnLg}`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => handleAnchor(e, HERO_COPY.secondaryCta.href)}
            >
              <IcPlay size={14} />{HERO_COPY.secondaryCta.label}
            </motion.a>
          </motion.div>
          <motion.div
            variants={heroChild}
            style={{ display: 'flex', gap: 18, marginTop: 22, flexWrap: 'wrap', fontSize: 13, color: 'var(--ink-3)' }}
          >
            {HERO_BENEFITS.map((benefit) => (
              <span key={benefit} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <IcCheck size={14} style={{ color: '#10B981' }} />{benefit}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — mockups + floaters */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          style={{ position: 'relative', minHeight: 480 }}
        >
          <div style={{ position: 'relative', maxWidth: 640, marginLeft: 'auto' }}>
            <DashboardMockup />
            <motion.div
              className={s.phoneWrap}
              initial={{ opacity: 0, y: 30, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
              style={{ position: 'absolute', right: -40, bottom: -50, zIndex: 2 }}
            >
              <PhoneMockup />
            </motion.div>

            {HERO_FLOATERS.map((f, i) => (
              <motion.div
                key={i}
                className={s.floater}
                initial={{ opacity: 0, scale: 0.8, y: f.initialY }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: f.delay }}
                whileHover={{ y: -4, scale: 1.03 }}
                style={f.position}
              >
                <span style={{ width: 32, height: 32, borderRadius: 8, background: f.iconBg, color: f.iconFg, display: 'grid', placeItems: 'center' }}>
                  {f.icon}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{f.subtitle}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)
