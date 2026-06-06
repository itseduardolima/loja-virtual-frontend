// Copy contextual das telas de auth (design Login.html).
// vendedor → entrada do painel da plataforma; cliente → comprador vindo de uma loja (?redirect=/loja/...)

export type AuthCtx = 'vendedor' | 'cliente'

/** Conteúdo do painel esquerdo — subconjunto usado pelo AuthLeftPanel (custom em fluxos como /assinatura) */
export interface AuthPanelContent {
  panelTitle: string
  panelSub: string
  bullets: string[]
  footer: string
}

export interface AuthContent extends AuthPanelContent {
  h1: string
  sub: string
  signup: [prefix: string, label: string]
}

export const AUTH_CONTENT: Record<AuthCtx, AuthContent> = {
  vendedor: {
    panelTitle: 'Venda online.\nCresça de verdade.',
    panelSub: 'Tudo que você precisa para vender mais, num só lugar.',
    bullets: [
      'Loja própria no ar em minutos',
      'Gestão de pedidos e catálogo',
      'Relatórios e suporte em tempo real',
    ],
    footer: '+2.400 vendedores ativos na plataforma',
    h1: 'Bem-vindo de volta',
    sub: 'Entre no seu painel para continuar.',
    signup: ['Ainda não vende na Nexo?', 'Criar loja grátis'],
  },
  cliente: {
    panelTitle: 'Suas compras,\norganizadas.',
    panelSub: 'Acompanhe pedidos, favoritos e endereços num só lugar.',
    bullets: [
      'Acompanhe seus pedidos em tempo real',
      'Salve seus produtos favoritos',
      'Compras mais rápidas nas lojas Nexo',
    ],
    footer: 'Comprando com segurança em lojas Nexo',
    h1: 'Entrar na sua conta',
    sub: 'Acesse seus pedidos e favoritos.',
    signup: ['Ainda não tem conta?', 'Criar conta'],
  },
}
