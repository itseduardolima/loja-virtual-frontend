import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import s from '../landing.module.css'
import { EASE } from './motion'
import { BentoCard, type BentoCardProps } from './BentoCard'
import { SectionHeader } from './SectionHeader'
import { NexoLogo } from './Logo'
import { BENTO_COPY } from './data'
import {
  IcCart, IcKanban, IcTag, IcChart, IcReceipt, IcCard, IcQ, IcDownload,
} from './icons'

/* ─── Card visuals (each card has its own composed visual) ──── */
const CatalogVisual = () => {
  const items = [
    { gradient: 'linear-gradient(135deg, #FECACA, #F472B6)', name: 'Bolo morango', value: 'R$ 89' },
    { gradient: 'linear-gradient(135deg, #DBEAFE, #6366F1)', name: 'Caixa premium', value: 'R$ 124' },
    { gradient: 'linear-gradient(135deg, #D1FAE5, #10B981)', name: 'Kit festa', value: 'R$ 76' },
  ]
  const swatches = ['#FECACA', '#FCD34D', '#A7F3D0']
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
      {items.map((p, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}
        >
          <div style={{ height: 64, background: p.gradient }} />
          <div style={{ padding: '8px 10px' }}>
            <div style={{ fontSize: 11, fontWeight: 500 }}>{p.name}</div>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '-0.02em' }}>{p.value}</div>
            <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
              {swatches.map((c, j) => (
                <span key={j} style={{ width: 8, height: 8, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.05)' }} />
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const KanbanVisual = () => {
  const cols = [
    { label: 'Novo', count: 3, color: '#F59E0B' },
    { label: 'Pago', count: 5, color: '#4F46E5' },
    { label: 'Enviado', count: 12, color: '#10B981' },
  ]
  const names = ['Ana C.', 'João P.', 'Lia M.']
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {cols.map((col, i) => (
        <motion.div key={i} whileHover={{ y: -2 }} style={{ background: '#F8F9FB', borderRadius: 10, padding: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'monospace', color: 'var(--ink-3)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: col.color }} />{col.label}
            </span>
            <span>{col.count}</span>
          </div>
          {[1, 2].map((k) => (
            <motion.div
              key={k}
              whileHover={{ x: 2 }}
              style={{ background: 'white', border: '1px solid var(--line-soft)', borderRadius: 8, padding: '6px 8px', marginBottom: 4, fontSize: 10 }}
            >
              <div style={{ fontFamily: 'monospace', color: 'var(--ink-3)' }}>#12{i}{k}</div>
              <div style={{ fontWeight: 500, marginTop: 2 }}>{names[k % 3]}</div>
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

const CouponVisual = () => (
  <div style={{ background: 'linear-gradient(135deg, #FFE4E6 0%, #FECDD3 100%)', borderRadius: 12, padding: 14 }}>
    <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#9F1239', letterSpacing: '0.04em' }}>CÓDIGO</div>
    <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 600, color: '#0F172A', letterSpacing: '-0.02em' }}>NEXO20</div>
    <div style={{ fontSize: 11, color: 'var(--ink-2)', marginTop: 4 }}>20% off · 142 usos · expira 30/abr</div>
  </div>
)

const ChartVisual = () => (
  <svg viewBox="0 0 200 60" width="100%" height="56" preserveAspectRatio="none">
    <motion.path
      d="M0,50 C30,40 50,30 80,32 C110,34 130,18 160,15 L200,8 L200,60 L0,60 Z"
      fill="rgba(16,185,129,0.18)"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.3 }}
    />
    <motion.path
      d="M0,50 C30,40 50,30 80,32 C110,34 130,18 160,15 L200,8"
      stroke="#10B981" strokeWidth="1.5" fill="none"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
    />
  </svg>
)

const ErpSyncVisual = () => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'white', border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}>
        <NexoLogo size={22} />
      </div>
      <div style={{ flex: 1, height: 2, background: 'repeating-linear-gradient(90deg, #94A3B8 0 4px, transparent 4px 8px)', position: 'relative' }}>
        <motion.div
          animate={{ left: ['10%', '90%', '10%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: -4, width: 10, height: 10, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 0 4px rgba(16,185,129,0.15)' }}
        />
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg, #1E40AF, #3B82F6)', display: 'grid', placeItems: 'center', color: 'white', fontFamily: 'monospace', fontWeight: 600, fontSize: 11 }}>
        ERP
      </div>
    </div>
    <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#047857', marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <motion.span
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }}
      />
      sincronizado · há 2 min
    </div>
  </>
)

const PaymentMethodsVisual = () => {
  const methods = [
    { emoji: '⚡', name: 'Pix' },
    { emoji: '💳', name: 'Cartão' },
    { emoji: '📄', name: 'Boleto' },
  ]
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {methods.map((m, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -3, scale: 1.03 }}
          style={{ flex: 1, padding: '10px 8px', textAlign: 'center', borderRadius: 10, background: 'white', border: '1px solid var(--line)', fontSize: 12, fontWeight: 500 }}
        >
          <div style={{ fontSize: 16, marginBottom: 2 }}>{m.emoji}</div>
          {m.name}
        </motion.div>
      ))}
    </div>
  )
}

const QuestionVisual = () => (
  <div style={{ background: '#F8F9FB', borderRadius: 10, padding: 10, fontSize: 12 }}>
    <div style={{ fontWeight: 500 }}>Carla pergunta:</div>
    <div style={{ color: 'var(--ink-3)', marginTop: 2 }}>&quot;Vocês fazem entrega em Niterói?&quot;</div>
    <div style={{ fontWeight: 500, marginTop: 8, color: '#4F46E5' }}>Você respondeu:</div>
    <div style={{ color: 'var(--ink-3)', marginTop: 2 }}>
      &quot;Sim! Entregamos toda a região metropolitana.&quot;
    </div>
  </div>
)

const ExportVisual = () => (
  <motion.div
    whileHover={{ x: 4 }}
    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: '#F8F9FB', borderRadius: 10 }}
  >
    <div style={{ width: 36, height: 44, borderRadius: 6, background: 'linear-gradient(180deg, #10B981, #047857)', display: 'grid', placeItems: 'center', color: 'white', fontFamily: 'monospace', fontWeight: 600, fontSize: 11 }}>XLS</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, fontWeight: 500 }}>pedidos_abr.xlsx</div>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'monospace' }}>284 linhas · 12 KB</div>
    </div>
    <IcDownload size={16} style={{ color: '#047857' }} />
  </motion.div>
)

