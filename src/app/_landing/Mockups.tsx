import s from '../landing.module.css'
import { NexoLogo } from './Logo'
import { IcCart } from './icons'

/* ─── Dashboard Mockup ───────────────────────────────────────── */
interface SidebarItem { label: string; active?: boolean; badge?: number }
const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Visão geral', active: true },
  { label: 'Pedidos', badge: 7 },
  { label: 'Produtos' },
  { label: 'Clientes' },
  { label: 'Cupons' },
  { label: 'Relatórios' },
  { label: 'Configurações' },
]

interface StatTile { label: string; value: string; delta: string }
const STAT_TILES: StatTile[] = [
  { label: 'Receita', value: 'R$ 4.287', delta: '+18%' },
  { label: 'Pedidos', value: '34', delta: '+6' },
  { label: 'Ticket médio', value: 'R$ 126', delta: '+R$ 12' },
]

interface RecentOrder { id: string; name: string; value: string; status: string; color: string }
const RECENT_ORDERS: RecentOrder[] = [
  { id: '#1284', name: 'Ana C.', value: 'R$ 189', status: 'Pago', color: '#10B981' },
  { id: '#1283', name: 'João P.', value: 'R$ 76', status: 'Aguardando', color: '#F59E0B' },
  { id: '#1282', name: 'Lia M.', value: 'R$ 245', status: 'Enviado', color: '#4F46E5' },
]

const CHART_POINTS: [number, number][] = [
  [0, 60], [50, 50], [100, 38], [150, 28], [200, 32], [250, 18], [290, 18],
]

