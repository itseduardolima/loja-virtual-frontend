export function WelcomeCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-nxborder bg-gradient-to-br from-white to-nxbg p-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-nxa/5 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-nxp/5 blur-2xl" />
      </div>
      <div className="relative">
        <p className="mb-2 text-[11.5px] font-bold uppercase tracking-widest text-nxa">Bem-vindo à Loja Virtual</p>
        <h2 className="mb-3 text-[28px] font-bold leading-tight tracking-tight text-nxi1">
          Escolha um plano para começar a vender
        </h2>
        <p className="mb-4 max-w-xl text-[14px] font-medium text-nxi2">
          Você ainda não tem uma assinatura ativa. Escolha o plano que faz sentido pro tamanho da sua operação — pode trocar a qualquer momento.
        </p>
        <p className="text-[12px] font-bold uppercase tracking-widest text-nxi3">Compare os planos abaixo →</p>
      </div>
    </div>
  )
}
