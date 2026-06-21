'use client'

import { useCreateStorePage } from './useCreateStorePage'
import { LoadingPage } from '@/components'
import { ArrowRight, Check } from 'lucide-react'
import { AuthLeftPanel } from '@/components/Auth'
import { NxButton } from '@/app/vendedor/configuracoes/_shared'
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
        <AuthLeftPanel ctx="vendedor" />
        <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-nxs/10">
            <Check className="h-6 w-6 text-nxs" />
          </div>
          <h2 className="mb-2 text-[20px] font-extrabold tracking-[-0.02em] text-nxi1">
            Sua loja está pronta
          </h2>
          <p className="mb-7 max-w-xs text-[13px] leading-relaxed text-nxi2">
            Você já tem uma loja ativa.{' '}
            {h.store?.name && (
              <>
                <strong className="text-nxi1">{h.store.name}</strong> está no ar.{' '}
              </>
            )}
            Vá para o painel para gerenciá-la.
          </p>
          <NxButton onClick={() => h.router?.push('/vendedor')} className="h-11 px-8">
            Ir para o painel
            <ArrowRight className="h-4 w-4" />
          </NxButton>
        </div>
      </div>
    )
  }

  /* ── Wizard ── */
  return (
    <div className="flex h-screen overflow-hidden">
      <AuthLeftPanel ctx="vendedor" />

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <MobileStepper step={h.currentStep} />

        <div className="flex-shrink-0">
          <div className="hidden md:flex justify-end px-12 pt-8 pb-3">
            <span className="text-[12.5px] font-semibold text-nxi3">
              Passo {h.currentStep} de 3
            </span>
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
