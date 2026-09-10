'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { animate, stagger } from 'animejs'
import { Play, Coins, ShoppingCart, Package, TrendingUp } from 'lucide-react'
import s from '../landing.module.css'
import { fadeUp, staggerContainer, viewportOnce } from './motion'

const KPIS = [
  {
    label: 'Vendas',
    value: 'R$ 4.230,50',
    delta: '↑ R$ 620,00 vs período anterior',
    tone: s.dmIcPrimary,
    Icon: Coins,
  },
  {
    label: 'Pedidos',
    value: '38',
    delta: '↑ 6 pedidos',
    tone: s.dmIcAccent,
    Icon: ShoppingCart,
  },
  {
    label: 'Produtos vendidos',
    value: '52',
    delta: '↑ 9 produtos',
    tone: s.dmIcWarning,
    Icon: Package,
  },
  {
    label: 'Conversão do carrinho',
    value: '3,8%',
    delta: 'estável',
    tone: s.dmIcSuccess,
    Icon: TrendingUp,
  },
]

const TOP_PRODUCTS = [
  { name: 'TV retrô vintage', revenue: 'R$ 890', sold: '12 vendidos', pct: 82, image: '/landing/retro-tv.png' },
  {
    name: 'Computador desktop retrô',
    revenue: 'R$ 610',
    sold: '9 vendidos',
    pct: 64,
    image: '/landing/personal-computer.png',
  },
  { name: 'Fone gamer premium', revenue: 'R$ 329', sold: '4 vendidos', pct: 41, image: '/landing/headphone.png' },
]

const RECENT_ORDERS = [
  { name: 'Carla M.', value: 'R$ 189', status: 'Entregue', tone: s.dmIcSuccess, avatar: '/landing/avatar-carla.svg' },
  {
    name: 'Juliana R.',
    value: 'R$ 259',
    status: 'Em preparo',
    tone: s.dmIcPrimary,
    avatar: '/landing/avatar-juliana.svg',
  },
  { name: 'Diego F.', value: 'R$ 329', status: 'Pendente', tone: s.dmIcWarning, avatar: '/landing/avatar-diego.svg' },
]

