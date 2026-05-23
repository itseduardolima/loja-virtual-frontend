'use client'

import { useCreateStorePage } from './useCreateStorePage'
import { LoadingPage, Button } from '@/components'
import { ArrowRight, Check } from 'lucide-react'
import { LeftPanel } from './components/LeftPanel'
import { ProgressTrack } from './components/ProgressTrack'
import { MobileStepper } from './components/MobileStepper'
import { NavBar } from './components/NavBar'
import { StepBasicInfo } from './components/StepBasicInfo'
import { StepNiche } from './components/StepNiche'
import { StepContact } from './components/StepContact'

export default function CriarLojaPage() {
  const h = useCreateStorePage()

  const errors = (step: 1 | 2 | 3) => h.stepErrors[step - 1] as Record<string, string>

  if (h.loading) return <LoadingPage />

  /* ── Já tem loja ── */
  if (h.hasStore) {
    return (
      <div className="flex h-screen overflow-hidden">
        <LeftPanel step={1} />
        <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="w-5 h-5 text-green-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sua loja está pronta</h2>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-7">
            Você já tem uma loja ativa.{' '}
            {h.store?.name && <><strong>{h.store.name}</strong> está no ar. </>}
            Vá para o painel para gerenciá-la.
          </p>
          <Button
            onClick={() => h.router?.push('/vendedor')}
            className="flex items-center gap-2 px-8 h-11"
          >
            Ir para o painel
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  /* ── Wizard ── */
  return (
    <div className="flex h-screen overflow-hidden">
      <LeftPanel step={h.currentStep} />

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <MobileStepper step={h.currentStep} />

        <div className="flex-shrink-0">
          <div className="hidden md:flex justify-end px-12 pt-8 pb-3">
            <span className="text-sm text-gray-500">Passo {h.currentStep} de 3</span>
          </div>
          <ProgressTrack step={h.currentStep} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 sm:px-12 pt-10 pb-6">
            {h.currentStep === 1 && (
              <StepBasicInfo
                formData={h.formData}
                logoPreview={h.logoPreview}
                bannerPreview={h.bannerPreview}
                errors={errors(1)}
                onChange={h.handleInputChange}
                onFile={h.handleFileChange}
              />
            )}
            {h.currentStep === 2 && (
              <StepNiche
                selectedIds={h.formData.niche_ids}
                nichesData={h.nichesData}
                nichesLoading={h.nichesLoading}
                errors={errors(2)}
                onToggle={h.handleNicheToggle}
              />
            )}
            {h.currentStep === 3 && (
              <StepContact
                formData={h.formData}
                selectedCountry={h.selectedCountry}
                setSelectedCountry={h.setSelectedCountry}
                countriesData={h.countriesData}
                countriesLoading={h.countriesLoading}
                errors={errors(3)}
                onChange={h.handleInputChange}
                router={h.router}
              />
            )}
          </div>
        </div>

        <NavBar
          currentStep={h.currentStep}
          isStepValid={h.isStepValid}
          isCreating={h.isCreating}
          onBack={h.prevStep}
          onNext={h.currentStep < 3 ? h.nextStep : h.handleSubmit}
        />
      </div>
    </div>
  )
}
