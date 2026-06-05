import type { NavLink, FaqItem, Step, FooterColumn } from '@/types'

export type { NavLink, FaqItem, Step, FooterColumn }

/* ─── Navbar ─────────────────────────────────────────────────── */
export const NAV_LINKS: NavLink[] = [
  { label: 'Recursos', href: '#features' },
  { label: 'Como funciona', href: '#how' },
  { label: 'Planos', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

/* ─── Hero ───────────────────────────────────────────────────── */
export const HERO_BENEFITS: string[] = [
  'Sem cartão de crédito',
  'Setup em 5 min',
  'Suporte em português',
]

/* ─── How it works ───────────────────────────────────────────── */
export const HOW_IT_WORKS_STEPS: Step[] = [
  {
    number: '01',
    title: 'Crie sua conta',
    description: 'Gratuito, sem cartão. Leva 1 minuto e você já tem painel ativo.',
    duration: '~1 min',
    emoji: '✨',
  },
  {
    number: '02',
    title: 'Configure sua loja',
    description: 'Nome, logo, produtos e formas de pagamento. Tudo guiado, sem complicação.',
    duration: '~5 min',
    emoji: '🛍️',
  },
  {
    number: '03',
    title: 'Comece a vender',
    description: 'Compartilhe o link da sua loja. Receba pedidos no painel e venda no automático.',
    duration: 'agora',
    emoji: '🚀',
  },
]

/* ─── FAQ ────────────────────────────────────────────────────── */
export const FAQ_ITEMS: FaqItem[] = [
  { q: 'Posso cancelar quando quiser?', a: 'Sim. Cancela em um clique no painel, sem multa nem burocracia. Você usa até o fim do período pago e pronto.' },
  { q: 'Tem taxa de transação por venda?', a: 'Não cobramos taxa de transação. Você paga só a mensalidade do plano. As taxas de Pix, cartão ou boleto são as do gateway de pagamento (Asaas), as menores do mercado.' },
  { q: 'Posso usar meu próprio domínio?', a: 'No plano Max, sim — sualoja.com.br aponta direto pra Nexo. Nos outros planos sua loja fica em nexo.app/sualoja.' },
  { q: 'Como faço pra emitir nota fiscal?', a: 'No plano Pro e Max você conecta o Bling ERP e a NF é emitida automaticamente a cada pedido pago, com seu CNPJ. Leva 30 segundos pra configurar.' },
  { q: 'O atendimento é em português?', a: 'Tudo em português, com gente de verdade. Chat de seg-sex 9h–19h em todos os planos. No Max, suporte 24/7.' },
  { q: 'Tem trial gratuito?', a: 'Tem. 14 dias grátis em qualquer plano, sem cartão de crédito. Você cria a loja, testa, e só paga se gostar.' },
  { q: 'Já tenho loja em outra plataforma. Consigo migrar?', a: 'Sim. Importamos seu catálogo (CSV ou via integração) e nosso time ajuda na migração. Sem custo, em qualquer plano.' },
  { q: 'Os pagamentos caem direto na minha conta?', a: 'Sim. Você cria sua conta no Asaas (gratuita), conecta com a Nexo, e o dinheiro cai direto pra você — sem passar pela gente.' },
]

/* ─── Footer ─────────────────────────────────────────────────── */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: 'Produto',
    links: [
      { label: 'Recursos', href: '#features' },
      { label: 'Planos', href: '#pricing' },
      { label: 'Demonstração', href: '#' },
      { label: 'Novidades', href: '#' },
    ],
  },
  {
    heading: 'Empresa',
    links: [
      { label: 'Sobre', href: '#' },
      { label: 'Contato', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Carreiras', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Termos de uso', href: '#' },
      { label: 'Privacidade', href: '#' },
      { label: 'Cookies', href: '#' },
      { label: 'Status', href: '#' },
    ],
  },
]

export const FOOTER_TAGLINE = 'Sua loja virtual, sem complicação. Da criação ao primeiro pedido em menos de 10 minutos.'
export const FOOTER_LEGAL = '© 2026 Nexo Comércio Digital · CNPJ 00.000.000/0001-00'
export const FOOTER_FLAG = 'feito no Brasil 🇧🇷'

/* ─── Hero copy ──────────────────────────────────────────────── */
export const HERO_COPY = {
  badge: 'Beta aberto · sem cartão',
  headlineLead: 'Sua loja virtual completa,',
  headlineHighlight: 'pronta em minutos.',
  description: 'Crie, venda e cresça com a plataforma que conecta você aos seus clientes. Sem código, sem mensalidade alta, sem dor de cabeça.',
  primaryCta: { label: 'Começar grátis', href: '/assinatura' },
  secondaryCta: { label: 'Ver demonstração', href: '#features' },
}

/* ─── Pricing copy ───────────────────────────────────────────── */
export const PRICING_COPY = {
  eyebrow: 'Planos',
  title: 'Escolha o plano que',
  titleHighlight: 'cresce com você',
  subtitle: 'Sem taxa de transação. Sem letras miúdas. Cancele quando quiser.',
  trialNote: 'Todos os planos com 14 dias grátis.',
  trialLink: { label: 'Comparar todos os recursos →', href: '/assinatura' },
}

/* ─── Bento copy ─────────────────────────────────────────────── */
export const BENTO_COPY = {
  eyebrow: 'Tudo numa só plataforma',
  title: 'Recursos que',
  titleHighlight: 'vendem por você',
  subtitle: 'Você foca em criar produtos. O Nexo cuida do resto — do catálogo ao financeiro.',
}

/* ─── How it works copy ──────────────────────────────────────── */
export const STEPS_COPY = {
  eyebrow: '3 passos',
  title: 'Da ideia ao primeiro pedido em',
  titleHighlight: 'menos de 10 minutos',
}

/* ─── FAQ copy ───────────────────────────────────────────────── */
export const FAQ_COPY = {
  eyebrow: 'Dúvidas',
  title: 'Perguntas',
  titleHighlight: 'frequentes',
  helpTitle: 'Não encontrou sua resposta?',
  helpSubtitle: 'Fala com a gente no WhatsApp. Resposta em até 5 minutos no horário comercial.',
  helpCta: 'Conversar no WhatsApp',
}

/* ─── Final CTA copy ─────────────────────────────────────────── */
export const FINAL_CTA_COPY = {
  badge: 'Beta aberto',
  titleLine1: 'Pare de vender pelo WhatsApp.',
  titleLine2: 'Comece de verdade.',
  description: '14 dias grátis, sem cartão. Em 10 minutos sua loja está no ar recebendo pedido.',
  primaryCta: { label: 'Criar minha loja agora', href: '/assinatura' },
  secondaryCta: { label: 'Ou veja a demo (2 min)', href: '#' },
}
