import s from '../landing.module.css'

const BENTO_CARDS = [
  {
    span: s.bentoSpan3,
    bg: '#EEF2FF',
    fg: '#4F46E5',
    tag: 'Catálogo',
    title: 'Produtos com personalidade',
    desc: 'Variantes de cor e tamanho, fotos múltiplas, preço e estoque. Sua vitrine digital do jeito que o cliente espera.',
    Visual: () => (
      <div className={s.bentoProductGrid}>
        {[
          { bg: 'linear-gradient(135deg,#FECACA,#F472B6)', name: 'Bolo morango', price: 'R$ 89', swatches: ['#FECACA','#FCD34D','#A7F3D0'] },
          { bg: 'linear-gradient(135deg,#DBEAFE,#6366F1)', name: 'Caixa premium', price: 'R$ 124', swatches: ['#DBEAFE','#C7D2FE','#E0E7FF'] },
          { bg: 'linear-gradient(135deg,#D1FAE5,#10B981)', name: 'Kit festa', price: 'R$ 76', swatches: ['#D1FAE5','#A7F3D0','#6EE7B7'] },
        ].map((p, i) => (
          <div key={i} className={s.bentoProductCard}>
            <div className={s.bentoProductImg} style={{background: p.bg}} />
            <div className={s.bentoProductInfo}>
              <div className={s.bentoProductName}>{p.name}</div>
              <div className={s.bentoProductPrice}>{p.price}</div>
              <div className={s.bentoSwatches}>
                {p.swatches.map((c, j) => (
                  <span key={j} className={s.bentoDot} style={{background: c}} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    span: s.bentoSpan3,
    bg: '#FEF3C7',
    fg: '#B45309',
    tag: 'Pedidos',
    title: 'Sem caos, sem planilhas',
    desc: 'Kanban visual. Troca o status, o cliente recebe notificação. Tudo organizado, mesmo nos dias de pico.',
    Visual: () => (
      <div className={s.bentoKanban}>
        {[
          { label: 'Novo', count: 3, color: '#F59E0B', orders: ['Ana C.', 'João P.'] },
          { label: 'Pago', count: 5, color: '#4F46E5', orders: ['Lia M.', 'Carlos'] },
          { label: 'Enviado', count: 12, color: '#10B981', orders: ['Bela S.', 'Marco'] },
        ].map((col, i) => (
          <div key={i} className={s.bentoKanbanCol}>
            <div className={s.bentoKanbanHeader}>
              <span className={s.bentoKanbanLabel}>
                <span className={s.bentoKanbanDot} style={{background: col.color}} />
                {col.label}
              </span>
              <span className={s.bentoKanbanCount}>{col.count}</span>
            </div>
            {col.orders.map((name, k) => (
              <div key={k} className={s.bentoOrderCard}>
                <div className={s.bentoOrderCode}>#12{i}{k}</div>
                <div className={s.bentoOrderName}>{name}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    ),
  },
  {
    span: s.bentoSpan2,
    bg: '#FFE4E6',
    fg: '#BE123C',
    tag: 'Cupons',
    title: 'Descontos que convertem',
    desc: 'Fixo ou percentual, com validade e limite de uso. Lance promo em 30 segundos.',
    Visual: () => (
      <div className={s.bentoCouponWrap}>
        <div className={s.bentoCouponLabel}>Código</div>
        <div className={s.bentoCouponCode}>NEXO20</div>
        <div className={s.bentoCouponMeta}>20% off · 142 usos · expira 30/jul</div>
      </div>
    ),
  },
  {
    span: s.bentoSpan2,
    bg: '#ECFDF5',
    fg: '#047857',
    tag: 'Dashboard',
    title: 'Saiba o que vende',
    desc: 'Receita por período, top produtos e categorias. Decisões com dado, não com achismo.',
    Visual: () => (
      <div>
        <div className={s.bentoDashEyebrow}>Receita hoje</div>
        <div className={s.bentoDashValue}>R$ 1.890</div>
        <div className={s.bentoDashDelta}>↑ +23% vs ontem</div>
        <svg viewBox="0 0 200 48" width="100%" height="48" preserveAspectRatio="none">
          <path d="M0,42 C30,34 50,24 80,26 C110,28 130,12 160,9 L200,4 L200,48 L0,48 Z" fill="rgba(16,185,129,.15)" />
          <path d="M0,42 C30,34 50,24 80,26 C110,28 130,12 160,9 L200,4" stroke="#10B981" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    ),
  },
  {
    span: s.bentoSpan2,
    bg: '#EEF2FF',
    fg: '#4F46E5',
    tag: 'ERP',
    title: 'Bling, sincronizado',
    desc: 'Pedidos viram notas fiscais com seu CNPJ, automaticamente. Emite NF em 30 segundos.',
    Visual: () => (
      <div>
        <div className={s.bentoErpRow}>
          <div className={`${s.bentoErpBox} ${s.bentoErpBoxNexo}`}>
            <span className={s.bentoErpLogo}>N</span>
          </div>
          <div className={s.bentoErpLine} />
          <div className={`${s.bentoErpBox} ${s.bentoErpBoxBling}`}>
            ERP
          </div>
        </div>
        <div className={s.bentoErpStatus}>
          <span className={s.bentoErpDot} />
          sincronizado · há 2 min
        </div>
      </div>
    ),
  },
  {
    span: s.bentoSpan2,
    bg: '#F1F5F9',
    fg: '#334155',
    tag: 'Perguntas',
    title: 'Tira-dúvida no produto',
    desc: 'Cliente pergunta direto na página. Você responde e a resposta fica pública pra próxima venda.',
    Visual: () => (
      <div className={s.bentoQWrap}>
        <div className={s.bentoQAsk}>Carla pergunta:</div>
        <div className={s.bentoQText}>&quot;Vocês fazem entrega em Niterói?&quot;</div>
        <div className={s.bentoQReplyLabel}>Você respondeu:</div>
        <div className={s.bentoQText}>&quot;Sim! Entregamos toda a região metropolitana.&quot;</div>
      </div>
    ),
  },
  {
    span: s.bentoSpan2,
    bg: '#ECFDF5',
    fg: '#047857',
    tag: 'Exportar',
    title: 'Sua contadora vai amar',
    desc: 'Pedidos em Excel, com tudo que ela precisa. Um clique, uma planilha pronta.',
    Visual: () => (
      <div className={s.bentoExportFile}>
        <div className={s.bentoExportIcon}>XLS</div>
        <div>
          <div className={s.bentoExportFilename}>pedidos_jun.xlsx</div>
          <div className={s.bentoExportMeta}>284 linhas · 12 KB</div>
        </div>
      </div>
    ),
  },
  {
    span: s.bentoSpan4,
    bg: '#F1F5F9',
    fg: '#334155',
    tag: 'Pagamentos',
    title: 'Pix, cartão e boleto sem configurar nada',
    desc: 'Asaas integrado. O cliente paga, o dinheiro cai direto na sua conta. Sem intermediário, sem comissão Nexo.',
    Visual: () => (
      <div className={s.bentoPayMethods}>
        {[{emoji: '⚡', name: 'Pix'}, {emoji: '💳', name: 'Cartão'}, {emoji: '📄', name: 'Boleto'}].map((m, i) => (
          <div key={i} className={s.bentoPayMethod}>
            <div className={s.bentoPayEmoji}>{m.emoji}</div>
            {m.name}
          </div>
        ))}
      </div>
    ),
  },
]

export function BentoFeatures() {
  return (
    <section id="recursos" className={s.section}>
      <div className={s.container}>
        <div className={s.bentoHeading} data-rev>
          <span className={s.eyebrow}><span className={s.dot} />Tudo numa só plataforma</span>
          <h2 className={`${s.hSection} ${s.sectionTitle}`}>
            Recursos que vendem por você
          </h2>
          <p className={`${s.lede} ${s.sectionSubtitle}`}>
            Você foca em criar produtos. O Nexo cuida do resto — do catálogo ao financeiro.
          </p>
        </div>

        <div className={s.bento}>
          {BENTO_CARDS.map((card, i) => {
            const { Visual, span, bg, fg, tag, title, desc } = card
            return (
              <div key={i} className={`${s.bentoCard} ${span}`} data-rev>
                <div className={s.bentoHead}>
                  <span className={s.bentoHeadDot} style={{background: fg}} />
                  {tag}
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className={s.bentoVisual}>
                  <Visual />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
