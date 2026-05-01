'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import s from '../landing.module.css'
import { EASE } from './motion'
import { IcArrow } from './icons'
import { FINAL_CTA_COPY } from './data'

export const FinalCTA = () => {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section className={s.section} ref={ref}>
      <div className={s.container}>
        <motion.div
          className={s.ctaBand}
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <motion.div style={{ y }}>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', borderRadius: 999,
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                fontSize: 12, fontFamily: 'monospace', letterSpacing: '0.04em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)',
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#10B981', boxShadow: '0 0 0 4px rgba(16,185,129,0.3)',
                }}
              />
              {FINAL_CTA_COPY.badge}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className={s.hDisplay}
              style={{ marginTop: 16, fontSize: 'clamp(32px, 4.5vw, 56px)', color: 'white' }}
            >
              {FINAL_CTA_COPY.titleLine1}<br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #A5F3FC 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {FINAL_CTA_COPY.titleLine2}
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.45 }}
              style={{ marginTop: 18, fontSize: 18, color: 'rgba(255,255,255,0.7)', maxWidth: 520, lineHeight: 1.5 }}
            >
              {FINAL_CTA_COPY.description}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <motion.a
              href={FINAL_CTA_COPY.primaryCta.href}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`${s.btn} ${s.btnLg}`}
              style={{
                background: 'white', color: '#0F172A',
                boxShadow: '0 10px 40px -10px rgba(255,255,255,0.5)', border: 'none',
              }}
            >
              {FINAL_CTA_COPY.primaryCta.label}<IcArrow size={18} />
            </motion.a>
            <a
              href={FINAL_CTA_COPY.secondaryCta.href}
              style={{
                textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.7)',
                textDecoration: 'underline', textUnderlineOffset: 4,
              }}
            >
              {FINAL_CTA_COPY.secondaryCta.label}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
