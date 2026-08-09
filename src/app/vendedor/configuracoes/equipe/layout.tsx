import { redirect } from 'next/navigation'
import { FEATURE_EQUIPE } from '@/lib/featureFlags'

/**
 * Guarda da rota de Equipe.
 *
 * Com `FEATURE_EQUIPE` desligada (padrão), o item some do menu de Configurações
 * — mas a URL direta ainda existiria. Este layout redireciona para o dashboard
 * do vendedor antes de a tela renderizar, para que ninguém veja os dados mock.
 *
 * A tela em si (page.tsx, useEquipePage.ts, _components/) foi preservada
 * intacta: basta ligar a flag para tudo voltar. Ver src/lib/featureFlags.ts.
 */
export default function EquipeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!FEATURE_EQUIPE) {
    redirect('/vendedor/dashboard')
  }

  return <>{children}</>
}