/* ─── Card configuration (data-driven) ──────────────────────── */
type BentoCardData = Omit<BentoCardProps, 'children'> & { Visual: () => ReactNode }

const BENTO_CARDS: BentoCardData[] = [
  { span: 3, bg: '#EEF2FF', fg: '#4F46E5', tag: 'Catálogo', title: 'Produtos com personalidade',
    desc: 'Variantes de cor, tamanho, fotos múltiplas e SEO automático. Sua vitrine digital, no jeito do seu cliente.',
    accent: <IcCart size={14} />, Visual: CatalogVisual },
  { span: 3, bg: '#FEF3C7', fg: '#B45309', tag: 'Pedidos', title: 'Sem caos, sem planilhas',
    desc: 'Kanban drag-and-drop. Arrasta o pedido, troca o status, dispara mensagem no WhatsApp do cliente. Pronto.',
    accent: <IcKanban size={14} />, Visual: KanbanVisual },
  { span: 2, bg: '#FFE4E6', fg: '#BE123C', tag: 'Cupons', title: 'Descontos que convertem',
    desc: 'Fixo ou percentual, com validade e limite de uso. Lance promo de feriado em 30 segundos.',
    accent: <IcTag size={14} />, Visual: CouponVisual },
  { span: 2, bg: '#ECFDF5', fg: '#047857', tag: 'Dashboard', title: 'Saiba o que vende',
    desc: 'Receita por período, top produtos e categorias. Decisões com dado, não com achismo.',
    accent: <IcChart size={14} />, Visual: ChartVisual },
  { span: 2, bg: '#EEF2FF', fg: '#4F46E5', tag: 'ERP', title: 'Bling, sincronizado',
    desc: 'Pedidos viram notas fiscais com o seu CNPJ, automaticamente. Emite NF em 30 segundos.',
    accent: <IcReceipt size={14} />, Visual: ErpSyncVisual },
  { span: 2, bg: '#F1F5F9', fg: '#334155', tag: 'Pagamentos', title: 'Pix, cartão e boleto',
    desc: 'Asaas integrado. Você não configura nada — recebe direto na sua conta.',
    accent: <IcCard size={14} />, Visual: PaymentMethodsVisual },
  { span: 2, bg: '#FEF3C7', fg: '#B45309', tag: 'Perguntas', title: 'Tira-dúvida no produto',
    desc: 'Cliente pergunta direto na página. Você responde, e a resposta fica pública pra próxima venda.',
    accent: <IcQ size={14} />, Visual: QuestionVisual },
  { span: 2, bg: '#ECFDF5', fg: '#047857', tag: 'Exportar', title: 'Sua contadora vai amar',
    desc: 'Pedidos em Excel, com tudo que ela precisa. Um clique, uma planilha pronta.',
    accent: <IcDownload size={14} />, Visual: ExportVisual },
]

export const BentoFeatures = () => (
  <section id="features" className={s.section}>
    <div className={s.container}>
      <SectionHeader
        eyebrow={BENTO_COPY.eyebrow}
        title={BENTO_COPY.title}
        titleHighlight={BENTO_COPY.titleHighlight}
        subtitle={BENTO_COPY.subtitle}
      />

      <motion.div
        className={s.bento}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
      >
        {BENTO_CARDS.map((card, i) => {
          const { Visual, ...cardProps } = card
          return (
            <BentoCard key={i} {...cardProps}>
              <Visual />
            </BentoCard>
          )
        })}
      </motion.div>
    </div>
  </section>
)
