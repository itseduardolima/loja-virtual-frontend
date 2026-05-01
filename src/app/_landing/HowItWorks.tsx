import { motion } from 'framer-motion'
import s from '../landing.module.css'
import { EASE } from './motion'
import { SimpleSectionHeader } from './SectionHeader'
import { HOW_IT_WORKS_STEPS, STEPS_COPY } from './data'

const stepVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export const HowItWorks = () => (
  <section
    id="how"
    className={`${s.section} ${s.bgGradSoft}`}
    style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}
  >
    <div className={s.container}>
      <SimpleSectionHeader
        eyebrow={STEPS_COPY.eyebrow}
        title={STEPS_COPY.title}
        titleHighlight={STEPS_COPY.titleHighlight}
      />

      <motion.div
        className={s.steps}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }}
      >
        {HOW_IT_WORKS_STEPS.map((step, i) => (
          <motion.div key={step.number} className={s.step} variants={stepVariant}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className={s.stepNum}>{step.number}</span>
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {step.duration}
              </span>
            </div>
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ height: 140, borderRadius: 16, background: 'white', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 56, boxShadow: 'var(--sh-sm)' }}
            >
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
              >
                {step.emoji}
              </motion.span>
            </motion.div>
            <div>
              <h3>{step.title}</h3>
              <p style={{ marginTop: 6 }}>{step.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
)
