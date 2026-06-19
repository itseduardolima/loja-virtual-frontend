'use client'

import { useState } from 'react'
import { ChevronDown, MessageCircle } from 'lucide-react'
import s from '../landing.module.css'
import { FAQS } from './data'

function FaqEntry({ item, isOpen, onToggle }: { item: { q: string; a: string }; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={s.faqItem}>
      <button className={s.faqQ} onClick={onToggle}>
        <span>{item.q}</span>
        <span className={`${s.faqIcon} ${isOpen ? s.faqChevOpen : ''}`}>
          <ChevronDown size={15} />
        </span>
      </button>
      <div className={`${s.faqA} ${isOpen ? s.faqAOpen : ''}`}>
        <div className={s.faqAInner}>{item.a}</div>
      </div>
    </div>
  )
}

export function FAQ() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section id="faq" className={`${s.section} ${s.bgGradSoft} ${s.faqSection}`}>
      <div className={s.containerSm}>
        <div className={s.faqHeading} data-rev>
          <span className={s.eyebrow}><span className={s.dot} />Dúvidas</span>
          <h2 className={`${s.hSection} ${s.sectionTitle}`}>Perguntas frequentes</h2>
        </div>

        <div className={s.faqWrap}>
          {FAQS.map((item, i) => (
            <FaqEntry
              key={i}
              item={item}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>

        <div className={s.faqHelp} data-rev>
          <div className={s.faqHelpTitle}>Não encontrou sua resposta?</div>
          <div className={s.faqHelpSub}>
            Fala com a gente no WhatsApp. Resposta em até 5 minutos no horário comercial.
          </div>
          <a href="https://wa.me/5511999999999" className={`${s.btn} ${s.btnGhost}`}>
            <MessageCircle size={16} /> Conversar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
