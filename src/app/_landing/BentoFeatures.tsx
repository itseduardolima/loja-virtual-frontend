'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { animate, stagger } from 'animejs'
import Image from 'next/image'
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
import { fadeUp, viewportOnce } from './motion'

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
    icon: '/landing/dashboard.svg',
    title: 'Saiba o que vende',
    desc: 'Receita por período, top produtos e categorias, direto no Dashboard. Decisões com dado, não com achismo.',
  },
  {
    icon: '/landing/timeline.svg',
    title: 'Sem caos, sem planilha',
    desc: 'Estoque e pedido conectados: quando vende, o estoque desconta sozinho.',
  },
  {
    icon: '/landing/tag.svg',
    title: 'Descontos que convertem',
    desc: 'Em Cupons, fixo ou percentual, com validade e limite de uso. Lance promo de feriado em 30 segundos.',
  },
  {
    icon: '/landing/decrease.svg',
    title: 'Tira-dúvida no produto',
    desc: 'Perguntas do cliente ficam registradas na página do produto, não perdidas no chat.',
  },
]

export const BentoFeatures = () => {
  const featsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = featsRef.current
    if (!el) return
    const icons = el.querySelectorAll<HTMLElement>('[data-feat-icon]')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        animate(icons, {
          scale: [0, 1],
          rotate: [-18, 0],
          opacity: [0, 1],
          duration: 650,
          delay: stagger(110, { start: 150 }),
          ease: 'outBack',
        })
        observer.disconnect()
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
  <section className={s.sec} id="recursos" style={{ paddingTop: 0 }}>
    <div className={s.wrap}>
      <motion.div
        className={s.panelLayout}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7 }}
      >
        <div className={s.panelRail}>
          <div className={s.railLogo}>
            <div className={s.railLogoMark} />
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
                  <item.icon size={15} />
                  {item.label}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={s.panelFeats} ref={featsRef}>
          {FEATS.map((feat) => (
            <motion.div key={feat.title} className={s.panelFeat} variants={fadeUp}>
              <span className={s.panelFeatIcon} data-feat-icon style={{ opacity: 0 }}>
                <Image src={feat.icon} alt="" width={40} height={40} />
              </span>
              <div>
                <div className={s.panelFeatTitle}>{feat.title}</div>
                <p className={s.panelFeatDesc}>{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
  )
}
