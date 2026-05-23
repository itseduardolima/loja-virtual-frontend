import { Button } from '@/components'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'

interface NavBarProps {
  currentStep: number
  isStepValid: boolean
  isCreating: boolean
  onBack: () => void
  onNext: () => void
}

export function NavBar({ currentStep, isStepValid, isCreating, onBack, onNext }: NavBarProps) {
  const isLast = currentStep === 3

  const ctaLabel = isCreating ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin" />
      Criando...
    </>
  ) : isLast ? (
    <>
      <Check className="w-4 h-4" />
      Criar Loja
    </>
  ) : (
    <>
      Próximo
      <ArrowRight className="w-4 h-4" />
    </>
  )

  return (
    <div className="flex-shrink-0 bg-white border-t border-gray-100">
      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-between px-12" style={{ height: 64 }}>
        {currentStep > 1 ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Anterior
          </button>
        ) : (
          <span />
        )}
        <Button
          onClick={onNext}
          disabled={!isStepValid || isCreating}
          className="flex items-center gap-2 h-11 px-8 bg-[#1E3A5F] hover:bg-[#17304f]"
        >
          {ctaLabel}
        </Button>
      </div>

      {/* Mobile: CTA on top, back below */}
      <div className="sm:hidden flex flex-col-reverse gap-2 px-6 py-4">
        {currentStep > 1 && (
          <button
            onClick={onBack}
            className="text-sm text-center text-gray-400 hover:text-gray-700 transition-colors py-2"
          >
            ← Anterior
          </button>
        )}
        <Button
          onClick={onNext}
          disabled={!isStepValid || isCreating}
          className="w-full h-11 flex items-center justify-center gap-2 bg-[#1E3A5F] hover:bg-[#17304f]"
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  )
}
