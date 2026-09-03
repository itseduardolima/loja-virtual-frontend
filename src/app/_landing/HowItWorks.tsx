import { Package, Share2, CheckCircle2 } from 'lucide-react'
import s from '../landing.module.css'

const STEPS = [
  {
    icon: <Package size={18} color="var(--ind)" />,
    iconBg: 'var(--ind-soft)',
    num: '01',
    title: 'Monte sua loja',
    desc: 'Nome, fotos e preços dos produtos que você já vende.',
    time: '~2 min',
  },
  {
    icon: <Share2 size={18} color="var(--org)" />,
    iconBg: 'var(--org-soft)',
    num: '02',
    title: 'Compartilhe o link',
    desc: 'No story, na bio do Instagram, ou direto no WhatsApp.',
    time: '~1 min',
  },
  {
    icon: <CheckCircle2 size={18} color="var(--emr)" />,
    iconBg: 'var(--emr-soft)',
    num: '03',
    title: 'Receba organizado',
    desc: 'Pedido registrado com status, e o pagamento você combina no WhatsApp, como sempre fez.',
    time: 'venda 24h',
  },
]

export const HowItWorks = () => (
  <section className={s.sec} id="como-funciona">
    <div className={s.seam} />
    <div className={s.wrap}>
      <div className={s.secHead}>
        <h2 className={s.h2}>Três passos até a primeira venda.</h2>
        <p className={s.lead}>Três passos, direto do celular, sem precisar de ninguém de TI.</p>
      </div>
      <div className={s.stepsRow}>
        {STEPS.map((step) => (
          <div key={step.num} className={s.stepCard}>
            <div className={s.stepTop}>
              <span className={s.stepIcon} style={{ background: step.iconBg }}>
                {step.icon}
              </span>
              <span className={s.stepNum}>{step.num}</span>
            </div>
            <h3 className={s.stepTitle}>{step.title}</h3>
            <p className={s.stepDesc}>{step.desc}</p>
            <span className={s.stepTime}>{step.time}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
)