export const Hero = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const kpisRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chartPath = chartRef.current?.querySelector<SVGPathElement>('[data-chart-line]')
    if (chartPath) {
      const length = chartPath.getTotalLength()
      chartPath.style.strokeDasharray = `${length}`
      chartPath.style.strokeDashoffset = `${length}`
      animate(chartPath, {
        strokeDashoffset: [length, 0],
        duration: 1400,
        delay: 300,
        ease: 'outQuart',
      })
    }

    const values = kpisRef.current?.querySelectorAll<HTMLElement>('[data-kpi-value]')
    if (values?.length) {
      values.forEach((el) => {
        const raw = el.dataset.kpiValue ?? ''
        // formato pt-BR: "R$ 4.230,50" -> remove pontos de milhar antes de trocar a vírgula decimal
        const numeric = parseFloat(raw.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.'))
        if (Number.isNaN(numeric)) return
        const counter = { value: 0 }
        animate(counter, {
          value: numeric,
          duration: 1100,
          delay: stagger(120, { start: 400 }),
          ease: 'outExpo',
          onUpdate: () => {
            el.textContent = raw.replace(/[\d.,]+/, formatCounter(counter.value, raw))
          },
        })
      })
    }
  }, [])

  return (
    <section className={s.hero}>
      <div className={s.wrap}>
      <motion.div
        className={s.heroCopy}
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.span className={s.eyebrow} variants={fadeUp}>
          <span className={s.dot} />
          Venda direto no WhatsApp
        </motion.span>
        <motion.h1 className={s.h1} variants={fadeUp}>
          Chega de perder venda no WhatsApp.
        </motion.h1>
        <motion.p className={`${s.lead} ${s.heroSub}`} variants={fadeUp}>
          Catálogo, carrinho e pedido organizado num link só. O pagamento continua combinado no
          WhatsApp, do jeito que seu cliente já confia.
        </motion.p>
        <motion.div className={s.heroCtas} variants={fadeUp}>
          <Link href="#precos" className={`${s.btn} ${s.btnPri} ${s.btnLg}`}>
            Criar minha loja
          </Link>
          <button className={`${s.btn} ${s.btnDark} ${s.btnLg}`} type="button">
            <Play size={15} />
            Ver como funciona
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        className={s.heroStage}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        <div className={s.frame}>
          <div className={s.frameBar}>
            <div className={s.frameDots}>
              <span />
              <span />
              <span />
            </div>
            <span className={s.frameUrl}>app.nexo.com.br/vendedor/dashboard</span>
          </div>

          <div className={s.dm}>
            <div className={s.dmHead}>
              <div>
                <div className={s.dmTitle}>Dashboard</div>
                <div className={s.dmSub}>Acompanhe vendas, pedidos e desempenho.</div>
              </div>
              <div className={s.dmChips}>
                <span className={s.dmChip}>Hoje</span>
                <span className={`${s.dmChip} ${s.dmChipOn}`}>7d</span>
                <span className={s.dmChip}>30d</span>
                <span className={s.dmChip}>90d</span>
              </div>
            </div>

            <div className={s.dmKpis} ref={kpisRef}>
              {KPIS.map(({ label, value, delta, tone, Icon }) => (
                <div className={s.dmKpi} key={label}>
                  <div className={s.dmKpiTop}>
                    <span className={s.dmKpiLabel}>{label}</span>
                    <span className={`${s.dmKpiIc} ${tone}`}>
                      <Icon size={12} strokeWidth={2} />
                    </span>
                  </div>
                  <div className={s.dmKpiVal} data-kpi-value={value}>
                    {value}
                  </div>
                  <div className={`${s.dmKpiDelta} ${delta.startsWith('↑') ? s.dmUp : s.dmFlat}`}>
                    {delta}
                  </div>
                </div>
              ))}
            </div>

            <div className={s.dmGrid}>
              <div className={s.dmCard}>
                <div className={s.dmCardHead}>
                  <span className={s.dmCardTitle}>Receita</span>
                </div>
                <div className={s.dmRevVal}>R$ 4.230,50</div>
                <div className={s.dmLegend}>
                  <span>
                    <i style={{ background: 'var(--p, #2A2D7C)' }} /> Período atual
                  </span>
                  <span>
                    <i style={{ background: '#b7bbc9' }} /> Anterior
                  </span>
                </div>
                <div className={s.dmChart} ref={chartRef}>
                  <svg viewBox="0 0 520 190" width="100%" style={{ display: 'block' }} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="revgrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2A2D7C" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#2A2D7C" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <g stroke="#ECEEF3" strokeWidth="1">
                      <line x1="0" y1="15" x2="520" y2="15" />
                      <line x1="0" y1="55" x2="520" y2="55" />
                      <line x1="0" y1="95" x2="520" y2="95" />
                      <line x1="0" y1="135" x2="520" y2="135" />
                      <line x1="0" y1="165" x2="520" y2="165" />
                    </g>
                    <path
                      d="M10,150 C50,150 80,158 120,150 C160,142 190,165 230,160 C270,155 300,130 340,125 C380,120 410,140 450,130 C480,123 500,110 510,105"
                      fill="none"
                      stroke="#b7bbc9"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <path
                      d="M10,140 L10,140 C40,125 65,120 95,110 C125,100 150,135 180,150 C210,165 235,110 265,90 C300,65 320,70 350,60 C380,50 410,85 435,100 C460,113 485,70 510,50 L510,165 L10,165 Z"
                      fill="url(#revgrad)"
                    />
                    <path
                      data-chart-line
                      d="M10,140 C40,125 65,120 95,110 C125,100 150,135 180,150 C210,165 235,110 265,90 C300,65 320,70 350,60 C380,50 410,85 435,100 C460,113 485,70 510,50"
                      fill="none"
                      stroke="#2A2D7C"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <circle cx="510" cy="50" r="3.5" fill="#2A2D7C" />
                    <text x="2" y="12" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#8A93A8">
                      R$5k
                    </text>
                    <text x="2" y="98" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#8A93A8">
                      R$2k
                    </text>
                    <text x="8" y="185" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#8A93A8">
                      01/08
                    </text>
                    <text x="240" y="185" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#8A93A8">
                      04/08
                    </text>
                    <text x="475" y="185" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#8A93A8">
                      07/08
                    </text>
                  </svg>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className={s.dmCard}>
                  <div className={s.dmCardHead}>
                    <span className={s.dmCardTitle}>Top produtos</span>
                    <span className={s.dmCardLink}>Ver todos →</span>
                  </div>
                  <div className={s.dmRowList}>
                    {TOP_PRODUCTS.map((p) => (
                      <div className={s.dmRow} key={p.name}>
                        <span className={s.dmThumb}>
                          <Image src={p.image} alt="" width={32} height={32} style={{ objectFit: 'cover', borderRadius: 9 }} />
                        </span>
                        <div>
                          <div className={s.dmRowName}>{p.name}</div>
                          <div className={s.dmBar}>
                            <i style={{ width: `${p.pct}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className={s.dmRowVal}>{p.revenue}</div>
                          <div className={s.dmRowCap}>{p.sold}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={s.dmCard}>
                  <div className={s.dmCardHead}>
                    <span className={s.dmCardTitle}>Pedidos recentes</span>
                    <span className={s.dmCardLink}>Ver pedidos →</span>
                  </div>
                  <div className={s.dmRowList}>
                    {RECENT_ORDERS.map((o) => (
                      <div className={s.dmRow} key={o.name}>
                        <span className={s.dmAvatar}>
                          <Image src={o.avatar} alt="" width={32} height={32} style={{ borderRadius: '50%' }} />
                        </span>
                        <div className={s.dmRowName}>{o.name}</div>
                        <div>
                          <div className={s.dmRowVal}>{o.value}</div>
                          <span className={`${s.dmStatus} ${o.tone}`}>{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  )
}

function formatCounter(current: number, template: string): string {
  const hasComma = template.includes(',')
  const isPercent = template.includes('%')
  if (isPercent) return current.toFixed(1).replace('.', ',')
  if (hasComma && template.includes('R$')) {
    return current.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return Math.round(current).toString()
}
