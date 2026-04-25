"use client";

import { motion } from "framer-motion";
import { Check, X, Zap, Flame, Star } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription";

interface PlanSelectionStepProps {
  plans: SubscriptionPlan[];
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

interface FeatureRow {
  label: string;
  included: boolean;
}

const PLAN_ICONS: Record<string, React.ReactNode> = {
  "plano-basico": <Zap className="w-4 h-4" />,
  "plano-pro": <Flame className="w-4 h-4" />,
  "plano-max": <Star className="w-4 h-4" />,
};

function getPlanFeatures(plan: SubscriptionPlan): FeatureRow[] {
  const slug = plan.slug;
  const isBasico = slug === "plano-basico";
  const isMax = slug === "plano-max";

  const productLabel =
    plan.max_products == null
      ? "Produtos ilimitados"
      : `Até ${plan.max_products} produtos`;

  return [
    { label: productLabel, included: true },
    { label: "Dashboard", included: true },
    { label: "Gestão de pedidos", included: true },
    { label: "Integração Bling ERP", included: !isBasico },
    { label: "Suporte prioritário 24/7", included: isMax },
  ];
}

function parsePlanPrice(plan: SubscriptionPlan): number {
  return typeof plan.price === "string" ? parseFloat(plan.price) : plan.price || 0;
}

const FEATURED_SLUG = "plano-pro";

export function PlanSelectionStep({ plans, onSelectPlan }: PlanSelectionStepProps) {
  return (
    <motion.div
      key="plan"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Escolha seu plano
        </h1>
        <p className="text-gray-500 text-base max-w-xl mx-auto">
          Todos os planos incluem cupons de desconto e acesso completo ao dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {plans.map((plan, i) => {
          const price = parsePlanPrice(plan);
          const priceStr = price.toFixed(2).replace(".", ",");
          const [priceInt, priceDec] = priceStr.split(",");
          const features = getPlanFeatures(plan);
          const isFeatured = plan.slug === FEATURED_SLUG;
          const icon = PLAN_ICONS[plan.slug] ?? <Zap className="w-4 h-4" />;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.07 }}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                isFeatured
                  ? "border-gray-900 bg-gray-900 text-white shadow-xl"
                  : "border-gray-200 bg-white text-gray-900"
              }`}
            >
              {isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-white text-gray-900 border border-gray-200 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    <Flame className="w-3 h-3 text-orange-500" />
                    Mais popular
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-5">
                <div className={`inline-flex items-center gap-2 text-xs font-semibold mb-3 px-2.5 py-1 rounded-full ${
                  isFeatured ? "bg-white/15 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  {icon}
                  {plan.name}
                </div>

                <div className="flex items-start gap-0.5">
                  <span className={`text-sm font-medium mt-1.5 ${isFeatured ? "text-gray-300" : "text-gray-500"}`}>
                    R$
                  </span>
                  <span className="text-4xl font-bold leading-none tracking-tight">
                    {priceInt}
                  </span>
                  <div className="flex flex-col mt-1 ml-0.5">
                    <span className="text-lg font-bold leading-none">,{priceDec}</span>
                    <span className={`text-xs mt-1 ${isFeatured ? "text-gray-400" : "text-gray-400"}`}>
                      /mês
                    </span>
                  </div>
                </div>

                <p className={`text-xs mt-2 leading-relaxed ${isFeatured ? "text-gray-400" : "text-gray-500"}`}>
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2.5 mb-6 flex-1">
                {features.map((feat, j) => (
                  <div key={j} className="flex items-center gap-2.5">
                    {feat.included ? (
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isFeatured ? "bg-white/20" : "bg-gray-900"
                      }`}>
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200">
                        <X className="w-2.5 h-2.5 text-gray-400" strokeWidth={3} />
                      </div>
                    )}
                    <span className={`text-sm ${
                      feat.included
                        ? isFeatured ? "text-gray-100" : "text-gray-700"
                        : "text-gray-400 line-through"
                    }`}>
                      {feat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={() => onSelectPlan(plan)}
                className={`w-full h-11 rounded-xl font-semibold text-sm transition-all ${
                  isFeatured
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                Escolher {plan.name}
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
