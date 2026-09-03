'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import s from '../landing.module.css'

const FAQS = [
  {q:'Preciso de computador para usar?',a:'Não. Todo o painel foi pensado para funcionar no celular. Você gerencia pedidos, cadastra produtos e acompanha vendas pelo iPhone ou Android.'},
  {q:'Tem taxa por venda?',a:'Nenhuma. Você paga só a mensalidade do plano, e o dinheiro das suas vendas nunca passa pela Nexo.'},
  {q:'Como funciona o pagamento dos clientes?',a:'O cliente finaliza o pedido na sua loja e o pagamento (Pix, cartão ou combinado) você acerta direto com ele pelo WhatsApp: sem intermediário, sem taxa da Nexo.'},
  {q:'Consigo migrar de outra plataforma?',a:'Sim. Importamos seu catálogo (CSV ou manualmente) e o time ajuda na migração sem custo.'},
  {q:'Posso cancelar quando quiser?',a:'Sim, a qualquer momento pelo painel, sem multa. Você usa até o fim do período já pago.'},
  {q:'O suporte é em português?',a:'Sim, chat em português de segunda a sexta, das 9h às 19h. No plano Max, o suporte é prioritário.'},
]

export const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className={s.sec} id="suporte">
      <div className={s.seam} />
      <div className={s.wrap}>
        <div className={s.secHead}>
          <h2 className={s.h2}>O que você ainda precisa saber.</h2>
        </div>
        <div className={s.faq}>
          {FAQS.map((f, i) => (
            <div key={i} className={s.faqItem}>
              <button className={s.faqQ} onClick={() => setOpen(open === i ? null : i)} type="button">
                {f.q}
                <span className={open === i ? `${s.faqChev} ${s.faqChevOpen}` : s.faqChev}>
                  <ChevronDown size={20} color="var(--t3)" />
                </span>
              </button>
              {open === i && <div className={s.faqA}>{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
