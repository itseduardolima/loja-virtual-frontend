import { Input, Label } from '@/components'
import { PhoneCountryInput } from '@/components/Form/PhoneCountryInput'
import { Phone, Mail, Instagram, Facebook } from 'lucide-react'
import { cn } from '@/lib/utils'
import { extractHandle, toInstagramUrl, toFacebookUrl } from '../utils/social'
import type { CreateStoreData } from '@/hooks/useCreateStore'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface StepContactProps {
  formData: CreateStoreData
  selectedCountry: string
  setSelectedCountry: (v: string) => void
  countriesData: any
  countriesLoading: boolean
  errors: Record<string, string>
  onChange: (field: keyof CreateStoreData, value: any) => void
  router: AppRouterInstance | null
}

export function StepContact({
  formData,
  selectedCountry,
  setSelectedCountry,
  countriesData,
  countriesLoading,
  errors,
  onChange,
  router,
}: StepContactProps) {
  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-semibold text-gray-900 leading-tight text-2xl sm:text-3xl">
          Como os clientes falam com você?
        </h2>
        <p className="text-sm text-gray-500 mt-1.5">WhatsApp e email são obrigatórios.</p>
      </div>

      {/* WhatsApp */}
      <div>
        <Label className="text-[13px] font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-green-500" />
          WhatsApp <span className="text-red-400">*</span>
        </Label>
        <PhoneCountryInput
          id="whatsapp"
          value={formData.whatsapp ?? ''}
          onValueChange={(val) => onChange('whatsapp', val)}
          placeholder="(11) 99999-9999"
          minLength={8}
          maxLength={15}
          required
          selectedCountry={selectedCountry}
          onSelectedCountryChange={setSelectedCountry}
          countriesData={countriesData}
          countriesLoading={countriesLoading}
          inputClassName={cn('flex-1 min-w-0 h-10', errors.whatsapp && 'border-red-400')}
        />
        {errors.whatsapp && <p className="text-xs text-red-400 mt-1">{errors.whatsapp}</p>}
      </div>

      {/* Email */}
      <div>
        <Label className="text-[13px] font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-gray-400" />
          Email <span className="text-red-400">*</span>
        </Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="contato@minhaloja.com.br"
          className={cn(
            'focus-visible:ring-[#1E3A5F]/20 focus-visible:border-[#1E3A5F]',
            errors.email && 'border-red-400',
          )}
        />
        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
      </div>

      {/* Social */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Instagram */}
        <div>
          <Label className="text-[13px] font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            Instagram
            <span className="text-[10px] font-normal px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded leading-none">
              opcional
            </span>
          </Label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 select-none pointer-events-none">
              @
            </span>
            <Input
              type="text"
              value={extractHandle(formData.instagram ?? '')}
              onChange={(e) => onChange('instagram', toInstagramUrl(e.target.value))}
              placeholder="minhaloja"
              className={cn(
                'pl-7 focus-visible:ring-[#1E3A5F]/20 focus-visible:border-[#1E3A5F]',
                errors.instagram && 'border-red-400',
              )}
            />
          </div>
          {extractHandle(formData.instagram ?? '') && (
            <p className="text-xs text-gray-400 mt-1.5">
              instagram.com/<strong className="text-gray-600">{extractHandle(formData.instagram ?? '')}</strong>
            </p>
          )}
          {errors.instagram && <p className="text-xs text-red-400 mt-1">{errors.instagram}</p>}
        </div>

        {/* Facebook */}
        <div>
          <Label className="text-[13px] font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <Facebook className="w-3.5 h-3.5 text-blue-400" />
            Facebook
            <span className="text-[10px] font-normal px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded leading-none">
              opcional
            </span>
          </Label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 select-none pointer-events-none whitespace-nowrap">
              fb.com/
            </span>
            <Input
              type="text"
              value={extractHandle(formData.facebook ?? '')}
              onChange={(e) => onChange('facebook', toFacebookUrl(e.target.value))}
              placeholder="minhaloja"
              className={cn(
                'pl-[62px] focus-visible:ring-[#1E3A5F]/20 focus-visible:border-[#1E3A5F]',
                errors.facebook && 'border-red-400',
              )}
            />
          </div>
          {extractHandle(formData.facebook ?? '') && (
            <p className="text-xs text-gray-400 mt-1.5">
              facebook.com/<strong className="text-gray-600">{extractHandle(formData.facebook ?? '')}</strong>
            </p>
          )}
          {errors.facebook && <p className="text-xs text-red-400 mt-1">{errors.facebook}</p>}
        </div>
      </div>

      {/* Footnote */}
      <p className="text-[13px] italic text-gray-400">
        Endereço, formas de pagamento e horários ficam em{' '}
        <span
          className="not-italic font-semibold text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
          onClick={() => router?.push('/vendedor/configuracoes/informacoes-basicas')}
        >
          Configurações →
        </span>
      </p>
    </div>
  )
}
