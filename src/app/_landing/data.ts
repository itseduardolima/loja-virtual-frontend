export interface FaqItem { q: string; a: string }
export interface Step { number: string; title: string; description: string; duration: string; emoji: string }

/* ─── Hero ───────────────────────────────────────────────────── */
export const HERO_FACES = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=face',
]

/* ─── Proof sellers ──────────────────────────────────────────── */
export const PROOF_SELLERS = [
  { name: 'Camila R.', city: 'São Paulo', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face' },
  { name: 'João P.', city: 'Belo Horizonte', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
  { name: 'Liana M.', city: 'Recife', img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face' },
  { name: 'André S.', city: 'Porto Alegre', img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=face' },
]

/* ─── Testimonials ───────────────────────────────────────────── */
export const TESTIMONIALS = [
  {
    quote: 'Em 20 minutos montei minha loja e já fiz minha primeira venda. Nunca mais vou vender pelo WhatsApp.',
    name: 'Camila Rocha',
    role: 'Confeiteira artesanal · São Paulo',
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face',
    rating: 5,
  },
  {
    quote: 'Eu controlava tudo em planilha e WhatsApp. Hoje uso o Nexo e perdi zero pedido no último mês.',
    name: 'João Paulo',
    role: 'Loja de eletrônicos · Belo Horizonte',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
  },
  {
    quote: 'O suporte em português foi decisivo. Eles me ajudaram a configurar o Pix em 5 minutos.',
    name: 'Liana Menezes',
    role: 'Moda feminina · Recife',
    img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 5,
  },
]

/* ─── How it works ───────────────────────────────────────────── */
export const HOW_IT_WORKS_STEPS: Step[] = [
  {
    number: '01',
    title: 'Crie sua conta',
    description: 'Sem cartão de crédito. Leva 1 minuto e você já tem painel ativo.',
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
export const FAQS: FaqItem[] = [
  {
    q: 'Tem taxa de transação por venda?',
    a: 'Não. Zero vírgula zero de taxa. Você paga só a mensalidade do plano. As taxas de Pix, cartão e boleto são as do gateway de pagamento (Asaas), e caem direto na sua conta — sem passar pela gente.',
  },
  {
    q: 'Como o pagamento funciona na prática?',
    a: 'Você cria sua conta no Asaas (gratuito), conecta à Nexo, e o dinheiro do cliente vai direto pra você. A Nexo só cobra a mensalidade do plano — são dois fluxos separados, sem comissão nossa.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim. Cancela em um clique no painel, sem multa nem burocracia. Você usa até o fim do período pago e pronto.',
  },
  {
    q: 'Posso usar meu próprio domínio?',
    a: 'No plano Max, sim — sualoja.com.br aponta direto pra Nexo. Nos outros planos sua loja fica em nexo.app/loja/sualoja.',
  },
  {
    q: 'Como faço pra emitir nota fiscal?',
    a: 'No plano Pro e Max você conecta o Bling ERP e a NF é emitida automaticamente a cada pedido pago, com seu CNPJ. Leva 30 segundos pra configurar.',
  },
  {
    q: 'O atendimento é em português?',
    a: 'Tudo em português, com gente de verdade. Chat de seg–sex 9h–19h em todos os planos. No Max, suporte 24/7.',
  },
  {
    q: 'Já tenho loja em outra plataforma. Consigo migrar?',
    a: 'Sim. Importamos seu catálogo via CSV ou integração e nosso time ajuda na migração sem custo, em qualquer plano.',
  },
]

/* ─── Footer ─────────────────────────────────────────────────── */
export const FOOTER_COLUMNS = [
  {
    heading: 'Produto',
    links: [
      { label: 'Recursos', href: '#recursos' },
      { label: 'Planos', href: '#precos' },
      { label: 'Como funciona', href: '#como' },
    ],
  },
  {
    heading: 'Empresa',
    links: [
      { label: 'Sobre', href: '#' },
      { label: 'Contato', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Termos de uso', href: '#' },
      { label: 'Privacidade', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  },
]
