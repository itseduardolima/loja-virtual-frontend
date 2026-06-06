import { motion } from 'framer-motion'

interface PaymentStepProps {
  qrCode: string | null
  onRedirectToPayment: () => void
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
      <div className="mb-6 flex justify-center sm:mb-8">
        <div className="flex items-center justify-center rounded-2xl border border-nxborder bg-white p-4 shadow-sm sm:p-6">
          {qrCode ? (
            <img
              src={
                qrCode.startsWith('data:image') || qrCode.startsWith('http')
                  ? qrCode
                  : `data:image/png;base64,${qrCode}`
              }
              alt="QR Code PIX"
              className="h-64 w-64 object-contain sm:h-80 sm:w-80"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `
                    <div class="text-center p-4">
                      <p class="text-nxd font-bold mb-2">Erro ao carregar QR Code</p>
                      <p class="text-sm text-nxi2">Use o botão abaixo para abrir o link de pagamento</p>
                    </div>
                  `
                }
              }}
            />
          ) : (
            <div className="p-4 text-center">
              <p className="text-nxi2">QR Code não disponível</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <p className="mb-4 text-[14px] text-nxi2 sm:mb-6">
          Escaneie o QR Code com o app do seu banco ou clique no botão abaixo para pagar em outra
          tela
        </p>
        <button
          onClick={onRedirectToPayment}
          className="h-12 w-full rounded-xl bg-nxp px-8 text-[14.5px] font-bold text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.3)] transition-[transform,background-color] hover:bg-nxp/90 active:scale-[0.99] sm:w-auto"
        >
          Abrir link de pagamento
        </button>
      </div>
    </motion.div>
  )
}
