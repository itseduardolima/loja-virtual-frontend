import { motion } from "framer-motion";
import { Check, Sparkles, Ticket } from "lucide-react";
import { formatDateLong } from "@/lib/utils";

export type CompletedReason = "paid" | "trial" | "coupon";

interface CompletedStepProps {
  onGoToDashboard: () => void;
  reason?: CompletedReason;
  trialDays?: number | null;
  couponCode?: string | null;
  freeAccessUntil?: string | null;
}

interface StepCopy {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  nextSteps: string;
  buttonLabel: string;
}

function getCopy(props: CompletedStepProps): StepCopy {
  const { reason, trialDays, couponCode, freeAccessUntil } = props;

  if (reason === "trial") {
    const days = trialDays ?? null;
    return {
      icon: Sparkles,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Trial ativado!",
      subtitle: days
        ? `Você tem ${days} dias de acesso completo, sem cartão de crédito.`
        : "Seu acesso gratuito está liberado.",
      nextSteps: freeAccessUntil
        ? `Aproveite até ${formatDateLong(freeAccessUntil)}. Para continuar depois desse prazo, você poderá assinar um plano em "Meu Plano".`
        : 'Crie sua loja agora e comece a vender. Quando o trial acabar, você escolhe um plano em "Meu Plano".',
      buttonLabel: "Criar minha loja",
    };
  }

  if (reason === "coupon") {
    return {
      icon: Ticket,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "Acesso liberado!",
      subtitle: couponCode
        ? `Cupom ${couponCode} aplicado — você tem acesso gratuito durante o período do desconto.`
        : "Seu cupom foi aplicado e você tem acesso gratuito durante o período do desconto.",
      nextSteps: freeAccessUntil
        ? `Sua conta é vendedor até ${formatDateLong(freeAccessUntil)}. Depois, será necessário assinar para continuar.`
        : "Sua conta foi atualizada para o perfil de vendedor. Crie sua loja e comece a vender agora.",
      buttonLabel: "Criar minha loja",
    };
  }

  // default: paid
  return {
    icon: Check,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Assinatura Confirmada!",
    subtitle: "Seu pagamento foi confirmado com sucesso e sua assinatura está ativa!",
    nextSteps:
      "Sua conta foi atualizada para o perfil de vendedor. Crie sua loja e comece a vender agora mesmo!",
    buttonLabel: "Criar minha loja",
  };
}

export function CompletedStep(props: CompletedStepProps) {
  const copy = getCopy(props);
  const Icon = copy.icon;

  return (
    <motion.div
      key="completed"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-8 sm:p-12 max-w-2xl mx-auto shadow-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className={`w-20 h-20 ${copy.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}
        >
          <Icon className={`w-12 h-12 ${copy.iconColor}`} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          {copy.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg sm:text-xl text-gray-600 mb-6"
        >
          {copy.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-6"
        >
          <p className="text-sm sm:text-base text-gray-700 mb-2">
            <strong>Próximos passos:</strong>
          </p>
          <p className="text-sm sm:text-base text-gray-600">{copy.nextSteps}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <motion.button
            onClick={props.onGoToDashboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-black/80 shadow-lg hover:shadow-xl transition-all"
          >
            {copy.buttonLabel}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
