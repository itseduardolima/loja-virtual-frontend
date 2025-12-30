import { SectionHeader } from './SectionHeader'
import { PricingCard } from './PricingCard'

const planFeatures = [
  { text: 'Produtos ilimitados' },
  { text: '1 loja personalizada' },
  { text: 'Gestão completa de pedidos' },
  { text: 'Dashboard de vendas completo' },
  { text: 'Suporte e atualizações' },
]

export function PricingSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Planos Simples e Transparentes"
          description="Comece com o plano que oferece tudo que você precisa para começar a vender"
        />
        <div className="max-w-md mx-auto px-2">
          <PricingCard
            name="Plano Vendedor"
            description="Plano mensal para vendedores"
            price="29,90"
            period="mês"
            features={planFeatures}
            ctaText="Começar Agora"
            ctaHref="/assinatura"
          />
        </div>
      </div>
    </section>
  )
}

