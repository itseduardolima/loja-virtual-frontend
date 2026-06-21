import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { NxButton } from '@/app/vendedor/configuracoes/_shared'

interface NavBarProps {
  currentStep: number
  isStepValid: boolean
  isCreating: boolean
  onBack: () => void
  onNext: () => void
}

export function NavBar({ currentStep, isStepValid, isCreating, onBack, onNext }: NavBarProps) {
  const isLast = currentStep === 3

  const ctaLabel = isLast ? (
    <>
      <Check className="h-4 w-4" />
      Criar loja
    </>
  ) : (
    <>
      Próximo
      <ArrowRight className="h-4 w-4" />
    </>
  )

  return (
    <div className="shrink-0 border-t border-nxborder bg-white">
      {/* Desktop */}
      <div className="hidden h-16 items-center justify-between px-12 sm:flex">
        {currentStep > 1 ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-nxi3 transition-colors hover:text-nxi1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Anterior
          </button>
        ) : (
          <span />
        )}
        <NxButton onClick={onNext} disabled={!isStepValid} loading={isCreating} className="h-11 px-8">
          {isCreating ? 'Criando…' : ctaLabel}
        </NxButton>
      </div>

      {/* Mobile: CTA on top, back below */}
      <div className="flex flex-col-reverse gap-2 px-6 py-4 sm:hidden">
        {currentStep > 1 && (
          <button
            onClick={onBack}
            className="py-2 text-center text-[13px] font-semibold text-nxi3 transition-colors hover:text-nxi1"
          >
            ← Anterior
          </button>
        )}
        <NxButton
          onClick={onNext}
          disabled={!isStepValid}
          loading={isCreating}
          className="h-11 w-full"
        >
          {isCreating ? 'Criando…' : ctaLabel}
        </NxButton>
      </div>
    </div>
  )
}
