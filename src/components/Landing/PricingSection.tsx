import { SectionHeader } from './SectionHeader'
import { PricingCard } from './PricingCard'

const basicFeatures = [
  { text: 'Até 30 produtos', included: true },
  { text: 'Dashboard', included: true },
  { text: 'Gestão de pedidos', included: true },
  { text: 'Integração Bling ERP', included: false },
  { text: 'Suporte prioritário 24/7', included: false },
]

const proFeatures = [
  { text: 'Até 100 produtos', included: true },
  { text: 'Dashboard', included: true },
  { text: 'Gestão de pedidos', included: true },
  { text: 'Integração Bling ERP', included: true },
  { text: 'Suporte prioritário 24/7', included: false },
]

const maxFeatures = [
  { text: 'Produtos ilimitados', included: true },
  { text: 'Dashboard', included: true },
  { text: 'Gestão de pedidos', included: true },
  { text: 'Integração Bling ERP', included: true },
  { text: 'Suporte prioritário 24/7', included: true },
]

export function PricingSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Planos Simples e Transparentes"
          description="Todos os planos incluem cupons de desconto. Escolha o que melhor se encaixa no seu negócio."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-2">
          <PricingCard
            name="Plano Básico"
            description="Para quem está começando"
            price="29,90"
            period="mês"
            features={basicFeatures}
            ctaText="Começar Agora"
            ctaHref="/assinatura"
            featured={false}
          />
          <PricingCard
            name="Plano Pro"
            description="Para escalar suas vendas"
            price="79,90"
            period="mês"
            features={proFeatures}
            ctaText="Assinar Pro"
            ctaHref="/assinatura"
            featured={true}
          />
          <PricingCard
            name="Plano Max"
            description="Máximo desempenho"
            price="149,90"
            period="mês"
            features={maxFeatures}
            ctaText="Assinar Max"
            ctaHref="/assinatura"
            featured={false}
          />
        </div>
      </div>
    </section>
  )
}
