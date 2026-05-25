'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import s from '../landing.module.css'
import { EASE } from './motion'
import { SimpleSectionHeader } from './SectionHeader'
import { IcPlus, IcWA } from './icons'
import { FAQ_ITEMS, FAQ_COPY, type FaqItem } from './data'

const itemVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

interface FaqEntryProps {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
}

const FaqEntry = ({ item, isOpen, onToggle }: FaqEntryProps) => (
  <motion.div variants={itemVariant} className={s.faqItem}>
    <button className={s.faqQ} onClick={onToggle}>
      <span>{item.q}</span>
      <span className={`${s.faqIcon} ${isOpen ? s.faqIconOpen : ''}`}>
        <IcPlus size={16} />
      </span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          style={{ overflow: 'hidden' }}
        >
          <div style={{ paddingTop: 12, color: 'var(--ink-3)', fontSize: 15, lineHeight: 1.6 }}>
            {item.a}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
)

const HelpCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.2 }}
    style={{ textAlign: 'center', marginTop: 48, padding: 24, background: 'white', border: '1px solid var(--line)', borderRadius: 16 }}
  >
    <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{FAQ_COPY.helpTitle}</div>
    <div style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 14 }}>{FAQ_COPY.helpSubtitle}</div>
    <motion.a
      href="#"
      className={`${s.btn} ${s.btnGhost}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <IcWA size={16} style={{ color: '#10B981' }} />{FAQ_COPY.helpCta}
    </motion.a>
  </motion.div>
)

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section
      id="faq"
      className={`${s.section} ${s.bgGradSoft}`}
      style={{ borderTop: '1px solid var(--line)' }}
    >
      <div className={s.container} style={{ maxWidth: 880 }}>
        <SimpleSectionHeader
          eyebrow={FAQ_COPY.eyebrow}
          title={FAQ_COPY.title}
          titleHighlight={FAQ_COPY.titleHighlight}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {FAQ_ITEMS.map((item, i) => (
            <FaqEntry
              key={i}
              item={item}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </motion.div>

        <HelpCard />
      </div>
    </section>
  )
}
