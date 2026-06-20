import { Download } from 'lucide-react'
import s from '../landing.module.css'

export const BentoFeatures = () => (
  <section className={s.sec} id="recursos">
    <div className={s.wrap}>
      <div className={s.secHead} data-rev>
        <div className={s.eyebrow}>Recursos</div>
        <h2 className={s.h2}>Tudo que sua loja precisa</h2>
      </div>
      <div className={s.bento}>

        {/* 1 — Catálogo */}
        <div className={`${s.bcard} ${s.bCat}`} data-rev>
          <div className={s.bvis} style={{background:'#F5F6FF'}}>
            <div className={s.bentoProductGrid}>
              {[
                {grad:'linear-gradient(135deg,#F9A8D4,#D946EF)',name:'Vestido midi',price:'R$ 189',colors:['#F472B6','#0F172A','#FBBF24']},
                {grad:'linear-gradient(135deg,#60A5FA,#4F46E5)',name:'Tênis branco',price:'R$ 229',colors:['#fff','#0F172A','#60A5FA']},
                {grad:'linear-gradient(135deg,#6EE7B7,#10B981)',name:'Camisa slim',price:'R$ 139',colors:['#10B981','#fff','#334155']},
              ].map((p, i) => (
                <div key={i} className={s.bentoProductCard}>
                  <div className={s.bentoProductImg} style={{background:p.grad}} />
                  <div className={s.bentoProductName}>{p.name}</div>
                  <div className={s.bentoProductPrice}>{p.price}</div>
                  <div className={s.bentoSwatches}>
                    {p.colors.map((c, j) => (
                      <span key={j} className={s.bentoDot} style={{background:c,boxShadow:c==='#fff'?'inset 0 0 0 1px #CBD5E1':undefined}} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={s.bbody}>
            <span className={s.btag} style={{color:'#4F46E5'}}><span className={s.bdot} style={{background:'#4F46E5'}} />Catálogo</span>
            <h3>Produtos com personalidade</h3>
            <p>Variantes de cor, tamanho, fotos múltiplas e SEO automático. Sua vitrine digital, no jeito do seu cliente.</p>
          </div>
        </div>

        {/* 2 — Pedidos */}
        <div className={`${s.bcard} ${s.bPed}`} data-rev>
          <div className={s.bvis} style={{background:'#FBFBFD'}}>
            <div className={s.bentoKanban}>
              {[
                {label:'Novo',count:3,color:'#E8A33D',orders:[{code:'#121',name:'Ana C.'},{code:'#122',name:'João P.'}]},
                {label:'Pago',count:5,color:'#4F46E5',orders:[{code:'#118',name:'Lia M.'},{code:'#119',name:'Rui A.'}]},
                {label:'Enviado',count:12,color:'#10B981',orders:[{code:'#106',name:'Bia R.'},{code:'#107',name:'Téo L.'}]},
              ].map((col, i) => (
                <div key={i} className={s.bentoKanbanCol}>
                  <div className={s.bentoKanbanHeader}>
                    <span className={s.bentoKanbanDot} style={{background:col.color}} />
                    <span className={s.bentoKanbanLbl}>{col.label}</span>
                    <span className={s.bentoKanbanCount}>{col.count}</span>
                  </div>
                  {col.orders.map((o) => (
                    <div key={o.code} className={s.bentoOrderMini}>
                      <div className={s.bentoOrderCode}>{o.code}</div>
                      <div className={s.bentoOrderName}>{o.name}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className={s.bbody}>
            <span className={s.btag} style={{color:'#B45309'}}><span className={s.bdot} style={{background:'#E8A33D'}} />Pedidos</span>
            <h3>Sem caos, sem planilhas</h3>
            <p>Kanban arrasta-e-solta: muda o status do pedido e dispara mensagem no WhatsApp do cliente. Pronto.</p>
          </div>
        </div>

        {/* 3 — Cupons */}
        <div className={`${s.bcard} ${s.bCup}`} data-rev>
          <div className={s.bvis} style={{background:'#FFF5F7'}}>
            <div className={s.bentoCouponWrap}>
              <span className={`${s.bentoCouponNotch} ${s.bentoCouponNotchL}`} />
              <span className={`${s.bentoCouponNotch} ${s.bentoCouponNotchR}`} />
              <div className={s.bentoCouponLabel}>CÓDIGO</div>
              <div className={s.bentoCouponCode}>NEXO20</div>
              <div className={s.bentoCouponMeta}>20% off · 142 usos · expira 30/jun</div>
            </div>
          </div>
          <div className={s.bbody}>
            <span className={s.btag} style={{color:'#BE123C'}}><span className={s.bdot} style={{background:'#BE123C'}} />Cupons</span>
            <h3>Descontos que convertem</h3>
            <p>Fixo ou percentual, com validade e limite de uso. Lance promo de feriado em 30 segundos.</p>
          </div>
        </div>

        {/* 4 — Dashboard */}
        <div className={`${s.bcard} ${s.bDash}`} data-rev>
          <div className={s.bvis} style={{background:'#F2FCF7'}}>
            <div className={s.bentoDashLabel}>Receita · 30 dias</div>
            <div className={s.bentoDashRow}>
              <span className={s.bentoDashNum}>R$ 8.420</span>
              <span className={s.bentoDashDelta}>▲ 18%</span>
            </div>
            <svg viewBox="0 0 200 56" width="100%" height="52" preserveAspectRatio="none" style={{marginTop:'8px',display:'block'}}>
              <path d="M0,48 L20,43 L40,45 L60,35 L80,38 L100,28 L120,31 L140,20 L160,18 L180,11 L200,7 L200,56 L0,56 Z" fill="rgba(16,185,129,0.16)" />
              <path d="M0,48 L20,43 L40,45 L60,35 L80,38 L100,28 L120,31 L140,20 L160,18 L180,11 L200,7" fill="none" stroke="#10B981" strokeWidth="1.5" />
            </svg>
          </div>
          <div className={s.bbody}>
            <span className={s.btag} style={{color:'#047857'}}><span className={s.bdot} style={{background:'#10B981'}} />Dashboard</span>
            <h3>Saiba o que vende</h3>
            <p>Receita por período, top produtos e categorias. Decisões com dado, não com achismo.</p>
          </div>
        </div>

        {/* 5 — Perguntas */}
        <div className={`${s.bcard} ${s.bPerg}`} data-rev>
          <div className={s.bvis} style={{background:'#FBFBFD'}}>
            <div className={s.bentoChatWrap}>
              <div className={s.bentoBubbleLeft}>
                <div className={`${s.bentoBubbleName} ${s.bentoBubbleNameLeft}`}>Carla</div>
                <div className={s.bentoBubbleMsgLeft}>Vocês fazem entrega em Niterói?</div>
              </div>
              <div className={s.bentoBubbleRight}>
                <div className={`${s.bentoBubbleName} ${s.bentoBubbleNameRight}`}>Você</div>
                <div className={s.bentoBubbleMsgRight}>Sim! Entregamos toda a região 🚚</div>
              </div>
            </div>
          </div>
          <div className={s.bbody}>
            <span className={s.btag} style={{color:'#B45309'}}><span className={s.bdot} style={{background:'#E8A33D'}} />Perguntas</span>
            <h3>Tira-dúvida no produto</h3>
            <p>Cliente pergunta direto na página. Você responde, e a resposta fica pública pra próxima venda.</p>
          </div>
        </div>

        {/* 6 — Exportar (full width, horizontal on desktop) */}
        <div className={`${s.bcard} ${s.bExp}`} data-rev>
          <div className={s.bbody}>
            <span className={s.btag} style={{color:'#047857'}}><span className={s.bdot} style={{background:'#10B981'}} />Exportar</span>
            <h3>Sua contadora vai amar</h3>
            <p>Pedidos em Excel com tudo que ela precisa. Um clique, uma planilha pronta — fechamento do mês sem dor de cabeça.</p>
          </div>
          <div className={s.bvis} style={{background:'#F2FCF7'}}>
            <div className={s.bentoExportFile}>
              <div className={s.bentoExportIcon}>XLS</div>
              <div className={s.bentoExportInfo}>
                <div className={s.bentoExportFilename}>pedidos_mai.xlsx</div>
                <div className={s.bentoExportMeta}>284 linhas · 12 KB</div>
              </div>
              <div className={s.bentoExportBtn}>
                <Download size={17} color="#047857" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
)