export const DashboardMockup = () => (
  <div className={s.window} style={{ width: '100%', maxWidth: 720 }}>
    <div className={s.windowBar}>
      <span className={`${s.trafficLight} ${s.trafficRed}`} />
      <span className={`${s.trafficLight} ${s.trafficYellow}`} />
      <span className={`${s.trafficLight} ${s.trafficGreen}`} />
      <div className={s.windowUrl}>minhaloja.nexo.app/admin</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', minHeight: 380, background: '#FCFCFD' }}>
      <aside style={{ background: 'white', borderRight: '1px solid #EEF0F4', padding: '16px 12px', fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', marginBottom: 14 }}>
          <NexoLogo size={20} />
          <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: '-0.01em' }}>Doce Atelier</span>
        </div>
        {SIDEBAR_ITEMS.map((it, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '7px 10px', borderRadius: 8, marginBottom: 2,
            background: it.active ? '#EEF2FF' : 'transparent',
            color: it.active ? '#4F46E5' : '#475569',
            fontWeight: it.active ? 500 : 400,
          }}>
            <span>{it.label}</span>
            {it.badge && <span style={{ background: '#F43F5E', color: 'white', fontSize: 10, padding: '1px 6px', borderRadius: 6 }}>{it.badge}</span>}
          </div>
        ))}
      </aside>
      <main style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#94A3B8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Hoje · 26 abr</div>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>Boa tarde, Marina ✨</div>
          </div>
          <div style={{ height: 28, padding: '0 12px', background: '#0F172A', color: 'white', borderRadius: 8, display: 'inline-flex', alignItems: 'center', fontSize: 12, fontWeight: 500 }}>+ Novo produto</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
          {STAT_TILES.map((st, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid #EEF0F4', borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#94A3B8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{st.label}</div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em', marginTop: 2 }}>{st.value}</div>
              <div style={{ fontSize: 11, color: '#10B981', fontFamily: 'monospace' }}>↑ {st.delta}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'white', border: '1px solid #EEF0F4', borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>Vendas · últimos 7 dias</div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace' }}>R$ 28.640</div>
          </div>
          <svg viewBox="0 0 320 80" width="100%" height="64" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0,60 C30,50 50,55 70,40 C90,25 110,30 140,28 C160,26 180,38 210,30 C240,22 260,12 290,18 L320,14 L320,80 L0,80 Z" fill="url(#chartFill)"/>
            <path d="M0,60 C30,50 50,55 70,40 C90,25 110,30 140,28 C160,26 180,38 210,30 C240,22 260,12 290,18 L320,14" stroke="#4F46E5" strokeWidth="1.6" fill="none"/>
            {CHART_POINTS.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2" fill="#4F46E5"/>
            ))}
          </svg>
        </div>
        <div style={{ background: 'white', border: '1px solid #EEF0F4', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #EEF0F4', fontSize: 12, fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
            <span>Pedidos recentes</span>
            <span style={{ color: '#4F46E5', fontSize: 11 }}>Ver todos →</span>
          </div>
          {RECENT_ORDERS.map((o, i) => (
            <div key={i} style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '50px 1fr 80px 90px', alignItems: 'center', fontSize: 12, borderTop: i ? '1px solid #F4F4F7' : 'none' }}>
              <span style={{ fontFamily: 'monospace', color: '#94A3B8' }}>{o.id}</span>
              <span style={{ fontWeight: 500 }}>{o.name}</span>
              <span style={{ fontFamily: 'monospace' }}>{o.value}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: o.color, fontSize: 11, fontWeight: 500 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: o.color }} />{o.status}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  </div>
)

/* ─── Phone Mockup ───────────────────────────────────────────── */
const PHONE_CATEGORIES = ['Bolos', 'Doces', 'Festa', 'Veg']

interface PhoneProduct { gradient: string; name: string; price: string }
const PHONE_PRODUCTS: PhoneProduct[] = [
  { gradient: 'linear-gradient(135deg, #FECACA, #FCA5A5)', name: 'Bolo de morango', price: 'R$ 89' },
  { gradient: 'linear-gradient(135deg, #FEF3C7, #FCD34D)', name: 'Brownie kit', price: 'R$ 42' },
  { gradient: 'linear-gradient(135deg, #DBEAFE, #93C5FD)', name: 'Cupcake fest', price: 'R$ 28' },
  { gradient: 'linear-gradient(135deg, #D1FAE5, #6EE7B7)', name: 'Naked cake', price: 'R$ 124' },
]

export const PhoneMockup = () => (
  <div className={s.phone}>
    <div className={s.phoneScreen}>
      <div className={s.phoneNotch} />
      <div style={{ padding: '36px 16px 12px', borderBottom: '1px solid #EEF0F4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #FBBF24, #F472B6)' }}/>
          <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: '-0.01em' }}>Doce Atelier</span>
        </div>
        <IcCart size={16} />
      </div>
      <div style={{ margin: 12, height: 110, borderRadius: 14, background: 'linear-gradient(135deg, #FCE7F3 0%, #FEF3C7 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
          <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#9F1239', letterSpacing: '0.04em' }}>FRETE GRÁTIS</div>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em', color: '#0F172A' }}>Acima de R$ 80</div>
        </div>
        <div style={{ position: 'absolute', right: -10, top: -10, width: 80, height: 80, borderRadius: '50%', background: 'rgba(244, 114, 182, 0.3)' }} />
      </div>
      <div style={{ display: 'flex', gap: 6, padding: '0 12px 10px', overflow: 'hidden' }}>
        {PHONE_CATEGORIES.map((c, i) => (
          <span key={i} style={{ fontSize: 10, padding: '4px 9px', borderRadius: 999, background: i === 0 ? '#0F172A' : '#F4F4F7', color: i === 0 ? 'white' : '#475569', whiteSpace: 'nowrap' }}>{c}</span>
        ))}
      </div>
      <div style={{ padding: '0 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {PHONE_PRODUCTS.map((p, i) => (
          <div key={i} style={{ borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ height: 70, background: p.gradient, borderRadius: 10 }} />
            <div style={{ paddingTop: 5 }}>
              <div style={{ fontSize: 10, fontWeight: 500, lineHeight: 1.2 }}>{p.name}</div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 2 }}>{p.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)
