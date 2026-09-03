import { Input } from '@/components'
import { PhoneCountryInput } from '@/components/Form'
import { FieldLabel, FieldHelp, nxInputClass } from '@/app/vendedor/configuracoes/_shared'
import { Phone, Mail, Instagram, Facebook, Youtube, Music2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { extractHandle, toInstagramUrl, toTiktokUrl } from '../utils/social'
import type { CreateStoreData } from '@/hooks/useCreateStore'
import type { Country } from '@/hooks/useCountries'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface StepContactProps {
  formData: CreateStoreData
  selectedCountry: string
  setSelectedCountry: (v: string) => void
  countriesData: Country[] | undefined
  countriesLoading: boolean
  errors: Record<string, string>
  onChange: (field: keyof CreateStoreData, value: CreateStoreData[keyof CreateStoreData]) => void
  router: AppRouterInstance | null
}

function OptionalBadge() {
  return (
    <span className="rounded-full bg-nxi3/[0.08] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-nxi3">
      opcional
    </span>
  )
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
    <div className="space-y-6">
      <div>
        <h2 className="text-[26px] font-extrabold leading-tight tracking-[-0.03em] text-nxi1">
          Como os clientes falam com você?
        </h2>
        <p className="mt-1 text-[13px] text-nxi2">WhatsApp e email são obrigatórios.</p>
      </div>

      {/* WhatsApp */}
      <div className="space-y-1.5">
        <FieldLabel required>
          <Phone className="h-3.5 w-3.5 text-nxs" />
          WhatsApp
        </FieldLabel>
        <PhoneCountryInput
          id="whatsapp"
          value={formData.whatsapp ?? ''}
          onValueChange={(val) => onChange('whatsapp', val)}
          placeholder="(11) 99999-9999"
          minLength={8}
          maxLength={15}
          required
          lockCountry
          selectedCountry={selectedCountry}
          onSelectedCountryChange={setSelectedCountry}
          countriesData={countriesData}
          countriesLoading={countriesLoading}
          inputClassName={cn('h-10 min-w-0 flex-1', errors.whatsapp && 'border-nxd')}
        />
        {errors.whatsapp && <FieldHelp variant="error">{errors.whatsapp}</FieldHelp>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <FieldLabel required>
          <Mail className="h-3.5 w-3.5 text-nxi3" />
          Email
        </FieldLabel>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="contato@minhaloja.com.br"
          className={cn(nxInputClass(!!errors.email), 'w-full')}
        />
        {errors.email && <FieldHelp variant="error">{errors.email}</FieldHelp>}
      </div>

      {/* Social */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Instagram */}
        <div className="space-y-1.5">
          <FieldLabel>
            <Instagram className="h-3.5 w-3.5 text-nxi3" />
            Instagram
            <OptionalBadge />
          </FieldLabel>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none text-[13px] text-nxi3">
              @
            </span>
            <Input
              type="text"
              value={extractHandle(formData.instagram ?? '')}
              onChange={(e) => onChange('instagram', toInstagramUrl(e.target.value))}
              placeholder="minhaloja"
              className={cn(nxInputClass(!!errors.instagram), 'w-full pl-7')}
            />
          </div>
          {extractHandle(formData.instagram ?? '') && (
            <FieldHelp>
              instagram.com/
              <strong className="text-nxi2">{extractHandle(formData.instagram ?? '')}</strong>
            </FieldHelp>
          )}
          {errors.instagram && <FieldHelp variant="error">{errors.instagram}</FieldHelp>}
        </div>

        {/* Facebook */}
        <div className="space-y-1.5">
          <FieldLabel>
            <Facebook className="h-3.5 w-3.5 text-nxi3" />
            Facebook
            <OptionalBadge />
          </FieldLabel>
          <Input
            type="url"
            value={formData.facebook ?? ''}
            onChange={(e) => onChange('facebook', e.target.value)}
            placeholder="https://facebook.com/sualoja"
            className={cn(nxInputClass(!!errors.facebook), 'w-full')}
          />
          {errors.facebook && <FieldHelp variant="error">{errors.facebook}</FieldHelp>}
        </div>

        {/* TikTok */}
        <div className="space-y-1.5">
          <FieldLabel>
            <Music2 className="h-3.5 w-3.5 text-nxi3" />
            TikTok
            <OptionalBadge />
          </FieldLabel>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none text-[13px] text-nxi3">
              @
            </span>
            <Input
              type="text"
              value={extractHandle(formData.tiktok ?? '')}
              onChange={(e) => onChange('tiktok', toTiktokUrl(e.target.value))}
              placeholder="minhaloja"
              className={cn(nxInputClass(!!errors.tiktok), 'w-full pl-7')}
            />
          </div>
          {extractHandle(formData.tiktok ?? '') && (
            <FieldHelp>
              tiktok.com/@
              <strong className="text-nxi2">{extractHandle(formData.tiktok ?? '')}</strong>
            </FieldHelp>
          )}
          {errors.tiktok && <FieldHelp variant="error">{errors.tiktok}</FieldHelp>}
        </div>

        {/* YouTube */}
        <div className="space-y-1.5">
          <FieldLabel>
            <Youtube className="h-3.5 w-3.5 text-nxi3" />
            YouTube
            <OptionalBadge />
          </FieldLabel>
          <Input
            type="url"
            value={formData.youtube ?? ''}
            onChange={(e) => onChange('youtube', e.target.value)}
            placeholder="https://youtube.com/@seucanal"
            className={cn(nxInputClass(!!errors.youtube), 'w-full')}
          />
          {errors.youtube && <FieldHelp variant="error">{errors.youtube}</FieldHelp>}
        </div>
      </div>

      {/* Footnote */}
      <p className="text-[12.5px] text-nxi3">
        Endereço, formas de pagamento e horários ficam em{' '}
        <button
          type="button"
          className="font-semibold text-nxp transition-colors hover:text-nxp/80"
          onClick={() => router?.push('/vendedor/configuracoes/informacoes-basicas')}
        >
          Configurações →
        </button>
      </p>
    </div>
  )
}
