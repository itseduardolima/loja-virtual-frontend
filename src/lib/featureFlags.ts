/**
 * Feature flags da aplicação.
 *
 * As flags são lidas de variáveis `NEXT_PUBLIC_*` em tempo de build — o Next.js
 * substitui a expressão literal `process.env.NEXT_PUBLIC_ALGO` no bundle, então
 * sempre acesse pela expressão completa (não desestruture `process.env`).
 *
 * Padrão: desligada. Só liga com o valor "true" ou "1".
 */

function isEnabled(value: string | undefined): boolean {
  return value === 'true' || value === '1'
}

/**
 * Tela de Equipe (Configurações → Equipe): membros, papéis e convites.
 *
 * DESLIGADA por decisão de produto. A tela existe apenas como protótipo visual:
 * a lista de membros, os papéis e o log de atividade são mock hardcoded no
 * front (`equipe/useEquipePage.ts` e `equipe/page.tsx`) e NÃO existe backend
 * algum por trás — nenhum endpoint de convite, de papel/permissão por usuário
 * da loja ou de auditoria. Deixá-la visível prometeria ao lojista um recurso
 * inexistente (ele acha que deu acesso ao contador e não deu).
 *
 * Para religar quando o backend existir:
 *   1. Implementar no backend: convite de usuário para a loja (com envio de
 *      e-mail e aceite), papéis/permissões por usuário respeitando o
 *      `store_id`, e o log de auditoria das ações da equipe.
 *   2. Trocar `INITIAL_MEMBERS` (useEquipePage.ts) e `AUDIT_LOG` (page.tsx)
 *      por hooks de dados reais, e ligar os handlers às rotas da API.
 *   3. Definir `NEXT_PUBLIC_FEATURE_EQUIPE=true` no ambiente.
 *
 * Com a flag ligada, o item volta ao menu de Configurações
 * (`vendedor/configuracoes/layout.tsx`) e a rota
 * `/vendedor/configuracoes/equipe` deixa de redirecionar
 * (`vendedor/configuracoes/equipe/layout.tsx`).
 */
export const FEATURE_EQUIPE = isEnabled(process.env.NEXT_PUBLIC_FEATURE_EQUIPE)
