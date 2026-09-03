'use client'

import { motion } from 'framer-motion'
import {
  Home,
  BarChart3,
  ShoppingBag,
  Tag,
  Package,
  FolderOpen,
  Store,
  HelpCircle,
  Settings,
  Crown,
} from 'lucide-react'
import s from '../landing.module.css'
import { fadeUp, staggerContainer, viewportOnce } from './motion'

const SECTIONS = [
  {
    label: 'Visão geral',
    items: [
      { icon: Home, label: 'Início' },
      { icon: BarChart3, label: 'Dashboard', active: true },
    ],
  },
  {
    label: 'Vendas',
    items: [
      { icon: ShoppingBag, label: 'Pedidos' },
      { icon: Tag, label: 'Cupons' },
    ],
  },
  {
    label: 'Catálogo',
    items: [
      { icon: Package, label: 'Produtos' },
      { icon: FolderOpen, label: 'Categorias' },
      { icon: Store, label: 'Vitrine' },
      { icon: HelpCircle, label: 'Perguntas' },
    ],
  },
  {
    label: 'Configurações',
    items: [
      { icon: Settings, label: 'Configurações' },
      { icon: Crown, label: 'Plano' },
    ],
  },
]

const FEATS = [
  {
    icon: <BarChart3 size={16} color="var(--emr)" />,
    iconBg: 'var(--emr-soft)',
    title: 'Saiba o que vende',
    desc: 'Receita por período, top produtos e categorias, direto no Dashboard. Decisões com dado, não com achismo.',
  },
  {
    icon: <ShoppingBag size={16} color="var(--org)" />,
    iconBg: 'var(--org-soft)',
    title: 'Sem caos, sem planilhas',
    desc: 'Em Pedidos, você arrasta o status e dispara mensagem no WhatsApp do cliente. Pronto.',
  },
  {
    icon: <Tag size={16} color="#C7861A" />,
    iconBg: '#FBF1DE',
    title: 'Descontos que convertem',
    desc: 'Em Cupons, fixo ou percentual, com validade e limite de uso. Lance promo de feriado em 30 segundos.',
  },
  {
    icon: <HelpCircle size={16} color="var(--ind)" />,
    iconBg: 'var(--ind-soft)',
    title: 'Tira-dúvida no produto',
    desc: 'Em Perguntas, o cliente pergunta direto na página do produto e a resposta fica pública pra próxima venda.',
  },
]

export const BentoFeatures = () => (
  <section className={s.sec} id="recursos">
    <div className={s.seam} />
    <div className={s.wrap}>
      <motion.div
        className={s.secHead}
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <h2 className={s.h2}>O resto da operação também mora aqui.</h2>
        <p className={s.lead}>
          O mesmo painel do catálogo cuida de relatório, cupom e dúvida de cliente. Nada disso
          pede outro app.
        </p>
      </motion.div>
      <motion.div
        className={s.panelLayout}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <motion.div className={s.panelRail} variants={fadeUp}>
          <div className={s.railLogo}>
            <div className={s.railLogoMark}>N</div>
            <div className={s.railLogoWord}>nexo</div>
          </div>
          {SECTIONS.map((section) => (
            <div key={section.label} className={s.railSection}>
              <div className={s.railSectionLabel}>{section.label}</div>
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className={`${s.railItem} ${item.active ? s.railItemActive : ''}`}
                >
                  <item.icon size={17} />
                  {item.label}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
        <motion.div className={s.panelFeats} variants={fadeUp}>
          {FEATS.map((feat) => (
            <div key={feat.title} className={s.panelFeat}>
              <span className={s.panelFeatIcon} style={{ background: feat.iconBg }}>
                {feat.icon}
              </span>
              <div>
                <div className={s.panelFeatTitle}>{feat.title}</div>
                <p className={s.panelFeatDesc}>{feat.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
)
