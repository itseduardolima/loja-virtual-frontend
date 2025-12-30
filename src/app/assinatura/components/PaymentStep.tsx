import { motion } from "framer-motion";

interface PaymentStepProps {
  qrCode: string | null;
  onRedirectToPayment: () => void;
}

export function PaymentStep({ qrCode, onRedirectToPayment }: PaymentStepProps) {
  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-200 shadow-lg flex items-center justify-center">
          {qrCode ? (
            <img
              src={
                qrCode.startsWith("data:image") || qrCode.startsWith("http")
                  ? qrCode
                  : `data:image/png;base64,${qrCode}`
              }
              alt="QR Code PIX"
              className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="text-center p-4">
                      <p class="text-red-600 mb-2">Erro ao carregar QR Code</p>
                      <p class="text-sm text-gray-600">Use o botão abaixo para abrir o link de pagamento</p>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className="text-center p-4">
              <p className="text-gray-600">QR Code não disponível</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          Escaneie o QR Code com o app do seu banco ou clique no botão
          abaixo para pagar em outra tela
        </p>
        <motion.button
          onClick={onRedirectToPayment}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-black/80 shadow-lg hover:shadow-xl w-full sm:w-auto"
        >
          Abrir Link de Pagamento
        </motion.button>
      </div>
    </motion.div>
  );
}

